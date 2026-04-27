import Joi from 'joi';

const createWebsiteData = {
  body: Joi.object().keys({
    service_name: Joi.string().allow('', null).optional(),
    category: Joi.string().allow('', null).optional(),
    title: Joi.string().allow('', null).optional(),
    description: Joi.string().allow('', null).optional(),
    slug: Joi.string().allow('', null).optional(),
    meta_title: Joi.string().allow('', null).optional(),
    meta_description: Joi.string().allow('', null).optional(),
    order: Joi.number().integer().optional(),
  }),
};

const idParam = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

const categoryNameParam = {
  params: Joi.object().keys({
    categoryName: Joi.string().required(),
  }),
};

const bulkUpdate = {
  body: Joi.object().keys({
    updates: Joi.array().items(Joi.object().keys({
      id: Joi.number().integer().required(),
    }).unknown(true)).required(),
  }),
};

const updateOrder = {
  body: Joi.object().keys({
    items: Joi.array().items(Joi.object().keys({
      id: Joi.number().integer().required(),
      order: Joi.number().integer().required(),
    })).required(),
  }),
};

const serviceNameParam = {
  params: Joi.object().keys({
    serviceName: Joi.string().required(),
    ipAddress: Joi.string().required(),
  }),
};

const dataByIndustry = {
  body: Joi.object().keys({
    industry: Joi.string().allow('', null).optional(),
    category: Joi.string().allow('', null).optional(),
  }),
};

export default {
  createWebsiteData,
  idParam,
  categoryNameParam,
  bulkUpdate,
  updateOrder,
  serviceNameParam,
  dataByIndustry,
};
