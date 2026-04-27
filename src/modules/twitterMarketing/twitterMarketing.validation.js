import Joi from 'joi';

const saveTokens = {
  body: Joi.object().keys({
    access_token: Joi.string().required(),
    access_token_secret: Joi.string().required(),
  }),
};

export default {
  saveTokens,
};
