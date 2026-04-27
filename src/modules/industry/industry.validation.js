import Joi from 'joi';

const createIndustry = {
  body: Joi.object().keys({
    industry: Joi.string().max(255).required(),
    status: Joi.string().valid('active', 'deleted', 'inactive').optional(),
  }),
};

export default {
  createIndustry,
};
