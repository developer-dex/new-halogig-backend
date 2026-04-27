import asyncHandler from '../../utils/asyncHandler';
import getHttpStatus from '../../utils/httpStatus';
import webRotDataService from './webRotData.service';

const getAll = asyncHandler(async (req, res) => {
  const result = await webRotDataService.getAllWebRotData(req.query);
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

const getUniqueIndustries = asyncHandler(async (req, res) => {
  const result = await webRotDataService.getUniqueIndustries();
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

const getUniqueSlugLinks = asyncHandler(async (req, res) => {
  const result = await webRotDataService.getUniqueSlugLinks();
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

export default {
  getAll,
  getUniqueIndustries,
  getUniqueSlugLinks,
};
