import asyncHandler from '../../utils/asyncHandler';
import getHttpStatus from '../../utils/httpStatus';
import analyticsService from './analytics.service';

const pageWiseEngagement = asyncHandler(async (req, res) => {
  const result = await analyticsService.pageWiseEngagement(req.body);
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

const verifyTurnstile = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const result = await analyticsService.verifyTurnstileToken(token, ip);
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

const createUserFunction = asyncHandler(async (req, res) => {
  const result = await analyticsService.createUserFunction(req.body);
  return res.status(getHttpStatus('CREATED')).json({ success: true, data: result, message: '' });
});

export default {
  pageWiseEngagement,
  verifyTurnstile,
  createUserFunction,
};
