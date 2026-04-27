import { Router } from 'express';
import webRotDataController from './webRotData.controller';
import adminAuthMiddleware from '../../middlewares/adminAuth.middleware';

const router = Router();

router.get('/admin/web-rot-data/unique-industries', adminAuthMiddleware, webRotDataController.getUniqueIndustries);
router.get('/admin/web-rot-data/unique-slug-links', adminAuthMiddleware, webRotDataController.getUniqueSlugLinks);
router.get('/admin/web-rot-data', adminAuthMiddleware, webRotDataController.getAll);

export default router;
