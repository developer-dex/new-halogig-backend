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

export default {
  idParam,
  userIdParam,
};
