import { Op } from 'sequelize';
import {
  ProjectBid, ProjectBidMilestone, ClientProject, ClientProjectSubCategory,
  User, CandidateProfile, Category, SubCategory, Industry, Education,
  ProfessionalDetail, ProjectDetail, Project, Sow, Payment, FreelancerCurrentCountryPreference,
} from '../../models';
import { calculatePagination } from '../../utils/pagination';
import subQuery from '../../utils/subQuery';
import env from '../../config/env';

// ---- Helpers ----

const isBidValid = async ({ userId, clientId, projectId }) => {
  const activeCountries = await FreelancerCurrentCountryPreference.findAll({
    where: { is_currrently_active: true }, attributes: ['country'],
  });
  const freelancerCity = await User.findOne({ where: { id: userId }, attributes: ['city'] });
  const clientInfo = await User.findOne({ where: { id: clientId }, attributes: ['country', 'city', 'state'] });
  const clientProject = await ClientProject.findOne({ where: { id: projectId } });

  const clientCountry = clientInfo?.country || null;
  const clientCity = clientInfo?.city || null;

  if (clientProject?.location_preferancer) {
    if (clientProject.location_preferancer === 'country') {
      if (clientCountry && !activeCountries.map((c) => c.country).includes(clientCountry)) return false;
    } else if (clientProject.location_preferancer === 'city') {
      if (clientCity !== freelancerCity?.city) return false;
    }
  }

  const acceptedBids = await ProjectBid.findAll({ where: { from_user_id: userId, status: 'accepted' } });
  const userLimits = await User.findOne({ where: { id: userId }, attributes: ['max_delivery_in_progress', 'max_proposal_value'] });

  if (acceptedBids.length > 0 && userLimits?.max_delivery_in_progress) {
    if (acceptedBids.length > userLimits.max_delivery_in_progress) return false;
  }

  if (clientProject?.project_amount_min && userLimits?.max_proposal_value) {
    if (userLimits.max_proposal_value < clientProject.project_amount_min) return false;
  }

  return true;
};

const appendResumeUrl = (profiles) => {
  if (!profiles?.length) return profiles;
  return profiles.map((p) => {
    if (p.candidate_resume) return { ...p, candidate_resume: `${env.app.baseUrl}/${p.candidate_resume}` };
    return p;
  });
};

// ---- Service Functions ----

/**
 * Create a project bid with optional candidate profiles.
 */
const createProjectBid = async ({ body, userId, files }) => {
  // Bug #018: Duplicate bid check — prevent a freelancer from bidding twice on the same project
  const existingBid = await ProjectBid.findOne({ where: { from_user_id: userId, project_id: body.project_id } });
  if (existingBid) {
    return { duplicate: true };
  }

  const clientProject = await ClientProject.findOne({ where: { id: body.project_id } });
  const data = { ...body, from_user_id: userId };

  data.is_bid_visible = await isBidValid({ userId, clientId: body.client_id, projectId: body.project_id });
  data.approved_by_admin = !clientProject?.created_by_admin;

  const projectBid = await ProjectBid.create(data);

  if (body.candidate_profiles) {
    let profiles = [];
    try { profiles = JSON.parse(body.candidate_profiles); } catch (e) { throw new Error('Invalid candidate profiles JSON'); }

    await Promise.all(profiles.map(async (profile, index) => {
      const resumeFile = files?.find((f) => f.fieldname === `customer_resume_${index}`);
      await CandidateProfile.create({
        project_bid_id: projectBid.id,
        candidate_name: profile.candidate_name,
        candidate_total_experience: profile.candidate_total_experience,
        candidate_relavent_experience: profile.candidate_relavent_experience,
        candidate_resume: resumeFile ? resumeFile.filename : null,
        notice_period_min: profile.notice_period_min,
        notice_period_max: profile.notice_period_max,
        bid_amount: profile.bid_amount,
      });
    }));
  }

  return projectBid;
};

/**
 * Update a project bid.
 */
const updateProjectBid = async ({ id, body }) => ProjectBid.update(body, { where: { id } });

/**
 * Get freelancer bids with pagination.
 */
const getUserBids = async ({ userId, query }) => {
  try {
    if (!userId) {
      return { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };
    }

    const { limit, page, model_engagement } = query || {};
    const { offset, parsedLimit } = calculatePagination(page, limit);

    const clientProjectInclude = { model: ClientProject, required: true };
    if (model_engagement) clientProjectInclude.where = { model_engagement };

    // Build include array — only add CandidateProfile if the model is available
    const includeArray = [clientProjectInclude];
    if (CandidateProfile) {
      includeArray.push({ model: CandidateProfile, required: false, as: 'candidateProfiles' });
    }

    const [data, totalCount] = await Promise.all([
      ProjectBid.findAll({
        where: { from_user_id: userId },
        include: includeArray,
        limit: parsedLimit, offset, order: [['id', 'DESC']],
      }),
      ProjectBid.count({ where: { from_user_id: userId }, include: [clientProjectInclude] }),
    ]);

    const processedData = data.map((bid) => {
      const d = bid.toJSON ? bid.toJSON() : bid;
      d.candidateProfiles = appendResumeUrl(d.candidateProfiles);
      return d;
    });

    return {
      data: processedData,
      pagination: { total: totalCount, page: parseInt(page, 10) || 1, limit: parsedLimit, totalPages: Math.ceil(totalCount / parsedLimit) },
    };
  } catch (error) {
    console.error('getUserBids error:', error);
    return { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };
  }
};

/**
 * Get bid detail by ID — only returns the bid if it belongs to the authenticated user.
 * Returns 'forbidden' if the bid exists but belongs to a different user.
 */
const getUserBidDetail = async (bidId, userId) => {
  // Ownership check: only return the bid if from_user_id matches the authenticated user
  const result = await ProjectBid.findAll({
    where: { id: bidId, from_user_id: userId },
    include: [
      { model: ClientProject, required: false },
      { model: CandidateProfile, required: false, as: 'candidateProfiles' },
    ],
  });

  if (!result || result.length === 0) {
    // Distinguish 404 (bid doesn't exist) from 403 (bid exists but belongs to another user)
    const bidExists = await ProjectBid.findByPk(bidId);
    if (!bidExists) return null; // controller returns 404 / BAD_REQUEST
    return 'forbidden'; // controller returns 403
  }

  return result.map((bid) => {
    const d = bid.toJSON ? bid.toJSON() : bid;
    d.candidateProfiles = appendResumeUrl(d.candidateProfiles);
    return d;
  });
};

/**
 * Get full bid detail with freelancer, client, SOW, milestones, subcategories.
 */
const getUserDetailData = async (bidId) => {
  const projectBid = await ProjectBid.findOne({
    where: { id: bidId },
    include: [
      {
        model: User, as: 'freelancer', required: false,
        include: [
          // Education include removed — Bug #073: 'education' table doesn't exist in DB
          { model: ProfessionalDetail, required: false, include: [{ model: Category, required: false }, { model: SubCategory, as: 'subCategories', required: false }] },
          { model: ProjectDetail, required: false },
          { model: Project, required: false },
          { model: ClientProject, required: false, include: [{ model: Category, required: false }, { model: SubCategory, as: 'subCategories', required: false }] },
        ],
      },
      { model: ClientProject, required: false, include: [{ model: Industry, required: false, attributes: ['industry'] }, { model: Category, required: false, attributes: ['name'] }] },
      { model: User, as: 'client', required: false, attributes: ['id', 'first_name', 'last_name', 'email', 'gst_number', 'company_name'] },
      { model: Sow, as: 'sows', required: false, include: [{ model: ProjectBidMilestone, required: false, as: 'projectMilestones' }] },
      { model: CandidateProfile, as: 'candidateProfiles', required: false },
    ],
    order: [[{ model: Sow, as: 'sows' }, { model: ProjectBidMilestone, as: 'projectMilestones' }, 'id', 'ASC']],
  });

  if (projectBid?.ClientProject) {
    const subs = await ClientProjectSubCategory.findAll({
      where: { client_project_id: projectBid.ClientProject.id }, attributes: ['sub_category_id'], raw: true,
    });
    const subIds = subs.map((s) => s.sub_category_id).filter(Boolean);
    projectBid.ClientProject.dataValues.project_sub_category = subIds.length > 0 ? subIds.join(',') : null;

    if (subIds.length > 0 && projectBid.ClientProject.project_category) {
      const subCats = await SubCategory.findAll({ where: { id: { [Op.in]: subIds }, categoryId: projectBid.ClientProject.project_category } });
      projectBid.ClientProject.dataValues.subCategories = subCats.map((s) => ({ id: s.id, name: s.name, categoryId: s.categoryId }));
    } else {
      projectBid.ClientProject.dataValues.subCategories = [];
    }
  }

  if (projectBid?.client) {
    const c = projectBid.client.toJSON ? projectBid.client.toJSON() : projectBid.client;
    projectBid.dataValues.clientDetails = {
      id: c.id, fullName: `${c.first_name || ''} ${c.last_name || ''}`.trim(),
      firstName: c.first_name, lastName: c.last_name, email: c.email, gstNumber: c.gst_number, companyName: c.company_name,
    };
  }

  return projectBid;
};

/**
 * Get client bids with pagination.
 */
const getClientBids = async ({ userId, query }) => {
  try {
    if (!userId) {
      return { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };
    }

    const { limit, page, project_id, type } = query || {};
    const { offset, parsedLimit } = calculatePagination(page, limit);

    const where = { posted_by_user_id: userId };
    if (project_id) where.id = project_id;
    if (type) where.model_engagement = type;

    let isRetainer = false;
    if (project_id) {
      const proj = await ClientProject.findOne({ where: { id: project_id, posted_by_user_id: userId }, attributes: ['model_engagement'] });
      isRetainer = proj?.model_engagement === 'retainer';
    }

    const includes = [
      { model: ClientProject, required: true, where, include: [{ model: User, required: false, attributes: ['first_name', 'middle_name', 'email', 'last_name', 'username', 'id'] }] },
      { model: User, as: 'freelancer', required: false, attributes: { exclude: ['password'] } },
    ];
    if (isRetainer) includes.push({ model: CandidateProfile, as: 'candidateProfiles', required: false });

    const [data, totalCount] = await Promise.all([
      ProjectBid.findAll({ order: [['id', 'DESC']], include: includes, attributes: { include: subQuery.bidType() }, limit: parsedLimit, offset }),
      ProjectBid.count({ where: { client_id: userId }, include: [{ model: ClientProject, required: true, where: type ? { model_engagement: type } : {} }] }),
    ]);

    return {
      data: data || [],
      pagination: { total: totalCount || 0, page: parseInt(page, 10) || 1, limit: parsedLimit, totalPages: Math.ceil((totalCount || 0) / parsedLimit) },
    };
  } catch (error) {
    console.error('getClientBids error:', error);
    return { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };
  }
};

/**
 * Update candidate profile status.
 */
const updateCandidateProfileStatus = async ({ candidateProfileId, status, userId }) => {
  const profile = await CandidateProfile.findByPk(candidateProfileId, {
    include: [{ model: ProjectBid, as: 'projectBid', include: [{ model: ClientProject, as: 'ClientProject' }] }],
  });
  if (!profile) return false;
  if (!profile.projectBid?.ClientProject) return false;

  await CandidateProfile.update({ status }, { where: { id: candidateProfileId } });
  return true;
};

/**
 * Get freelancer delivery projects (milestones approved by admin).
 */
const getFreelancerDeliveryProject = async (userId) => ProjectBid.findAll({
  include: [
    { model: ProjectBidMilestone, as: 'milestones', where: { admin_approved_date: { [Op.ne]: null } } },
    { model: ClientProject, as: 'ClientProject', attributes: ['project_title'] },
    { model: User, as: 'client', attributes: ['id', 'first_name', 'last_name', 'email'] },
  ],
  attributes: ['id', 'project_id', 'from_user_id', 'client_id', 'bid_amount', 'lead_status', 'created_at', 'updated_at'],
  where: { from_user_id: userId },
});

/**
 * Get client delivery projects.
 */
const getClientDeliveryProject = async (userId) => ProjectBid.findAll({
  include: [
    { model: ProjectBidMilestone, as: 'milestones', where: { admin_approved_date: { [Op.ne]: null } } },
    { model: ClientProject, as: 'ClientProject', attributes: ['project_title'] },
    { model: User, as: 'client', attributes: ['id', 'first_name', 'last_name', 'email'] },
  ],
  attributes: ['id', 'project_id', 'from_user_id', 'client_id', 'bid_amount', 'lead_status', 'created_at', 'updated_at'],
  where: { client_id: userId },
});

/**
 * Send milestone to client (freelancer completes).
 */
const sendMilestoneToClient = async ({ milestoneId, body, userId }) => {
  const milestone = await ProjectBidMilestone.findOne({ where: { id: milestoneId } });
  if (!milestone) return 'not_found';

  // Ownership check: verify the requesting freelancer owns the bid this milestone belongs to
  const bid = await ProjectBid.findOne({ where: { id: milestone.project_bid_id } });
  if (!bid || bid.from_user_id !== userId) return 'forbidden';

  await ProjectBidMilestone.update({
    status: body.status, freelancer_remarks: body.freelancer_remarks, freelancer_approved_date: new Date(),
  }, { where: { id: milestoneId } });
  return true;
};

/**
 * Send milestone to freelancer (client approves/rejects).
 */
const sendMilestoneToFreelancer = async ({ milestoneId, body }) => {
  await ProjectBidMilestone.update({
    status: body.status, client_remarks: body.client_remarks, client_approved_date: new Date(),
  }, { where: { id: milestoneId } });

  if (body.status === 'client_approved') {
    const milestone = await ProjectBidMilestone.findOne({ where: { id: milestoneId } });
    if (!milestone) return false;
    const projectBid = await ProjectBid.findOne({ where: { id: milestone.project_bid_id } });
    if (!projectBid) return false;

    await Payment.create({
      project_id: projectBid.project_id, date_of_transaction: new Date(),
      freelancer_id: projectBid.from_user_id, amount: milestone.amount, status: 'withdrawn',
    });
  }
  return true;
};

export default {
  createProjectBid, updateProjectBid, getUserBids, getUserBidDetail, getUserDetailData,
  getClientBids, updateCandidateProfileStatus,
  getFreelancerDeliveryProject, getClientDeliveryProject,
  sendMilestoneToClient, sendMilestoneToFreelancer,
};
