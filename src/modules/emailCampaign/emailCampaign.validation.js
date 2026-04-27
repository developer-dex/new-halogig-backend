import Joi from 'joi';

const queryParams = {
  query: Joi.object().keys({
    page: Joi.number().integer().optional(),
    limit: Joi.number().integer().optional(),
  }),
};

export default {
  queryParams,
};
