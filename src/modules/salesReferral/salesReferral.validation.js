import Joi from 'joi';

const createSalesReferralLead = {
  body: Joi.object().keys({
    company_name: Joi.string().max(255).required(),
    contact_person: Joi.string().max(255).required(),
    designation: Joi.string().max(255).allow('', null).optional(),
    email_address: Joi.string().email().required(),
    mobile_number: Joi.string().max(50).required(),
    country: Joi.string().max(100).allow('', null).optional(),
    state: Joi.string().max(100).allow('', null).optional(),
    city: Joi.string().max(100).allow('', null).optional(),
    website_address: Joi.string().allow('', null).optional(),
    customer_industry_id: Joi.number().integer().allow(null).optional(),
    customer_industry: Joi.string().allow('', null).optional(),
    requirement_details: Joi.string().allow('', null).optional(),
    has_spoken_to_customer: Joi.boolean().optional(),
    commission_type: Joi.string().allow('', null).optional(),
    expected_commission_value: Joi.number().allow(null).optional(),
  }),
};

const idParam = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

export default { createSalesReferralLead, idParam };
