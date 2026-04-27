import Joi from 'joi';

const createReportProblem = {
  body: Joi.object().keys({
    first_name: Joi.string().max(255).required(),
    last_name: Joi.string().max(255).required(),
    mobile_number: Joi.string().max(50).required(),
    email: Joi.string().email().max(255).required(),
    company_name: Joi.string().max(255).allow('', null).optional(),
    message: Joi.string().required(),
  }),
};

export default { createReportProblem };
