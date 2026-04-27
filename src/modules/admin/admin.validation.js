import Joi from 'joi';

const idParam = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

const userIdParam = {
  params: Joi.object().keys({
    userId: Joi.number().integer().required(),
  }),
};

const updateUserStatus = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({
    status: Joi.string().required(),
  }),
};

const updateSalesReferralLeadStatus = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({
    status: Joi.string().required(),
  }),
};

const updateClientStatus = {
  body: Joi.object().keys({
    userId: Joi.number().integer().required(),
    status: Joi.string().required(),
  }),
};

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().allow('', null).optional(),
    role: Joi.string().allow('', null).optional(),
    password: Joi.string().min(6).required(),
  }),
};

const updateProjectStatus = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({
    status: Joi.string().required(),
  }),
};

const updateProject = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({}).unknown(true),
};

const bidIdParam = {
  params: Joi.object().keys({
    bidId: Joi.number().integer().required(),
  }),
};

const projectBidIdParam = {
  params: Joi.object().keys({
    projectBidId: Joi.number().integer().required(),
  }),
};

const logIdParam = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

const freelancerPrimaryIntroduction = {
  params: Joi.object().keys({
    userId: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({}).unknown(true),
};

const sendFreelancerEmail = {
  params: Joi.object().keys({
    userId: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({
    subject: Joi.string().required(),
    body: Joi.string().required(),
  }),
};

const updateMaxProposalValue = {
  params: Joi.object().keys({
    userId: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({
    max_proposal_value: Joi.number().required(),
  }),
};

const updateMaxDeliveryInProgress = {
  params: Joi.object().keys({
    userId: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({
    max_delivery_in_progress: Joi.number().integer().required(),
  }),
};

const billingDetailsParam = {
  params: Joi.object().keys({
    milestoneId: Joi.number().integer().required(),
    projectbidId: Joi.number().integer().required(),
  }),
};

const createMilestone = {
  params: Joi.object().keys({
    projectBidId: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({}).unknown(true),
};

const updateMilestone = {
  params: Joi.object().keys({
    milestoneId: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({}).unknown(true),
};

const suspendChatRoom = {
  params: Joi.object().keys({
    chatRoomId: Joi.number().integer().required(),
  }),
};

const updateProjectBid = {
  params: Joi.object().keys({
    projectBidId: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({}).unknown(true),
};

const viewByAdmin = {
  params: Joi.object().keys({
    userId: Joi.number().integer().required(),
  }),
};

const deleteContactUs = {
  params: Joi.object().keys({
    contactUsId: Joi.number().integer().required(),
  }),
};

const testimonialIdParam = {
  params: Joi.object().keys({
    testimonialId: Joi.number().integer().required(),
  }),
};

const createTestimonial = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    content: Joi.string().required(),
    designation: Joi.string().allow('', null).optional(),
    company: Joi.string().allow('', null).optional(),
    rating: Joi.number().min(1).max(5).optional(),
  }),
};

const preferenceIdParam = {
  params: Joi.object().keys({
    userId: Joi.number().integer().required(),
    preferenceId: Joi.number().integer().required(),
  }),
};

const uniqueSpecialCategory = {
  body: Joi.object().keys({
    category: Joi.string().required(),
  }),
};

export default {
  idParam, userIdParam, updateUserStatus, updateSalesReferralLeadStatus,
  updateClientStatus, createUser, updateProjectStatus, updateProject,
  bidIdParam, projectBidIdParam, logIdParam, freelancerPrimaryIntroduction,
  sendFreelancerEmail, updateMaxProposalValue, updateMaxDeliveryInProgress,
  billingDetailsParam, createMilestone, updateMilestone, suspendChatRoom,
  updateProjectBid, viewByAdmin, deleteContactUs, testimonialIdParam,
  createTestimonial, preferenceIdParam, uniqueSpecialCategory,
};
