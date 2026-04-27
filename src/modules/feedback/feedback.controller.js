import asyncHandler from '../../utils/asyncHandler';
import getHttpStatus from '../../utils/httpStatus';
import getMessage from '../../utils/message';
import feedbackService from './feedback.service';

const createFeedback = asyncHandler(async (req, res) => {
  const result = await feedbackService.createFeedback({ body: req.body, userId: req.user.id });
  res.status(getHttpStatus('OK')).json({ success: true, data: result, message: getMessage(req, false, 'SIGNUP') });
});

const getFreelancerFeedback = asyncHandler(async (req, res) => {
  const result = await feedbackService.getFreelancerFeedback(req.user.id);
  res.status(getHttpStatus('OK')).json({ success: true, data: result, message: getMessage(req, false, 'SIGNUP') });
});

export default { createFeedback, getFreelancerFeedback };
