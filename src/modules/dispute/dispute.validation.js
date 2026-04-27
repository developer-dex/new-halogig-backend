import Joi from 'joi';

const createDispute = {
  body: Joi.object().keys({
    projectId: Joi.number().integer().required(),
    projectBidId: Joi.number().integer().required(),
    message: Joi.string().allow('', null).optional(),
    type: Joi.string().allow('', null).optional(),
    generatedBy: Joi.string().valid('freelancer', 'client').required(),
  }),
};

const getOngoingProjects = {
  body: Joi.object().keys({
    generated_by: Joi.string().valid('freelancer', 'client').optional(),
  }),
};

export default { createDispute, getOngoingProjects };
