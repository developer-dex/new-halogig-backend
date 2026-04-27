import Joi from 'joi';

const createOrder = {
  body: Joi.object().keys({
    bidId: Joi.number().integer().required(),
    amount: Joi.number().positive().required(),
    milestoneId: Joi.number().integer().allow(null).optional(),
  }),
};

const updatePaymentStatus = {
  body: Joi.object().keys({
    razorpay_signature: Joi.string().allow('', null).optional(),
    razorpay_payment_id: Joi.string().allow('', null).optional(),
    razorpay_order_id: Joi.string().required(),
  }),
};

const getOrderDetails = {
  query: Joi.object().keys({
    orderId: Joi.string().required(),
  }),
};

const getTransactionStatus = {
  query: Joi.object().keys({
    orderId: Joi.string().required(),
  }),
};

export default {
  createOrder,
  updatePaymentStatus,
  getOrderDetails,
  getTransactionStatus,
};
