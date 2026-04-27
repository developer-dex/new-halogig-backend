import asyncHandler from '../../utils/asyncHandler';
import getHttpStatus from '../../utils/httpStatus';
import googleMeetService from './googleMeet.service';

const authorize = asyncHandler(async (req, res) => {
  const result = googleMeetService.getAuthorizationUrl();
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

const callback = asyncHandler(async (req, res) => {
  const { code, state } = req.query;
  const html = googleMeetService.handleCallback(code, state);
  return res.send(html);
});

const generateTokens = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const result = await googleMeetService.generateAndSaveTokens(code);
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: 'Tokens generated successfully' });
});

const getTokenDetails = asyncHandler(async (req, res) => {
  const result = await googleMeetService.getTokenDetails();
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

const clearTokens = asyncHandler(async (req, res) => {
  await googleMeetService.clearTokens();
  return res.status(getHttpStatus('OK')).json({ success: true, data: null, message: 'Tokens cleared' });
});

export default {
  authorize,
  callback,
  generateTokens,
  getTokenDetails,
  clearTokens,
};
