import { Router } from 'express';
import linkedInMarketingController from './linkedInMarketing.controller';
import adminAuthMiddleware from '../../middlewares/adminAuth.middleware';

const router = Router();

router.get('/admin/linkedin/authorize', adminAuthMiddleware, linkedInMarketingController.authorize);
router.get('/admin/linkedin/callback', linkedInMarketingController.callback);
router.post('/admin/linkedin/generate-tokens', adminAuthMiddleware, linkedInMarketingController.generateTokens);
router.get('/admin/linkedin/token-details', adminAuthMiddleware, linkedInMarketingController.getTokenDetails);
router.post('/admin/linkedin/clear-tokens', adminAuthMiddleware, linkedInMarketingController.clearTokens);
router.patch('/admin/linkedin/toggle-status', adminAuthMiddleware, linkedInMarketingController.toggleStatus);

export default router;
