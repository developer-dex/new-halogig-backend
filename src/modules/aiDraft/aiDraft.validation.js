import Joi from 'joi';

const startFollowup = {
  body: Joi.object().keys({
    campaign_name: Joi.string().required(),
    template: Joi.string().allow('', null).optional(),
    batch_size: Joi.number().integer().optional(),
  }).unknown(true),
};

export default {
  startFollowup,
};
