import Joi from 'joi';

/**
 * Validation schemas for contact module endpoints.
 */
const createContact = {
  body: Joi.object().keys({
    firstName: Joi.string().trim().min(1).max(255).required(),
    lastName: Joi.string().trim().min(1).max(255).required(),
    email: Joi.string().email().max(255).required(),
    mobile: Joi.string().trim().min(1).max(50).required(),
    companyName: Joi.string().max(255).allow('', null).optional(),
    requirements: Joi.string().allow('', null).optional(),
  }),
};

export default {
  createContact,
};
