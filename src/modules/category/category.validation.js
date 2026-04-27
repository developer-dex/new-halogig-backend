import Joi from 'joi';

const idParam = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

const categoryIdParam = {
  params: Joi.object().keys({
    categoryId: Joi.number().integer().required(),
  }),
};

const createCategory = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().allow('', null).optional(),
    status: Joi.string().valid('active', 'inactive').optional(),
  }),
};

const createSubCategory = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    category_id: Joi.number().integer().required(),
    description: Joi.string().allow('', null).optional(),
    status: Joi.string().valid('active', 'inactive').optional(),
  }),
};

const createTechnology = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().allow('', null).optional(),
    status: Joi.string().valid('active', 'inactive').optional(),
  }),
};

export default {
  idParam,
  categoryIdParam,
  createCategory,
  createSubCategory,
  createTechnology,
};
