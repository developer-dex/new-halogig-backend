import crypto from 'crypto';
import { Op } from 'sequelize';
import {
  Transaction, ProjectBid, ProjectBidMilestone, ClientProject, User, ClientBillingDetails, sequelize,
} from '../../models';
import razorpayService from './razorpay.service';
import paypalService from './paypal.service';

// --------------- Helpers ---------------

const normalizeCountry = (value) => (typeof value === 'string' ? value.trim().toUpperCase() : '');

const isIndiaCountry = (country) => {
  const c = normalizeCountry(country);
  if (!c) return false;
  return c === 'IN' || c === 'INDIA' || c.includes('INDIA') || c.includes('REPUBLIC OF INDIA');
};

const getGatewayForClient = async (userId) => {
  const billing = await ClientBillingDetails.findOne({ where: { user_id: userId } });
  if (billing?.billing_country?.trim()) {
    return isIndiaCountry(billing.billing_country) ? 'razorpay' : 'paypal';
  }
  const client = await User.findByPk(userId, { attributes: ['id', 'country'] });
  return isIndiaCountry(client?.country) ? 'razorpay' : 'paypal';
};

const applySuccessfulPaymentTransitions = async ({
  tx, orderId, bidId, projectId, milestoneId, paymentId, signature, providerEventId,
}) => {
  const clientProject = await ClientProject.findOne({
    where: { id: projectId }, transaction: tx, lock: tx.LOCK.UPDATE,
  });

  if (!clientProject) {
    await Transaction.update({ status: 'failed' }, { where: { orderId }, transaction: tx });
    return { alreadyClosed: false, applied: false };
  }

  if (clientProject.status === 2) {
    await Transaction.update({ status: 'failed' }, { where: { orderId }, transaction: tx });
    return { alreadyClosed: true, applied: false };
  }

  await ProjectBid.update({ status: 'accepted' }, { where: { id: bidId }, transaction: tx });

  await ProjectBid.update(
    { status: 'rejected' },
    { where: { project_id: projectId, id: { [Op.ne]: bidId }, status: { [Op.ne]: 'accepted' } }, transaction: tx },
  );

  await ClientProject.update({ status: 2 }, { where: { id: projectId }, transaction: tx });

  if (milestoneId) {
    await ProjectBidMilestone.update({ is_paid: true }, { where: { id: milestoneId }, transaction: tx });
  }

  const updatePayload = { status: 'success', paymentId, signature };
  if (providerEventId) updatePayload.provider_event_id = providerEventId;
  await Transaction.update(updatePayload, { where: { orderId }, transaction: tx });

  return { alreadyClosed: false, applied: true };
};

// --------------- Public API ---------------

/**
 * Create a payment order (Razorpay for India, PayPal otherwise).
 */
const createOrder = async ({ bidId, amount, milestoneId, userId }) => {
  const amountNumber = parseFloat(amount);
  if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
    throw new Error(`Invalid amount: ${amount}. Amount must be a positive number.`);
  }

  const bidData = await ProjectBid.findOne({ where: { id: bidId } });
  if (!bidData) throw new Error(`Bid not found for bidId=${bidId}`);

  const gateway = await getGatewayForClient(userId);

  if (gateway === 'razorpay') {
    const razorpayOrder = await razorpayService.createRazorpayOrder(amountNumber);
    if (!razorpayOrder?.id) throw new Error('Failed to create Razorpay order.');

    await Transaction.create({
      orderId: razorpayOrder.id,
      clientId: userId,
      amount: amountNumber,
      freelancerId: bidData.dataValues.from_user_id,
      status: 'pending',
      projectId: bidData.dataValues.project_id,
      bidId,
      signature: 'null',
      paymentId: 'null',
      milestone_id: milestoneId || null,
      gateway,
    });

    return { gateway, ...razorpayOrder };
  }

  // PayPal path (currently returns placeholder)
  return { gateway, paypalOrderId: null, approvalUrl: null };
};

/**
 * Verify Razorpay payment signature and finalize transaction.
 */
const updatePaymentStatus = async ({ razorpay_signature, razorpay_payment_id, razorpay_order_id }) => {
  if (!razorpay_order_id) return false;

  const transactionData = await Transaction.findOne({ where: { orderId: razorpay_order_id } });
  if (!transactionData) return false;
  if (transactionData.gateway && transactionData.gateway !== 'razorpay') return false;
  if (transactionData.status === 'success') return true;

  let isSignatureValid = false;
  if (razorpay_signature && razorpay_payment_id) {
    const expected = crypto
      .createHmac('sha256', process.env.razorpayApiSecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    isSignatureValid = expected === razorpay_signature;
  }

  const tx = await sequelize.transaction();
  try {
    const { bidId, projectId, milestone_id: milestoneId } = transactionData.dataValues;

    if (isSignatureValid) {
      await applySuccessfulPaymentTransitions({
        tx, orderId: razorpay_order_id, bidId, projectId, milestoneId,
        paymentId: razorpay_payment_id, signature: razorpay_signature,
      });
    } else {
      await Transaction.update({ status: 'failed' }, { where: { orderId: razorpay_order_id }, transaction: tx });
    }

    await tx.commit();
    return true;
  } catch (e) {
    await tx.rollback();
    throw e;
  }
};

/**
 * Handle PayPal webhook events.
 */
const handlePaypalWebhook = async (req) => {
  const tx = await sequelize.transaction();
  try {
    const eventBody = req.body;
    const transmissionId = req.headers['paypal-transmission-id'] || eventBody?.transmission_id;
    const transmissionTime = req.headers['paypal-transmission-time'] || eventBody?.transmission_time;
    const certUrl = req.headers['paypal-cert-url'] || eventBody?.cert_url;
    const authAlgo = req.headers['paypal-auth-algo'] || eventBody?.auth_algo;
    const transmissionSig = req.headers['paypal-transmission-sig'] || eventBody?.transmission_sig;

    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    if (!webhookId) throw new Error('Missing PAYPAL_WEBHOOK_ID.');

    const isVerified = await paypalService.verifyWebhookSignature({
      eventBody, transmissionId, transmissionTime, certUrl, authAlgo, transmissionSig, webhookId,
    });

    if (!isVerified) { await tx.rollback(); throw new Error('Invalid PayPal webhook signature.'); }

    const eventType = String(eventBody?.event_type || '').toUpperCase();
    const providerEventId = eventBody?.id || null;
    const resource = eventBody?.resource || {};
    const paypalOrderId = resource?.supplementary_data?.related_ids?.order_id
      || resource?.supplementary_data?.related_ids?.orderId
      || resource?.order_id || null;
    const captureId = resource?.id || null;

    if (!paypalOrderId) { await tx.commit(); return true; }

    const transactionData = await Transaction.findOne({
      where: { orderId: paypalOrderId, gateway: 'paypal' }, transaction: tx,
    });
    if (!transactionData) { await tx.commit(); return true; }

    if (transactionData.provider_event_id && providerEventId
      && transactionData.provider_event_id === providerEventId) {
      await tx.commit(); return true;
    }

    const isCaptureCompleted = eventType.includes('PAYMENT.CAPTURE.COMPLETED');
    const isCaptureDenied = eventType.includes('PAYMENT.CAPTURE.DENIED') || eventType.includes('PAYMENT.CAPTURE.DENY');

    if (isCaptureCompleted && transactionData.status !== 'success') {
      const { bidId, projectId, milestone_id: milestoneId } = transactionData.dataValues;
      await applySuccessfulPaymentTransitions({
        tx, orderId: paypalOrderId, bidId, projectId, milestoneId,
        paymentId: captureId, signature: providerEventId || 'paypal-capture', providerEventId,
      });
    } else if (isCaptureDenied && transactionData.status !== 'success') {
      await Transaction.update(
        { status: 'failed', ...(providerEventId ? { provider_event_id: providerEventId } : {}) },
        { where: { orderId: paypalOrderId }, transaction: tx },
      );
    }

    await tx.commit();
    return true;
  } catch (err) {
    try { await tx.rollback(); } catch (e) { /* ignore */ }
    throw err;
  }
};

/**
 * Get Razorpay order details.
 */
const getOrderDetails = async (orderId) => {
  if (!orderId) return null;
  return razorpayService.getRazorpayOrderDetails(orderId);
};

/**
 * Get transaction status for a user.
 */
const getTransactionStatus = async ({ userId, orderId, role }) => {
  if (!userId || !orderId) return null;
  const isAdmin = role === 'admin';
  const where = isAdmin ? { orderId } : { orderId, clientId: userId };
  return Transaction.findOne({ where });
};

/**
 * Get all transactions for a user.
 */
const getAllTransactions = async ({ userId, role }) => {
  if (!userId) return [];
  const isAdmin = role === 'admin';
  const where = isAdmin ? {} : { clientId: userId };
  return Transaction.findAll({ where });
};

export default {
  createOrder,
  updatePaymentStatus,
  handlePaypalWebhook,
  getOrderDetails,
  getTransactionStatus,
  getAllTransactions,
};
