import asyncHandler from '../../utils/asyncHandler';
import getHttpStatus from '../../utils/httpStatus';
import linkedInMarketingService from './linkedInMarketing.service';

const authorize = asyncHandler(async (req, res) => {
  const result = linkedInMarketingService.getAuthorizationUrl();
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

const callback = asyncHandler(async (req, res) => {
  const { code, state } = req.query;
  const html = linkedInMarketingService.handleCallback(code, state);
  return res.send(html);
});

const generateTokens = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const result = await linkedInMarketingService.generateAndSaveTokens(code);
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: 'Tokens generated successfully' });
});

const getTokenDetails = asyncHandler(async (req, res) => {
  const result = await linkedInMarketingService.getTokenDetails();
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

const clearTokens = asyncHandler(async (req, res) => {
  await linkedInMarketingService.clearTokens();
  return res.status(getHttpStatus('OK')).json({ success: true, data: null, message: 'Tokens cleared' });
});

const toggleStatus = asyncHandler(async (req, res) => {
  const result = await linkedInMarketingService.togglePostingStatus();
  if (!result) return res.status(getHttpStatus('NOT_FOUND')).json({ success: false, data: null, message: 'Token not found' });
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: 'Status toggled' });
});

export default {
  authorize,
  callback,
  generateTokens,
  getTokenDetails,
  clearTokens,
  toggleStatus,
};
