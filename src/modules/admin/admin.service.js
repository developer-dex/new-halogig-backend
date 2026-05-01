import { Op } from 'sequelize';
import {
  User, ClientProject, ProjectBid, ProjectBidMilestone, ContactUs, UserActivity,
  Project, ProjectDetail, CandidateProfile, LogManager, UserFunction, FreelancerCv,
  ProfessionalDetail, Education, FreelancerCurrentCountryPreference, SaleOrderAndInvoices,
  ChatRoom, EmailDomainAnalysis, ProcessingBatch, HtmlTemplate, WebsiteData, EmailCampaign,
  Feedback, HalogigTestimonial, ProfileCompleteReminder, Dispute, SalesReferralLead,
  sequelize,
} from '../../models';
import { calculatePagination } from '../../utils/pagination';

// ---- User Management ----
const getAllUsers = async (query) => {
  const { page, limit, search, status, role } = query;
  const { offset, parsedLimit } = calculatePagination(page, limit);
  const where = {};
  if (search) where[Op.or] = [{ first_name: { [Op.like]: `%${search}%` } }, { email: { [Op.like]: `%${search}%` } }];
  if (status) where.status = status;
  if (role) where.role = role;
  const { count, rows } = await User.findAndCountAll({ where, order: [['createdAt', 'DESC']], offset, limit: parsedLimit, attributes: { exclude: ['password'] } });
  return { total: count, users: rows, page: Number(page) || 1, limit: parsedLimit };
};

const getClients = async (query) => {
  const { page, limit, search } = query;
  const { offset, parsedLimit } = calculatePagination(page, limit);
  const where = { role: 'client' };
  if (search) where.first_name = { [Op.like]: `%${search}%` };
  const { count, rows } = await User.findAndCountAll({ where, order: [['createdAt', 'DESC']], offset, limit: parsedLimit, attributes: { exclude: ['password'] } });
  return { total: count, clients: rows, page: Number(page) || 1, limit: parsedLimit };
};

const updateUserStatus = async (id, status) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  await user.update({ status });
  return user;
};

const getFreelancers = async (query) => {
  const { page, limit, search } = query;
  const { offset, parsedLimit } = calculatePagination(page, limit);
  const where = { role: 'freelancer' };
  if (search) where.first_name = { [Op.like]: `%${search}%` };
  const { count, rows } = await User.findAndCountAll({ where, order: [['createdAt', 'DESC']], offset, limit: parsedLimit, attributes: { exclude: ['password'] } });
  return { total: count, freelancers: rows, page: Number(page) || 1, limit: parsedLimit };
};

const getReferralPartners = async (query) => {
  const { page, limit } = query;
  const { offset, parsedLimit } = calculatePagination(page, limit);
  const where = { role: 'referral_partner' };
  const { count, rows } = await User.findAndCountAll({ where, order: [['createdAt', 'DESC']], offset, limit: parsedLimit, attributes: { exclude: ['password'] } });
  return { total: count, partners: rows, page: Number(page) || 1, limit: parsedLimit };
};

// ---- Sales Referral Leads ----
const getSalesReferralLeads = async (query) => {
  const { page, limit, status } = query;
  const { offset, parsedLimit } = calculatePagination(page, limit);
  const where = {};
  if (status) where.status = status;
  const { count, rows } = await SalesReferralLead.findAndCountAll({ where, order: [['createdAt', 'DESC']], offset, limit: parsedLimit });
  return { total: count, leads: rows, page: Number(page) || 1, limit: parsedLimit };
};

const getSalesReferralLeadById = async (id) => SalesReferralLead.findByPk(id);

const updateSalesReferralLeadStatus = async (id, status) => {
  const lead = await SalesReferralLead.findByPk(id);
  if (!lead) return null;
  await lead.update({ status });
  return lead;
};

// ---- Projects ----
const getClientProjects = async (query) => {
  const { page, limit } = query;
  const { offset, parsedLimit } = calculatePagination(page, limit);
  const { count, rows } = await ClientProject.findAndCountAll({ order: [['createdAt', 'DESC']], offset, limit: parsedLimit });
  return { total: count, projects: rows, page: Number(page) || 1, limit: parsedLimit };
};

const getApplications = async (query) => {
  const { page, limit } = query;
  const { offset, parsedLimit } = calculatePagination(page, limit);
  const { count, rows } = await CandidateProfile.findAndCountAll({ order: [['createdAt', 'DESC']], offset, limit: parsedLimit });
  return { total: count, applications: rows, page: Number(page) || 1, limit: parsedLimit };
};

const getProposals = async (query) => {
  const { page, limit } = query;
  const { offset, parsedLimit } = calculatePagination(page, limit);
  const { count, rows } = await ProjectBid.findAndCountAll({ order: [['createdAt', 'DESC']], offset, limit: parsedLimit });
  return { total: count, proposals: rows, page: Number(page) || 1, limit: parsedLimit };
};

const getContactUsEntries = async (query) => {
  const { page, limit } = query;
  const { offset, parsedLimit } = calculatePagination(page, limit);
  const { count, rows } = await ContactUs.findAndCountAll({ order: [['createdAt', 'DESC']], offset, limit: parsedLimit });
  return { total: count, entries: rows, page: Number(page) || 1, limit: parsedLimit };
};

const updateClientStatus = async (userId, status) => {
  const user = await User.findByPk(userId);
  if (!user) return null;
  await user.update({ status });
  return user;
};

const createUser = async (data) => {
  const user = await User.create(data);
  return user;
};

// ---- Analytics ----
const getPageAnalytics = async (query) => {
  const { page, limit } = query;
  const { offset, parsedLimit } = calculatePagination(page, limit);
  const { count, rows } = await UserActivity.findAndCountAll({ order: [['createdAt', 'DESC']], offset, limit: parsedLimit });
  return { total: count, analytics: rows, page: Number(page) || 1, limit: parsedLimit };
};

const getIpAnalytics = async (query) => {
  const { page, limit } = query;
  const { offset, parsedLimit } = calculatePagination(page, limit);
  const results = await UserActivity.findAll({
    attributes: ['ip_address', [sequelize.fn('COUNT', sequelize.col('id')), 'visit_count']],
    group: ['ip_address'],
    order: [[sequelize.literal('visit_count'), 'DESC']],
    offset,
    limit: parsedLimit,
    raw: true,
  });
  return results;
};


// ---- Projects (continued) ----
const getProjects = async (query) => {
  const { page, limit, status } = query;
  const { offset, parsedLimit } = calculatePagination(page, limit);
  const where = {};
  if (status) where.status = status;
  const { count, rows } = await Project.findAndCountAll({ where, order: [['createdAt', 'DESC']], offset, limit: parsedLimit });
  return { total: count, projects: rows, page: Number(page) || 1, limit: parsedLimit };
};

const getProjectDetails = async (id) => {
  const project = await Project.findByPk(id, { include: [{ model: ProjectDetail, as: 'details' }] });
  return project;
};

const getUserDetails = async (id) => {
  const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
  return user;
};

const createClientProject = async (data) => ClientProject.create(data);

const updateProjectStatus = async (id, status) => {
  const project = await Project.findByPk(id);
  if (!project) return null;
  await project.update({ status });
  return project;
};

const updateProject = async (id, data) => {
  const project = await Project.findByPk(id);
  if (!project) return null;
  await project.update(data);
  return project;
};

// ---- Project Bids ----
const getProjectBids = async (query) => {
  const { page, limit } = query;
  const { offset, parsedLimit } = calculatePagination(page, limit);
  const { count, rows } = await ProjectBid.findAndCountAll({ order: [['createdAt', 'DESC']], offset, limit: parsedLimit });
  return { total: count, bids: rows, page: Number(page) || 1, limit: parsedLimit };
};

const getProjectBidById = async (bidId) => ProjectBid.findByPk(bidId);

// ---- Logs ----
const getLogs = async (query) => {
  const { page, limit } = query;
  const { offset, parsedLimit } = calculatePagination(page, limit);
  const { count, rows } = await LogManager.findAndCountAll({ order: [['createdAt', 'DESC']], offset, limit: parsedLimit });
  return { total: count, logs: rows, page: Number(page) || 1, limit: parsedLimit };
};

const getLogById = async (id) => LogManager.findByPk(id);

const resolveLog = async (id) => {
  const log = await LogManager.findByPk(id);
  if (!log) return null;
  await log.update({ resolved: true, resolved_at: new Date() });
  return log;
};

const getLogStatistics = async () => {
  const total = await LogManager.count();
  const resolved = await LogManager.count({ where: { resolved: true } });
  const unresolved = await LogManager.count({ where: { resolved: false } });
  return { total, resolved, unresolved };
};

// ---- User Functions ----
const getUserFunctions = async (query) => {
  const { page, limit } = query;
  const { offset, parsedLimit } = calculatePagination(page, limit);
  const { count, rows } = await UserFunction.findAndCountAll({ order: [['createdAt', 'DESC']], offset, limit: parsedLimit });
  return { total: count, data: rows, page: Number(page) || 1, limit: parsedLimit };
};

// ---- Freelancer Management ----
const getFreelancerCompleteData = async (userId) => {
  const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } });
  if (!user) return null;
  const professionalDetails = await ProfessionalDetail.findAll({ where: { user_id: userId } });
  const education = await Education.findAll({ where: { user_id: userId } });
  const cv = await FreelancerCv.findOne({ where: { user_id: userId } });
  return { user, professionalDetails, education, cv };
};

const updateFreelancerPrimaryIntroduction = async (userId, data) => {
  const user = await User.findByPk(userId);
  if (!user) return null;
  await user.update(data);
  return user;
};

const updateFreelancerProfessionalExperience = async (userId, data) => {
  const user = await User.findByPk(userId);
  if (!user) return null;
  const existing = await ProfessionalDetail.findOne({ where: { user_id: userId } });
  if (existing) { await existing.update(data); return existing; }
  return ProfessionalDetail.create({ ...data, user_id: userId });
};

const updateFreelancerProjects = async (userId, data) => {
  const user = await User.findByPk(userId);
  if (!user) return null;
  await user.update({ projects: data });
  return user;
};

const updateFreelancerEducation = async (userId, data) => {
  const user = await User.findByPk(userId);
  if (!user) return null;
  const existing = await Education.findOne({ where: { user_id: userId } });
  if (existing) { await existing.update(data); return existing; }
  return Education.create({ ...data, user_id: userId });
};

const sendFreelancerEmail = async (userId, emailData) => {
  // Stub: integrate with email service
  return { userId, ...emailData, sent: true };
};

const getFreelancerCountryPreferences = async (userId) => {
  const prefs = await FreelancerCurrentCountryPreference.findAll({ where: { user_id: userId } });
  return prefs;
};

const updateFreelancerCountryPreferences = async (userId, data) => {
  const pref = await FreelancerCurrentCountryPreference.findOne({ where: { user_id: userId } });
  if (!pref) return null;
  await pref.update(data);
  return pref;
};

const createFreelancerCountryPreference = async (userId, data) => {
  return FreelancerCurrentCountryPreference.create({ ...data, user_id: userId });
};

const deleteFreelancerCountryPreference = async (userId, preferenceId) => {
  const pref = await FreelancerCurrentCountryPreference.findOne({ where: { id: preferenceId, user_id: userId } });
  if (!pref) return null;
  await pref.destroy();
  return pref;
};

const updateMaxProposalValue = async (userId, maxProposalValue) => {
  const user = await User.findByPk(userId);
  if (!user) return null;
  await user.update({ max_proposal_value: maxProposalValue });
  return user;
};

const updateMaxDeliveryInProgress = async (userId, maxDeliveryInProgress) => {
  const user = await User.findByPk(userId);
  if (!user) return null;
  await user.update({ max_delivery_in_progress: maxDeliveryInProgress });
  return user;
};


// ---- Billing ----
const getBillingDetails = async (milestoneId, projectbidId) => {
  const milestone = await ProjectBidMilestone.findByPk(milestoneId);
  if (!milestone) return null;
  const bid = await ProjectBid.findByPk(projectbidId);
  if (!bid) return null;
  return { milestone, bid };
};

const saveInvoiceInformation = async (data, file) => {
  const invoiceData = { ...data };
  if (file) invoiceData.invoice_file = file.filename;
  return SaleOrderAndInvoices.create(invoiceData);
};

const saveSaleOrderInformation = async (data, file) => {
  const orderData = { ...data };
  if (file) orderData.sale_order_file = file.filename;
  return SaleOrderAndInvoices.create(orderData);
};

const milestoneApprovedByAdmin = async (data) => {
  const milestone = await ProjectBidMilestone.findByPk(data.milestoneId);
  if (!milestone) return null;
  await milestone.update({ admin_approved: true, admin_approved_at: new Date() });
  return milestone;
};

// ---- Project Bid Management ----
const updateProjectBid = async (projectBidId, data) => {
  const bid = await ProjectBid.findByPk(projectBidId);
  if (!bid) return null;
  await bid.update(data);
  return bid;
};

const createProjectBidMilestone = async (projectBidId, data) => {
  return ProjectBidMilestone.create({ ...data, project_bid_id: projectBidId });
};

const updateProjectBidMilestone = async (milestoneId, data) => {
  const milestone = await ProjectBidMilestone.findByPk(milestoneId);
  if (!milestone) return null;
  await milestone.update(data);
  return milestone;
};

const approveProjectBidByAdmin = async (projectBidId) => {
  const bid = await ProjectBid.findByPk(projectBidId);
  if (!bid) return null;
  await bid.update({ admin_approved: true, admin_approved_at: new Date() });
  return bid;
};

// ---- Chat Room ----
const suspendChatRoom = async (chatRoomId) => {
  const room = await ChatRoom.findByPk(chatRoomId);
  if (!room) return null;
  await room.update({ suspended: !room.suspended });
  return room;
};

const getChatRoomsNotCreatedByAdmin = async (query) => {
  const { page, limit } = query;
  const { offset, parsedLimit } = calculatePagination(page, limit);
  const { count, rows } = await ChatRoom.findAndCountAll({
    where: { created_by_admin: { [Op.ne]: true } },
    order: [['createdAt', 'DESC']], offset, limit: parsedLimit,
  });
  return { total: count, chatRooms: rows, page: Number(page) || 1, limit: parsedLimit };
};

// ---- Misc Admin ----
const getEmailDomainAnalysis = async (query) => {
  const { page, limit } = query;
  const { offset, parsedLimit } = calculatePagination(page, limit);
  const { count, rows } = await EmailDomainAnalysis.findAndCountAll({ order: [['createdAt', 'DESC']], offset, limit: parsedLimit });
  return { total: count, data: rows, page: Number(page) || 1, limit: parsedLimit };
};

const createUniqueSpecialCategory = async (data) => {
  // Stub: create special category entry
  return data;
};

const getBatchNames = async () => {
  const batches = await ProcessingBatch.findAll({ attributes: ['batch_name'], group: ['batch_name'], raw: true });
  return batches.map((b) => b.batch_name);
};

const getHtmlTemplates = async (query) => {
  const { page, limit } = query;
  const { offset, parsedLimit } = calculatePagination(page, limit);
  const { count, rows } = await HtmlTemplate.findAndCountAll({ order: [['createdAt', 'DESC']], offset, limit: parsedLimit });
  return { total: count, templates: rows, page: Number(page) || 1, limit: parsedLimit };
};

const getWebsiteDataSlugs = async () => {
  const slugs = await WebsiteData.findAll({
    attributes: [[sequelize.fn('DISTINCT', sequelize.col('slug')), 'slug']],
    where: { slug: { [Op.ne]: null } },
    raw: true,
  });
  return slugs.map((s) => s.slug);
};

const getEmailCampaigns = async (query) => {
  try {
    const { page, limit } = query;
    const { offset, parsedLimit } = calculatePagination(page, limit);
    const { count, rows } = await EmailCampaign.findAndCountAll({ order: [['createdAt', 'DESC']], offset, limit: parsedLimit });
    return { total: count, campaigns: rows, page: Number(page) || 1, limit: parsedLimit };
  } catch (error) {
    console.error('getEmailCampaigns error:', error);
    return { campaigns: [], total_count: 0 };
  }
};

const markUserViewedByAdmin = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) return null;
  await user.update({ viewed_by_admin: true });
  return user;
};

const deleteContactUs = async (contactUsId) => {
  const entry = await ContactUs.findByPk(contactUsId);
  if (!entry) return null;
  await entry.destroy();
  return entry;
};

const getPendingViewCounts = async () => {
  const count = await User.count({ where: { viewed_by_admin: false } });
  return { pending: count };
};

const getFreelancerPayments = async (query) => {
  const { page, limit } = query;
  const { offset, parsedLimit } = calculatePagination(page, limit);
  const { count, rows } = await ProjectBidMilestone.findAndCountAll({
    where: { status: 'completed' },
    order: [['updatedAt', 'DESC']], offset, limit: parsedLimit,
  });
  return { total: count, payments: rows, page: Number(page) || 1, limit: parsedLimit };
};

const getDisputes = async (query) => {
  const { page, limit } = query;
  const { offset, parsedLimit } = calculatePagination(page, limit);
  const { count, rows } = await Dispute.findAndCountAll({ order: [['createdAt', 'DESC']], offset, limit: parsedLimit });
  return { total: count, disputes: rows, page: Number(page) || 1, limit: parsedLimit };
};

/**
 * Get ALL disputes with full user, project, and bid details (admin).
 */
const getAllDisputes = async (query) => {
  const { page, limit } = query;
  const pageNum = page && Number(page) > 0 ? Number(page) : 1;
  const limitNum = limit && Number(limit) > 0 ? Number(limit) : 50;
  const { offset, parsedLimit } = calculatePagination(pageNum, limitNum);

  const totalCount = await Dispute.count();

  const disputes = await Dispute.findAll({
    attributes: ['id', 'uuid', 'dispute_by', 'dispute_for', 'projectId', 'project_bid_id', 'raised_on', 'status', 'type', 'message', 'created_at', 'updated_at'],
    include: [
      { model: User, as: 'disputedBy', attributes: ['id', 'first_name', 'last_name', 'email', 'register_as'], required: false },
      { model: User, as: 'disputedFor', attributes: ['id', 'first_name', 'last_name', 'email', 'register_as'], required: false },
      { model: ClientProject, attributes: ['id', 'project_title', 'project_uuid'], required: false },
      { model: ProjectBid, attributes: ['id', 'status', 'bid_amount', 'is_dispute'], required: false },
    ],
    order: [['raised_on', 'DESC']], limit: parsedLimit, offset,
  });

  const disputesData = disputes.map((row) => {
    const j = row.toJSON();
    return {
      id: j.id, uuid: j.uuid, dispute_by: j.dispute_by, dispute_for: j.dispute_for,
      project_id: j.projectId, project_bid_id: j.project_bid_id, raised_on: j.raised_on,
      status: j.status, type: j.type, message: j.message, created_at: j.created_at, updated_at: j.updated_at,
      disputed_by: j.disputedBy ? { id: j.disputedBy.id, first_name: j.disputedBy.first_name, last_name: j.disputedBy.last_name, email: j.disputedBy.email, register_as: j.disputedBy.register_as } : null,
      disputed_for: j.disputedFor ? { id: j.disputedFor.id, first_name: j.disputedFor.first_name, last_name: j.disputedFor.last_name, email: j.disputedFor.email, register_as: j.disputedFor.register_as } : null,
      project: j.ClientProject ? { id: j.ClientProject.id, project_title: j.ClientProject.project_title, project_uuid: j.ClientProject.project_uuid } : null,
      project_bid: j.ProjectBid ? { id: j.ProjectBid.id, status: j.ProjectBid.status, bid_amount: j.ProjectBid.bid_amount, is_dispute: j.ProjectBid.is_dispute } : null,
    };
  });

  return { total_count: totalCount, disputes: disputesData };
};

/**
 * Update dispute status (admin).
 */
const updateDisputeStatus = async ({ disputeId, status }) => {
  const allowed = new Set(['pending', 'closed', 'resolved']);
  if (!disputeId || Number.isNaN(Number(disputeId))) throw new Error('Invalid dispute id');
  if (!status?.trim()) throw new Error('Status is required');

  const normalized = String(status).trim().toLowerCase().replace(/\s+/g, '_');
  const dispute = await Dispute.findByPk(disputeId);
  if (!dispute) return null;

  const currentNorm = String(dispute.status || 'pending').trim().toLowerCase().replace(/\s+/g, '_');
  if (!allowed.has(normalized) && normalized !== currentNorm) throw new Error('Invalid status');

  await dispute.update({ status: normalized });
  return dispute.toJSON();
};

// ---- Testimonials ----
const createTestimonial = async (data) => HalogigTestimonial.create(data);

const getTestimonials = async (query) => {
  const { page, limit } = query;
  const { offset, parsedLimit } = calculatePagination(page, limit);
  const { count, rows } = await HalogigTestimonial.findAndCountAll({ order: [['createdAt', 'DESC']], offset, limit: parsedLimit });
  return { total: count, testimonials: rows, page: Number(page) || 1, limit: parsedLimit };
};

const updateTestimonial = async (testimonialId, data) => {
  const t = await HalogigTestimonial.findByPk(testimonialId);
  if (!t) return null;
  await t.update(data);
  return t;
};

const deleteTestimonial = async (testimonialId) => {
  const t = await HalogigTestimonial.findByPk(testimonialId);
  if (!t) return null;
  await t.destroy();
  return t;
};

// ---- Profile Complete Reminder ----
const sendProfileCompleteReminder = async (data) => {
  return ProfileCompleteReminder.create(data);
};

const sendBulkProfileCompleteReminder = async (data) => {
  const records = data.userIds.map((userId) => ({ user_id: userId, ...data }));
  return ProfileCompleteReminder.bulkCreate(records);
};

// ---- Website Data Categories ----
const getWebsiteDataUniqueCategories = async () => {
  const categories = await WebsiteData.findAll({
    attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']],
    where: { category: { [Op.ne]: null } },
    raw: true,
  });
  return categories.map((c) => c.category);
};

export default {
  getAllUsers, getClients, updateUserStatus, getFreelancers, getReferralPartners,
  getSalesReferralLeads, getSalesReferralLeadById, updateSalesReferralLeadStatus,
  getClientProjects, getApplications, getProposals, getContactUsEntries,
  updateClientStatus, createUser, getPageAnalytics, getIpAnalytics,
  getProjects, getProjectDetails, getUserDetails, createClientProject,
  updateProjectStatus, updateProject, getProjectBids, getProjectBidById,
  getLogs, getLogById, resolveLog, getLogStatistics, getUserFunctions,
  getFreelancerCompleteData, updateFreelancerPrimaryIntroduction,
  updateFreelancerProfessionalExperience, updateFreelancerProjects,
  updateFreelancerEducation, sendFreelancerEmail,
  getFreelancerCountryPreferences, updateFreelancerCountryPreferences,
  createFreelancerCountryPreference, deleteFreelancerCountryPreference,
  updateMaxProposalValue, updateMaxDeliveryInProgress,
  getBillingDetails, saveInvoiceInformation, saveSaleOrderInformation,
  milestoneApprovedByAdmin, updateProjectBid, createProjectBidMilestone,
  updateProjectBidMilestone, approveProjectBidByAdmin,
  suspendChatRoom, getChatRoomsNotCreatedByAdmin,
  getEmailDomainAnalysis, createUniqueSpecialCategory, getBatchNames,
  getHtmlTemplates, getWebsiteDataSlugs, getEmailCampaigns,
  markUserViewedByAdmin, deleteContactUs, getPendingViewCounts,
  getFreelancerPayments, getDisputes, getAllDisputes, updateDisputeStatus,
  createTestimonial, getTestimonials, updateTestimonial, deleteTestimonial,
  sendProfileCompleteReminder, sendBulkProfileCompleteReminder,
  getWebsiteDataUniqueCategories,
};
