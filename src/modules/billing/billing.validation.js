import Joi from 'joi';

const addBillingDetails = {
  body: Joi.object().keys({
    billing_name: Joi.string().allow('', null).optional(),
    billing_address: Joi.string().allow('', null).optional(),
    billing_city: Joi.string().allow('', null).optional(),
    billing_state: Joi.string().allow('', null).optional(),
    billing_country: Joi.string().allow('', null).optional(),
    billing_zip_code: Joi.string().allow('', null).optional(),
    gst_number: Joi.string().allow('', null).optional(),
  }).unknown(true),
};

const updateGstDetails = {
  params: Joi.object().keys({
    bidId: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({
    gst_number: Joi.string().allow('', null).optional(),
    gstNote: Joi.string().allow('', null).optional(),
    isGstApplied: Joi.boolean().optional(),
  }).unknown(true),
};

const createPayment = {
  body: Joi.object().keys({
    project_id: Joi.number().integer().required(),
    freelancer_id: Joi.number().integer().required(),
    amount: Joi.number().positive().required(),
  }),
};

const changePaymentStatus = {
  body: Joi.object().keys({
    id: Joi.number().integer().required(),
    status: Joi.string().required(),
    invoice_number: Joi.string().allow('', null).optional(),
    tax_type: Joi.string().allow('', null).optional(),
    tax_amount: Joi.number().allow(null).optional(),
  }),
};

const getFreelancerPaymentList = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }),
};

export default {
  addBillingDetails,
  updateGstDetails,
  createPayment,
  changePaymentStatus,
  getFreelancerPaymentList,
};
