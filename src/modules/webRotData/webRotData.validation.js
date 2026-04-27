import Joi from 'joi';

const queryFilters = {
  query: Joi.object().keys({
    page: Joi.number().integer().optional(),
    limit: Joi.number().integer().optional(),
    serviceName: Joi.string().allow('', null).optional(),
    industry: Joi.string().allow('', null).optional(),
    slugLink: Joi.string().allow('', null).optional(),
    batchNo: Joi.string().allow('', null).optional(),
    status: Joi.string().allow('', null).optional(),
  }),
};

export default {
  queryFilters,
};
