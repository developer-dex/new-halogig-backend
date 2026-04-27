import asyncHandler from '../../utils/asyncHandler';
import getHttpStatus from '../../utils/httpStatus';
import getMessage from '../../utils/message';
import billingService from './billing.service';

const ok = (req, res, data) => res.status(getHttpStatus('OK')).json({ success: true, data, message: getMessage(req, false, 'SIGNUP') });

const addBillingDetails = asyncHandler(async (req, res) => { ok(req, res, await billingService.addBillingDetails({ body: req.body, userId: req.user.id })); });
const addGstDetails = asyncHandler(async (req, res) => { ok(req, res, await billingService.addGstDetails({ body: req.body, files: req.files, userId: req.user.id })); });
const updateBillingDetails = asyncHandler(async (req, res) => { ok(req, res, await billingService.updateBillingDetails({ body: req.body, file: req.file })); });
const getBillingInformation = asyncHandler(async (req, res) => { ok(req, res, await billingService.getBillingInformation(req.user.id)); });
const getClientCountyCityState = asyncHandler(async (req, res) => { ok(req, res, await billingService.getClientCountyCityState(req.user.id)); });
const updateGstDetails = asyncHandler(async (req, res) => { ok(req, res, await billingService.updateGstDetails({ bidId: req.params.bidId, body: req.body, files: req.files, userId: req.user.id })); });
const createPayment = asyncHandler(async (req, res) => { ok(req, res, await billingService.createPayment(req.body)); });
const changePaymentStatus = asyncHandler(async (req, res) => { ok(req, res, await billingService.changePaymentStatus(req.body)); });
const getFreelancerPaymentDashboard = asyncHandler(async (req, res) => { ok(req, res, await billingService.getFreelancerPaymentDashboard(req.user.id)); });
const getFreelancerPaymentList = asyncHandler(async (req, res) => { ok(req, res, await billingService.getFreelancerPaymentList({ freelancerId: req.user.id, query: req.query })); });

export default {
  addBillingDetails, addGstDetails, updateBillingDetails, getBillingInformation,
  getClientCountyCityState, updateGstDetails, createPayment, changePaymentStatus,
  getFreelancerPaymentDashboard, getFreelancerPaymentList,
};
