import Joi from 'joi';

const createFeedback = {
  body: Joi.object().keys({
    freelancer_id: Joi.number().integer().required(),
    ratings: Joi.number().min(1).max(5).required(),
    comment: Joi.string().allow('', null).optional(),
    project_bid_id: Joi.number().integer().allow(null).optional(),
  }).unknown(true),
};

export default { createFeedback };
