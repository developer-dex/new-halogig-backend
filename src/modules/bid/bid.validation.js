import Joi from 'joi';

const createProjectBid = {
  body: Joi.object().keys({
    project_id: Joi.number().integer().required(),
    client_id: Joi.number().integer().required(),
    bid_amount: Joi.number().allow(null).optional(),
    delivery_time: Joi.string().allow('', null).optional(),
    cover_letter: Joi.string().allow('', null).optional(),
    candidate_profiles: Joi.string().allow('', null).optional(), // JSON string of candidate profiles
    model_engagement: Joi.string().allow('', null).optional(),
  }).unknown(true),
};

const updateProjectBid = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
  body: Joi.object().min(1),
};

const getUserBid = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    model_engagement: Joi.string().allow('', null).optional(),
  }),
};

const idParam = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

const getClientBid = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    project_id: Joi.number().integer().allow(null).optional(),
    type: Joi.string().allow('', null).optional(),
  }),
};

const updateCandidateProfileStatus = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({
    status: Joi.string().valid('accepted', 'rejected', 'pending', 'shortlisted').required(),
  }),
};

const sendMilestone = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({
    status: Joi.string().required(),
    freelancer_remarks: Joi.string().allow('', null).optional(),
    client_remarks: Joi.string().allow('', null).optional(),
  }).unknown(true),
};

export default {
  createProjectBid,
  updateProjectBid,
  getUserBid,
  idParam,
  getClientBid,
  updateCandidateProfileStatus,
  sendMilestone,
};
