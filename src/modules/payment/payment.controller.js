import asyncHandler from '../../utils/asyncHandler';
import getHttpStatus from '../../utils/httpStatus';
import getMessage from '../../utils/message';
import paymentService from './payment.service';

/**
 * POST /api/order — Create Razorpay/PayPal order (auth required)
 */
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { bidId, amount, milestoneId } = req.body;
  const result = await paymentService.createOrder({
    bidId, amount, milestoneId, userId: req.user.id,
  });

  if (result) {
    return res.status(getHttpStatus('OK')).json({
      success: true, data: result, message: getMessage(req, false, ''),
    });
  }
  return res.status(getHttpStatus('BAD_REQUEST')).json({
    success: false, data: null, message: 'Failed to create order',
  });
});

/**
 * POST /api/order-status — Razorpay payment verification (no auth)
 */
const updatePaymentStatus = asyncHandler(async (req, res) => {
  const result = await paymentService.updatePaymentStatus(req.body);

  if (result) {
    return res.status(getHttpStatus('OK')).json({
      success: true, data: result, message: getMessage(req, false, ''),
    });
  }
  return res.status(getHttpStatus('BAD_REQUEST')).json({
    success: false, data: null, message: 'Payment verification failed',
  });
});

/**
 * GET /api/order — Get Razorpay order details (no auth)
 */
const getRazorpayOrderDetails = asyncHandler(async (req, res) => {
  const orderId = req.query.orderId || req.body?.orderId;
  const result = await paymentService.getOrderDetails(orderId);

  if (result) {
    return res.status(getHttpStatus('OK')).json({
      success: true, data: result, message: getMessage(req, false, ''),
    });
  }
  return res.status(getHttpStatus('BAD_REQUEST')).json({
    success: false, data: null, message: 'Order not found',
  });
});

/**
 * GET /api/user-order — Get all transactions (auth required)
 */
const getAllTransaction = asyncHandler(async (req, res) => {
  const result = await paymentService.getAllTransactions({
    userId: req.user.id, role: req.user.role,
  });

  if (result) {
    return res.status(getHttpStatus('OK')).json({
      success: true, data: result, message: getMessage(req, false, ''),
    });
  }
  return res.status(getHttpStatus('BAD_REQUEST')).json({
    success: false, data: null, message: 'Failed to retrieve transactions',
  });
});

/**
 * GET /api/transaction-status — Get transaction status (auth required)
 */
const getTransactionStatus = asyncHandler(async (req, res) => {
  const result = await paymentService.getTransactionStatus({
    userId: req.user.id, orderId: req.query.orderId, role: req.user.role,
  });

  return res.status(getHttpStatus('OK')).json({
    success: true, data: result, message: getMessage(req, false, ''),
  });
});

/**
 * POST /api/paypal/webhook — PayPal webhook (no auth)
 */
const paypalWebhook = asyncHandler(async (req, res) => {
  const result = await paymentService.handlePaypalWebhook(req);
  return res.status(getHttpStatus('OK')).json({
    success: true, data: result, message: getMessage(req, false, ''),
  });
});

export default {
  createRazorpayOrder,
  updatePaymentStatus,
  getRazorpayOrderDetails,
  getAllTransaction,
  getTransactionStatus,
  paypalWebhook,
};
