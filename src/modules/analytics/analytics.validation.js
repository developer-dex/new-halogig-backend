import Joi from 'joi';

const pageWiseEngagement = {
  body: Joi.object().keys({
    // New-style fields
    ip_address: Joi.string().allow('', null).optional(),
    page_url: Joi.string().allow('', null).optional(),
    device_type: Joi.string().allow('', null).optional(),
    time_spent: Joi.number().optional(),
    session_id: Joi.string().allow('', null).optional(),
    // Legacy fields sent by the frontend
    previous_page_url: Joi.string().allow('', null).optional(),
    user_ip_address: Joi.string().allow('', null).optional(),
    user_location: Joi.string().allow('', null).optional(),
    start_time: Joi.alternatives().try(Joi.string(), Joi.date()).allow('', null).optional(),
    end_time: Joi.alternatives().try(Joi.string(), Joi.date()).allow('', null).optional(),
    time_spent_on_page: Joi.number().allow(null).optional(),
    page_load_time: Joi.number().allow(null).optional(),
    telecom_provider: Joi.string().allow('', null).optional(),
    browser: Joi.string().allow('', null).optional(),
    user_type: Joi.string().allow('', null).optional(),
  }),
};

const verifyTurnstile = {
  body: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const createUserFunction = {
  body: Joi.object().keys({
    ip_address: Joi.string().allow('', null).optional(),
    function_name: Joi.string().allow('', null).optional(),
    service_name: Joi.string().allow('', null).optional(),
  }).unknown(true),
};

export default {
  pageWiseEngagement,
  verifyTurnstile,
  createUserFunction,
};
