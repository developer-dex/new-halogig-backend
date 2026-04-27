import asyncHandler from '../../utils/asyncHandler';
import getHttpStatus from '../../utils/httpStatus';
import getMessage from '../../utils/message';
import salesReferralService from './salesReferral.service';

const createSalesReferralLead = asyncHandler(async (req, res) => {
  const result = await salesReferralService.createSalesReferralLead({ body: req.body, userId: req.user.id });
  res.status(getHttpStatus('OK')).json({ success: true, data: result, message: getMessage(req, false, 'SIGNUP') });
});

const getSalesReferralLeads = asyncHandler(async (req, res) => {
  const result = await salesReferralService.getSalesReferralLeads(req.user.id);
  res.status(getHttpStatus('OK')).json({ success: true, data: result, message: getMessage(req, false, 'SIGNUP') });
});

const getSalesReferralLeadDetail = asyncHandler(async (req, res) => {
  const result = await salesReferralService.getSalesReferralLeadDetail({ id: req.params.id, userId: req.user.id });
  res.status(getHttpStatus('OK')).json({ success: true, data: result, message: getMessage(req, false, 'SIGNUP') });
});

export default { createSalesReferralLead, getSalesReferralLeads, getSalesReferralLeadDetail };
