import asyncHandler from '../../utils/asyncHandler';
import getHttpStatus from '../../utils/httpStatus';
import twitterMarketingService from './twitterMarketing.service';

const saveTokens = asyncHandler(async (req, res) => {
  const result = await twitterMarketingService.saveTokens(req.body);
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: 'Tokens saved' });
});

const getTokenDetails = asyncHandler(async (req, res) => {
  const result = await twitterMarketingService.getTokenDetails();
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

const clearTokens = asyncHandler(async (req, res) => {
  await twitterMarketingService.clearTokens();
  return res.status(getHttpStatus('OK')).json({ success: true, data: null, message: 'Tokens cleared' });
});

const toggleStatus = asyncHandler(async (req, res) => {
  const result = await twitterMarketingService.togglePostingStatus();
  if (!result) return res.status(getHttpStatus('NOT_FOUND')).json({ success: false, data: null, message: 'Token not found' });
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: 'Status toggled' });
});

const testConnection = asyncHandler(async (req, res) => {
  const result = await twitterMarketingService.testConnection();
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

export default {
  saveTokens,
  getTokenDetails,
  clearTokens,
  toggleStatus,
  testConnection,
};
