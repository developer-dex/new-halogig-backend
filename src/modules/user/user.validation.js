import Joi from 'joi';

const userRegistration = {
  body: Joi.object().keys({
    register_as: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
    country: Joi.string().allow('', null).optional(),
    city: Joi.string().allow('', null).optional(),
    state: Joi.string().allow('', null).optional(),
    company_name: Joi.string().allow('', null).optional(),
    designation: Joi.alternatives().try(Joi.string(), Joi.number()).allow(null).optional(),
    other_entity_name: Joi.string().allow('', null).optional(), // When is_other is true
    is_other: Joi.boolean().optional(),
    password: Joi.string().min(6).allow('', null).optional(),
  }).unknown(true),
};

const updateUser = {
  body: Joi.object().keys({
    first_name: Joi.string().trim().min(1).required(),
    last_name: Joi.string().trim().min(1).required(),
    country: Joi.string().trim().min(1).required(),
    city: Joi.string().trim().min(1).required(),
    register_as: Joi.alternatives().try(Joi.string().trim().min(1), Joi.number()).required(),
  }).unknown(true),
};

const addOrUpdateReadyMadeApp = {
  body: Joi.object().keys({
    id: Joi.number().integer().allow(null).optional(), // If present, update
    title: Joi.string().allow('', null).optional(),
    description: Joi.string().allow('', null).optional(),
  }).unknown(true),
};

const publishReadyMadeApp = {
  body: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

const deleteInternalImage = {
  body: Joi.object().keys({
    imageId: Joi.number().integer().required(),
  }),
};

const deleteCertificate = {
  body: Joi.object().keys({
    certificate_id: Joi.number().integer().required(),
  }),
};

const deleteProject = {
  body: Joi.object().keys({
    project_id: Joi.number().integer().required(),
  }),
};

const idParam = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

const tokenParam = {
  params: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

export default {
  userRegistration,
  updateUser,
  addOrUpdateReadyMadeApp,
  publishReadyMadeApp,
  deleteInternalImage,
  deleteCertificate,
  deleteProject,
  idParam,
  tokenParam,
};
