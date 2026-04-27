import Joi from 'joi';

const createClientProject = {
  body: Joi.object().keys({
    project_title: Joi.string().required(),
    project_summary: Joi.string().allow('', null).optional(),
    project_category: Joi.number().integer().allow(null).optional(),
    project_sub_category: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.number())).optional(),
    customer_industry: Joi.number().integer().allow(null).optional(),
    model_engagement: Joi.string().allow('', null).optional(),
    project_amount_min: Joi.number().allow(null).optional(),
    project_amount_max: Joi.number().allow(null).optional(),
    project_duration_min: Joi.number().allow(null).optional(),
    project_duration_max: Joi.number().allow(null).optional(),
    currency: Joi.string().allow('', null).optional(),
    location_preferancer: Joi.string().allow('', null).optional(),
    technologty_pre: Joi.string().allow('', null).optional(),
  }).unknown(true),
};

const idParam = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

const updateClientProjectStatus = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({
    status: Joi.number().integer().required(),
  }).unknown(true),
};

const getClientProjectsListing = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    model_engagement: Joi.string().allow('', null).optional(),
    customer_industry: Joi.number().integer().allow(null).optional(),
    project_amount_min: Joi.number().allow(null).optional(),
    project_amount_max: Joi.number().allow(null).optional(),
    searchText: Joi.string().allow('', null).optional(),
    mainFilter: Joi.string().valid('lowToHigh', 'highToLow', 'newestFirst', 'oldestFirst').optional(),
  }),
};

const publishClientProject = {
  body: Joi.object().keys({
    client_project_id: Joi.number().integer().required(),
  }),
};

const savedProject = {
  body: Joi.object().keys({
    projectId: Joi.number().integer().required(),
  }),
};

export default {
  createClientProject,
  idParam,
  updateClientProjectStatus,
  getClientProjectsListing,
  publishClientProject,
  savedProject,
};
