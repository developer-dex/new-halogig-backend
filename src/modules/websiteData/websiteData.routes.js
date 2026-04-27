import { Router } from 'express';
import websiteDataController from './websiteData.controller';
import validate from '../../middlewares/validate.middleware';
import websiteDataValidation from './websiteData.validation';
import adminAuthMiddleware from '../../middlewares/adminAuth.middleware';
import fileUpload from '../../middlewares/fileUpload.middleware';

const router = Router();

// Admin routes
router.post('/admin/website-data/upload-excel', adminAuthMiddleware, fileUpload.uploadWebsiteDataExcel, websiteDataController.uploadExcel);
router.get('/admin/website-data/download-excel', adminAuthMiddleware, websiteDataController.downloadExcel);
router.get('/admin/website-data/categories', adminAuthMiddleware, websiteDataController.getCategories);
router.get('/admin/website-data/category/:categoryName', adminAuthMiddleware, validate(websiteDataValidation.categoryNameParam), websiteDataController.getByCategory);
router.patch('/admin/website-data/bulk-update', adminAuthMiddleware, validate(websiteDataValidation.bulkUpdate), websiteDataController.bulkUpdate);
router.patch('/admin/website-data/update-order', adminAuthMiddleware, validate(websiteDataValidation.updateOrder), websiteDataController.updateOrder);
router.get('/admin/website-data-slugs', adminAuthMiddleware, websiteDataController.getSlugs);
router.post('/admin/website-data', adminAuthMiddleware, validate(websiteDataValidation.createWebsiteData), websiteDataController.create);
router.get('/admin/website-data', adminAuthMiddleware, websiteDataController.getAll);
router.get('/admin/website-data/:id', adminAuthMiddleware, validate(websiteDataValidation.idParam), websiteDataController.getById);
router.put('/admin/website-data/:id', adminAuthMiddleware, validate(websiteDataValidation.idParam), websiteDataController.update);
router.post('/admin/website-data/:id/video-thumbnail', adminAuthMiddleware, fileUpload.uploadWebsiteVideoThumbnail, websiteDataController.uploadVideoThumbnail);
router.delete('/admin/website-data/:id', adminAuthMiddleware, validate(websiteDataValidation.idParam), websiteDataController.remove);
router.delete('/admin/website-data', adminAuthMiddleware, websiteDataController.removeAll);

// Public routes
router.get('/website-data/service/:serviceName/:ipAddress', validate(websiteDataValidation.serviceNameParam), websiteDataController.getByServiceName);
router.get('/website-data/category/:categoryName', validate(websiteDataValidation.categoryNameParam), websiteDataController.getPublicByCategory);
router.post('/data-by-industry', validate(websiteDataValidation.dataByIndustry), websiteDataController.dataByIndustry);

export default router;
