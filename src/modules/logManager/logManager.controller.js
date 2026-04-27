import asyncHandler from '../../utils/asyncHandler';
import getHttpStatus from '../../utils/httpStatus';
import logManagerService from './logManager.service';

const getLogs = asyncHandler(async (req, res) => {
  const result = await logManagerService.getLogs(req.query);
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

const getLogStatistics = asyncHandler(async (req, res) => {
  const result = await logManagerService.getLogStatistics();
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

const getCriticalErrors = asyncHandler(async (req, res) => {
  const result = await logManagerService.getCriticalErrors(req.query);
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

const getUnresolvedErrors = asyncHandler(async (req, res) => {
  const result = await logManagerService.getUnresolvedErrors(req.query);
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

const getUserLogs = asyncHandler(async (req, res) => {
  const result = await logManagerService.getUserLogs(req.params.userId, req.query);
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

const getApiEndpointLogs = asyncHandler(async (req, res) => {
  const result = await logManagerService.getApiEndpointLogs(req.params.endpoint, req.query);
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

const markLogAsResolved = asyncHandler(async (req, res) => {
  const result = await logManagerService.markLogAsResolved(req.params.id);
  if (!result) return res.status(getHttpStatus('NOT_FOUND')).json({ success: false, data: null, message: 'Log not found' });
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: 'Log resolved' });
});

const cleanupOldLogs = asyncHandler(async (req, res) => {
  const result = await logManagerService.cleanupOldLogs(req.query.daysOld);
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: 'Cleanup completed' });
});

export default {
  getLogs,
  getLogStatistics,
  getCriticalErrors,
  getUnresolvedErrors,
  getUserLogs,
  getApiEndpointLogs,
  markLogAsResolved,
  cleanupOldLogs,
};
