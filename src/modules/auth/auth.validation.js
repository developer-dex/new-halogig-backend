import Joi from 'joi';

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().email().max(255).required(),
    mobile: Joi.string().max(50).allow('', null).optional(),
    firstName: Joi.string().max(255).required(),
    lastName: Joi.string().max(255).required(),
    password: Joi.string().min(6).allow('', null).optional(),
    register_as: Joi.alternatives().try(Joi.string(), Joi.number()).optional(),
    source: Joi.string().allow('', null).optional(),
  }).unknown(true),
};

const checkUserExist = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    mobile: Joi.string().allow('', null).optional(),
    firstName: Joi.string().allow('', null).optional(),
    lastName: Joi.string().allow('', null).optional(),
    source: Joi.string().allow('', null).optional(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    login_as: Joi.alternatives().try(Joi.string(), Joi.number()).optional(),
  }),
};

const verifyOtp = {
  body: Joi.object().keys({
    otp: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
    email: Joi.string().email().required(),
  }),
};

const resendOtp = {
  body: Joi.object().keys({
    email: Joi.string().email().optional(),
    phoneNumber: Joi.string().optional(),
  }).or('email', 'phoneNumber'),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const setNewPassword = {
  body: Joi.object().keys({
    token: Joi.string().required(),
    password: Joi.string().min(6).required(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    token: Joi.string().required(),
    password: Joi.string().min(6).required(),
  }),
};

const googleSignup = {
  body: Joi.object().keys({
    idToken: Joi.string().required(),
    login_as: Joi.alternatives().try(Joi.string(), Joi.number()).optional(),
  }),
};

export default {
  createUser,
  checkUserExist,
  login,
  verifyOtp,
  resendOtp,
  forgotPassword,
  setNewPassword,
  resetPassword,
  googleSignup,
};
