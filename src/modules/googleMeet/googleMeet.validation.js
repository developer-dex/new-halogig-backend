import Joi from 'joi';

const generateTokens = {
  body: Joi.object().keys({
    code: Joi.string().required(),
  }),
};

export default {
  generateTokens,
};
