import Joi from 'joi';

const createBlog = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    slug: Joi.string().allow('', null).optional(),
    content: Joi.string().allow('', null).optional(),
    meta_title: Joi.string().allow('', null).optional(),
    meta_description: Joi.string().allow('', null).optional(),
    status: Joi.string().valid('draft', 'published').optional(),
  }),
};

const idParam = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

const slugParam = {
  params: Joi.object().keys({
    slug: Joi.string().required(),
  }),
};

export default {
  createBlog,
  idParam,
  slugParam,
};
