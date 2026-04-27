import Joi from 'joi';

/**
 * Validation schemas for country module endpoints.
 */
const createCountry = {
  body: Joi.object().keys({
    name: Joi.string().max(255).required(),
    countries_isd_code: Joi.string().allow('', null).optional(),
    sortName: Joi.string().max(10).allow('', null).optional(),
  }),
};

export default {
  createCountry,
};
