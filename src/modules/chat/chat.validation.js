import Joi from 'joi';

const createChatRoom = {
  body: Joi.object().keys({
    name: Joi.string().max(255).required(),
    description: Joi.string().allow('', null).optional(),
    userEmails: Joi.array().items(Joi.string().email()).min(1).required(),
    roomType: Joi.string().valid('group', 'individual').default('group'),
  }),
};

const createIndividualChatRoom = {
  body: Joi.object().keys({
    other_user_id: Joi.number().integer().required(),
  }),
};

const sendMessage = {
  params: Joi.object().keys({
    roomId: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({
    message: Joi.string().trim().min(1).required(),
    messageType: Joi.string().valid('text', 'file', 'image', 'google_meet').default('text'),
    fileUrl: Joi.string().allow('', null).optional(),
    fileName: Joi.string().allow('', null).optional(),
    fileSize: Joi.number().allow(null).optional(),
    replyTo: Joi.number().integer().allow(null).optional(),
  }),
};

const roomIdParam = {
  params: Joi.object().keys({
    roomId: Joi.number().integer().required(),
  }),
};

const messageIdParam = {
  params: Joi.object().keys({
    messageId: Joi.number().integer().required(),
  }),
};

const updateChatRoomStatus = {
  params: Joi.object().keys({
    chatRoomId: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({
    status: Joi.string().valid('active', 'inactive', 'archived', 'suspended').required(),
  }),
};

const createGoogleMeet = {
  params: Joi.object().keys({
    roomId: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({
    title: Joi.string().allow('', null).optional(),
    description: Joi.string().allow('', null).optional(),
    startTime: Joi.string().allow('', null).optional(),
    endTime: Joi.string().allow('', null).optional(),
    timezone: Joi.string().allow('', null).optional(),
  }),
};

export default {
  createChatRoom, createIndividualChatRoom, sendMessage,
  roomIdParam, messageIdParam, updateChatRoomStatus, createGoogleMeet,
};
