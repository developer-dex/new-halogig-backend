import Joi from 'joi';

const milestoneSchema = Joi.object().keys({
  hours: Joi.number().allow(null).optional(),
  scope: Joi.string().allow('', null).optional(),
  amount: Joi.number().allow(null).optional(),
});

const createSow = {
  body: Joi.object().keys({
    id: Joi.number().integer().allow(null).optional(), // If present, update instead of create
    project_leads_id: Joi.number().integer().required(),
    status: Joi.string().allow('', null).optional(),
    milestones: Joi.array().items(milestoneSchema).optional(),
  }).unknown(true),
};

const updateSow = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
  body: Joi.object().min(1),
};

const idParam = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

export default { createSow, updateSow, idParam };
