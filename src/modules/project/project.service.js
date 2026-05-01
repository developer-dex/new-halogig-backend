import { Op } from 'sequelize';
import {
  ClientProject, ClientProjectSubCategory, User, Industry, Category, SubCategory,
  ProjectBid, SavedProject,
} from '../../models';
import { calculatePagination } from '../../utils/pagination';
import emailTemplateService from '../../services/emailTemplate.service';
import logger from '../../config/logger';

// ---- Helpers ----

const parseSubCategoryIds = (input) => {
  if (Array.isArray(input)) return input.map((s) => parseInt(s, 10)).filter((n) => !Number.isNaN(n));
  if (typeof input === 'string' && input.trim()) {
    return input.split(',').map((s) => s.trim()).filter((s) => s && s !== 'null')
      .map((s) => parseInt(s, 10)).filter((n) => !Number.isNaN(n));
  }
  return [];
};

const attachSubCategoriesToProjects = async (projects) => {
  const projectIds = projects.map((p) => (p.id || p.dataValues?.id));
  if (!projectIds.length) return projects;

  const records = await ClientProjectSubCategory.findAll({
    where: { client_project_id: { [Op.in]: projectIds } },
    attributes: ['client_project_id', 'sub_category_id'], raw: true,
  });

  const map = {};
  records.forEach((r) => {
    if (!map[r.client_project_id]) map[r.client_project_id] = [];
    map[r.client_project_id].push(r.sub_category_id);
  });

  return projects.map((p) => {
    const data = p.toJSON ? p.toJSON() : { ...p };
    const ids = map[data.id] || [];
    data.project_sub_category = ids.length > 0 ? ids.join(',') : null;
    return data;
  });
};

const buildOrderClause = (mainFilter) => {
  switch (mainFilter) {
    case 'lowToHigh': return [['project_amount_min', 'ASC']];
    case 'highToLow': return [['project_amount_min', 'DESC']];
    case 'oldestFirst': return [['id', 'ASC']];
    default: return [['id', 'DESC']];
  }
};

// ---- Service Functions ----

/**
 * Create a client project.
 */
const createClientProject = async ({ body, userId }) => {
  const data = { ...body, posted_by_user_id: userId, status: 1 };

  if (data.currency && typeof data.currency === 'string') {
    const parts = data.currency.split('-');
    if (parts.length === 2) { [data.currency_type, data.currency_symbol] = parts; }
  }

  const { project_sub_category: subInput, ...projectData } = data;
  const project = await ClientProject.create(projectData);

  const subIds = parseSubCategoryIds(subInput);
  if (subIds.length > 0 && project.id) {
    await ClientProjectSubCategory.bulkCreate(
      subIds.map((subId) => ({ client_project_id: project.id, posted_by_user_id: userId, sub_category_id: subId })),
    );
  }

  return project;
};

/**
 * Get user's own client projects with optional limit, offset, model_engagement filter.
 */
const getUserClientProjects = async (userId, query = {}) => {
  const { limit, offset, model_engagement } = query;
  const l = parseInt(limit, 10) || 10;
  const o = parseInt(offset, 10) || 0;

  const where = { posted_by_user_id: userId };
  if (model_engagement) where.model_engagement = model_engagement;

  const projects = await ClientProject.findAll({
    where,
    order: [['id', 'DESC']],
    limit: l,
    offset: o,
    include: [
      { model: User, required: false, attributes: ['first_name', 'middle_name', 'email', 'last_name', 'username', 'id'] },
    ],
  });
  return attachSubCategoriesToProjects(projects);
};

/**
 * Get client project details by ID.
 */
const getClientProjectDetailsById = async (id) => {
  const project = await ClientProject.findOne({
    where: { id },
    include: [
      { model: User, required: false, attributes: ['first_name', 'middle_name', 'email', 'last_name', 'username', 'id'] },
      { model: Industry, required: false, attributes: ['industry'] },
      { model: Category, required: false, attributes: ['name'] },
    ],
  });

  if (project) {
    const subs = await ClientProjectSubCategory.findAll({
      where: { client_project_id: id }, attributes: ['sub_category_id'], raw: true,
    });
    const subIds = subs.map((s) => s.sub_category_id).filter(Boolean);
    project.dataValues.project_sub_category = subIds.length > 0 ? subIds.join(',') : null;

    if (subIds.length > 0 && project.project_category) {
      project.dataValues.SubCategories = await SubCategory.findAll({
        where: { id: { [Op.in]: subIds }, categoryId: project.project_category }, attributes: ['id', 'name'],
      });
    } else {
      project.dataValues.SubCategories = [];
    }
  }

  return project;
};

/**
 * Update client project details.
 */
const updateClientProjectDetails = async ({ id, body, userId }) => {
  const { project_sub_category: subInput, id: excludeId, createdAt, currency, ...updateData } = body;

  if (currency && typeof currency === 'string') {
    const parts = currency.split('-');
    if (parts.length === 2) { [updateData.currency_type, updateData.currency_symbol] = parts; }
  }
  updateData.posted_by_user_id = userId;

  await ClientProject.update(updateData, { where: { id }, individualHooks: true });

  if (subInput !== undefined) {
    await ClientProjectSubCategory.destroy({ where: { client_project_id: id } });
    const subIds = parseSubCategoryIds(subInput);
    if (subIds.length > 0) {
      await ClientProjectSubCategory.bulkCreate(
        subIds.map((subId) => ({ client_project_id: id, posted_by_user_id: userId, sub_category_id: subId })),
      );
    }
  }

  return true;
};

/**
 * Update client project status.
 */
const updateClientProjectStatus = async ({ id, body }) => {
  const data = { ...body, approved_by_admin: false };
  return ClientProject.update(data, { where: { id } });
};

/**
 * Get client project detail (simple) — ownership enforced.
 */
const getClientProjectDetail = async (id, userId) => {
  const project = await ClientProject.findOne({
    where: { id },
    include: [{ model: User, required: false, attributes: ['first_name', 'middle_name', 'email', 'last_name', 'username', 'id'] }],
  });

  if (!project) return null; // 404

  if (project.posted_by_user_id !== userId) {
    const err = new Error('Access denied');
    err.status = 403;
    throw err;
  }

  return project;
};

/**
 * Public client projects listing with filters and pagination.
 */
const getClientProjectsListing = async ({ query = {}, userId }) => {
  const {
    page, limit, model_engagement, customer_industry,
    project_amount_min, project_amount_max, searchText, mainFilter,
  } = query;

  const { offset, parsedLimit } = calculatePagination(page, limit);

  const where = { approved_by_admin: true, status: 2, is_published: true };
  if (model_engagement) where.model_engagement = model_engagement;
  if (customer_industry) where.customer_industry = customer_industry;
  if (project_amount_min !== undefined || project_amount_max !== undefined) {
    where.project_amount_min = {};
    if (project_amount_min !== undefined) where.project_amount_min[Op.gte] = +project_amount_min;
    if (project_amount_max !== undefined) where.project_amount_min[Op.lte] = +project_amount_max;
  }
  if (searchText) {
    where[Op.or] = [
      { project_title: { [Op.like]: `%${searchText}%` } },
      { project_summary: { [Op.like]: `%${searchText}%` } },
    ];
  }

  const includes = [
    { model: User, required: false, attributes: ['first_name', 'middle_name', 'email', 'last_name', 'username', 'id'] },
    { model: Industry, required: false, attributes: ['industry', 'id'] },
  ];
  if (userId) includes.push({ model: ProjectBid, required: false, where: { from_user_id: userId }, attributes: ['id'] });

  const [data, totalCount] = await Promise.all([
    ClientProject.findAll({ where, order: buildOrderClause(mainFilter), limit: parsedLimit, offset, include: includes }),
    ClientProject.count({ where }),
  ]);

  const projectIds = data.map((p) => p.id);
  const subRecords = projectIds.length > 0
    ? await ClientProjectSubCategory.findAll({ where: { client_project_id: { [Op.in]: projectIds } }, attributes: ['client_project_id', 'sub_category_id'], raw: true })
    : [];
  const subMap = {};
  subRecords.forEach((r) => { if (!subMap[r.client_project_id]) subMap[r.client_project_id] = []; subMap[r.client_project_id].push(r.sub_category_id); });

  const results = data.map((p) => {
    const d = p.toJSON();
    if (userId) { d.is_submitted = !!(d.ProjectBids?.length > 0); delete d.ProjectBids; }
    else d.is_submitted = false;
    d.project_sub_category = (subMap[d.id] || []).length > 0 ? subMap[d.id].join(',') : null;
    return d;
  });

  return { data: results, totalCount };
};

/**
 * Publish client project and notify admin.
 */
const updatePublishClientProject = async (clientProjectId) => {
  const [updatedCount] = await ClientProject.update({ is_published: true }, { where: { id: clientProjectId } });
  if (!updatedCount) return [0];

  const project = await ClientProject.findOne({
    where: { id: clientProjectId },
    include: [{ model: User, required: false, attributes: ['first_name', 'last_name', 'email'] }],
  });

  if (project) {
    const clientName = `${project.User?.first_name || ''} ${project.User?.last_name || ''}`.trim() || 'Client';
    emailTemplateService.sendNewClientProjectPublishedNotification({
      projectId: project.id, projectTitle: project.project_title || 'Untitled Project',
      projectDescription: project.project_summary || 'N/A', clientName,
      clientEmail: project.User?.email || 'N/A', publishedAt: new Date().toISOString(),
    }).catch((err) => logger.error(`Publish notification error: ${err}`));
  }

  return [updatedCount];
};

/**
 * Save/unsave a project.
 */
const savedProject = async ({ projectId, userId }) => {
  const existing = await SavedProject.findOne({ where: { userId, projectId } });
  if (existing) { await existing.destroy(); return true; }
  return SavedProject.create({ userId, projectId });
};

/**
 * Get saved projects with filters.
 */
const getSavedProjects = async ({ userId, query }) => {
  const {
    page, limit, model_engagement, customer_industry,
    project_amount_min, project_amount_max, searchText, mainFilter,
  } = query;

  const { offset, parsedLimit } = calculatePagination(page, limit);

  const saved = await SavedProject.findAll({ where: { userId }, attributes: ['projectId'] });
  const savedIds = saved.map((s) => s.projectId);
  if (!savedIds.length) return [];

  const where = { id: { [Op.in]: savedIds }, approved_by_admin: true, status: 1 };
  if (model_engagement) where.model_engagement = model_engagement;
  if (customer_industry) where.customer_industry = customer_industry;
  if (project_amount_min || project_amount_max) {
    where.project_amount_min = {};
    if (project_amount_min) where.project_amount_min[Op.gte] = project_amount_min;
    if (project_amount_max) where.project_amount_min[Op.lte] = project_amount_max;
  }
  if (searchText) {
    where[Op.or] = [{ project_title: { [Op.like]: `%${searchText}%` } }, { project_summary: { [Op.like]: `%${searchText}%` } }];
  }

  const [data, totalCount] = await Promise.all([
    ClientProject.findAll({
      where, order: buildOrderClause(mainFilter), limit: parsedLimit, offset,
      include: [
        { model: User, required: false, attributes: ['first_name', 'middle_name', 'email', 'last_name', 'username', 'id'] },
        { model: Industry, required: false, attributes: ['industry', 'id'] },
      ],
    }),
    ClientProject.count({ where }),
  ]);

  return attachSubCategoriesToProjects(data);
};

/**
 * Get project details count with bid stats.
 */
const getProjectDetailsCount = async ({ userId, query }) => {
  const { page, limit, model_engagement } = query;
  const { offset, parsedLimit } = calculatePagination(page, limit);

  const where = { posted_by_user_id: userId };
  if (model_engagement) where.model_engagement = model_engagement;

  const [data, totalCount] = await Promise.all([
    ClientProject.findAll({
      where, order: [['id', 'DESC']], limit: parsedLimit, offset,
      attributes: ['id', 'project_title', 'project_uuid', 'created_at'],
      include: [{ model: ProjectBid, required: true, attributes: ['id', 'status'], where: { is_bid_visible: true, approved_by_admin: true } }],
    }),
    ClientProject.count({
      where, include: [{ model: ProjectBid, required: true, where: { is_bid_visible: true, approved_by_admin: true } }], distinct: true,
    }),
  ]);

  const results = data.map((p) => {
    const d = p.toJSON();
    const bids = d.ProjectBids || [];
    delete d.ProjectBids;
    return {
      ...d,
      total_bid_count: bids.length,
      proposal_accepted_count: bids.filter((b) => b.status === 'accepted').length,
      proposal_rejected_count: bids.filter((b) => b.status === 'rejected').length,
      proposal_on_hold_count: bids.filter((b) => b.status === 'on_hold').length,
      proposal_pending_count: bids.filter((b) => b.status === 'pending').length,
    };
  });

  return { data: results, totalCount };
};

export default {
  createClientProject, getUserClientProjects, getClientProjectDetailsById,
  updateClientProjectDetails, updateClientProjectStatus, getClientProjectDetail,
  getClientProjectsListing, updatePublishClientProject,
  savedProject, getSavedProjects, getProjectDetailsCount,
};
