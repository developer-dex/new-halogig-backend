import asyncHandler from '../../utils/asyncHandler';
import getHttpStatus from '../../utils/httpStatus';
import getMessage from '../../utils/message';
import websiteDataService from './websiteData.service';

const uploadExcel = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(getHttpStatus('BAD_REQUEST')).json({ success: false, message: 'No file uploaded' });
  const result = await websiteDataService.processExcelFile(req.file.path);
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: 'Excel processed successfully' });
});

const downloadExcel = asyncHandler(async (req, res) => {
  const buffer = await websiteDataService.generateExcelFile();
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=website-data.xlsx');
  return res.send(buffer);
});

const getCategories = asyncHandler(async (req, res) => {
  const result = await websiteDataService.getUniqueCategories();
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

const getByCategory = asyncHandler(async (req, res) => {
  const result = await websiteDataService.getWebsiteDataByCategory(req.params.categoryName);
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

const bulkUpdate = asyncHandler(async (req, res) => {
  const result = await websiteDataService.bulkUpdateWebsiteDataFields(req.body.updates);
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: 'Bulk update completed' });
});

const updateOrder = asyncHandler(async (req, res) => {
  const result = await websiteDataService.updateOrder(req.body.items);
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: 'Order updated' });
});

const getSlugs = asyncHandler(async (req, res) => {
  const result = await websiteDataService.getWebsiteDataSlugs();
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

const create = asyncHandler(async (req, res) => {
  const result = await websiteDataService.createWebsiteData(req.body);
  return res.status(getHttpStatus('CREATED')).json({ success: true, data: result, message: 'Website data created' });
});

const getAll = asyncHandler(async (req, res) => {
  const result = await websiteDataService.getAllWebsiteData(req.query);
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

const getById = asyncHandler(async (req, res) => {
  const result = await websiteDataService.getWebsiteDataById(req.params.id);
  if (!result) return res.status(getHttpStatus('NOT_FOUND')).json({ success: false, data: null, message: 'Not found' });
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

const update = asyncHandler(async (req, res) => {
  const result = await websiteDataService.updateWebsiteData(req.params.id, req.body);
  if (!result) return res.status(getHttpStatus('NOT_FOUND')).json({ success: false, data: null, message: 'Not found' });
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: 'Updated successfully' });
});

const uploadVideoThumbnail = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(getHttpStatus('BAD_REQUEST')).json({ success: false, message: 'No file uploaded' });
  const result = await websiteDataService.updateWebsiteVideoThumbnail(req.params.id, req.file);
  if (!result) return res.status(getHttpStatus('NOT_FOUND')).json({ success: false, data: null, message: 'Not found' });
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: 'Thumbnail updated' });
});

const remove = asyncHandler(async (req, res) => {
  const result = await websiteDataService.deleteWebsiteData(req.params.id);
  if (!result) return res.status(getHttpStatus('NOT_FOUND')).json({ success: false, data: null, message: 'Not found' });
  return res.status(getHttpStatus('OK')).json({ success: true, data: null, message: 'Deleted successfully' });
});

const removeAll = asyncHandler(async (req, res) => {
  await websiteDataService.deleteAllWebsiteData();
  return res.status(getHttpStatus('OK')).json({ success: true, data: null, message: 'All website data deleted' });
});

const getByServiceName = asyncHandler(async (req, res) => {
  const result = await websiteDataService.getWebsiteDataByServiceName(req.params.serviceName, req.params.ipAddress);
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

const getPublicByCategory = asyncHandler(async (req, res) => {
  const result = await websiteDataService.getWebsiteDataByCategory(req.params.categoryName);
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

const dataByIndustry = asyncHandler(async (req, res) => {
  const result = await websiteDataService.getDataByIndustry(req.body);
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

export default {
  uploadExcel, downloadExcel, getCategories, getByCategory, bulkUpdate, updateOrder,
  getSlugs, create, getAll, getById, update, uploadVideoThumbnail, remove, removeAll,
  getByServiceName, getPublicByCategory, dataByIndustry,
};
