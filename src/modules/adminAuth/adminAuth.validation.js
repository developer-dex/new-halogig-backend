import Joi from 'joi';

const adminLogin = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

const verifyOtp = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
  }),
};

const createAdmin = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    role: Joi.string().valid('super_admin', 'admin', 'moderator').optional(),
    permissions: Joi.object().optional(),
    firstName: Joi.string().max(255).optional(),
    lastName: Joi.string().max(255).optional(),
  }),
};

const updateAdmin = {
  params: Joi.object().keys({
    adminId: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({
    email: Joi.string().email().optional(),
    role: Joi.string().valid('super_admin', 'admin', 'moderator').optional(),
    permissions: Joi.object().optional(),
    firstName: Joi.string().max(255).optional(),
    lastName: Joi.string().max(255).optional(),
    first_name: Joi.string().max(255).optional(),
    last_name: Joi.string().max(255).optional(),
    status: Joi.string().valid('active', 'inactive', 'suspended').optional(),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).required(),
  }),
};

const adminIdParam = {
  params: Joi.object().keys({
    adminId: Joi.number().integer().required(),
  }),
};

export default {
  adminLogin,
  verifyOtp,
  createAdmin,
  updateAdmin,
  changePassword,
  adminIdParam,
};
