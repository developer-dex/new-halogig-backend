import asyncHandler from '../../utils/asyncHandler';
import getHttpStatus from '../../utils/httpStatus';
import getMessage from '../../utils/message';
import sowService from './sow.service';
import platformNotificationService from '../../services/platformNotification.service';
 
const ok = (req, res, data, msgKey = 'SIGNUP') => res.status(getHttpStatus('OK')).json({ success: true, data, message: getMessage(req, false, msgKey) });
const bad = (req, res, msgKey = 'FALSE_RESPONSE') => res.status(getHttpStatus('BAD_REQUEST')).json({ success: false, data: null, message: getMessage(req, false, msgKey) });

const createSow = asyncHandler(async (req, res) => {
  const result = await sowService.createSow({ body: req.body, userId: req.user.id });
  if (result) {
    platformNotificationService.notifyClientSowSubmitted({ sow: result, freelancerUser: req.user, body: req.body });
  }
  return result ? ok(req, res, result) : bad(req, res);
});

const updateSow = asyncHandler(async (req, res) => {
  const result = await sowService.updateSow({ id: req.params.id, body: req.body });
  if (result) {
    platformNotificationService.notifyFreelancerSowStatusChanged({ sowId: req.params.id, clientUser: req.user, body: req.body, updateResult: result });
  }
  return result ? ok(req, res, result) : bad(req, res);
});

const getSowDetail = asyncHandler(async (req, res) => {
  const result = await sowService.getSowDetail(req.params.id, req.user.id);
  if (!result) {
    return res.status(getHttpStatus('FORBIDDEN')).json({ success: false, data: null, message: getMessage(req, false, 'Access denied') });
  }
  return ok(req, res, result);
});

const getAllSow = asyncHandler(async (req, res) => {
  const result = await sowService.getAllSow();
  return result ? ok(req, res, result) : bad(req, res);
});

const getAllUserSow = asyncHandler(async (req, res) => {
  const result = await sowService.getAllUserSow(req.user.id);
  return result ? ok(req, res, result) : bad(req, res);
});

const deleteSow = asyncHandler(async (req, res) => {
  const result = await sowService.deleteSow(req.params.id, req.user.id);
  return result ? ok(req, res, result) : bad(req, res);
});

export default { createSow, updateSow, getSowDetail, getAllSow, getAllUserSow, deleteSow };
