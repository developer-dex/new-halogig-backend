import asyncHandler from '../../utils/asyncHandler';
import getHttpStatus from '../../utils/httpStatus';
import getMessage from '../../utils/message';
import disputeService from './dispute.service';

const createDispute = asyncHandler(async (req, res) => {
  const result = await disputeService.createDispute({ body: req.body, userId: req.user.id });
  res.status(getHttpStatus('OK')).json({ success: true, data: result, message: getMessage(req, false, 'SIGNUP') });
});

const getOngoingProjects = asyncHandler(async (req, res) => {
  const result = await disputeService.getOngoingProjects({ userId: req.user.id, generatedBy: req.body.generated_by });
  res.status(getHttpStatus('OK')).json({ success: true, data: result, message: getMessage(req, false, 'SIGNUP') });
});

const getDisputes = asyncHandler(async (req, res) => {
  const result = await disputeService.getDisputes(req.user.id);
  res.status(getHttpStatus('OK')).json({ success: true, data: result, message: getMessage(req, false, 'SIGNUP') });
});

export default { createDispute, getOngoingProjects, getDisputes };
