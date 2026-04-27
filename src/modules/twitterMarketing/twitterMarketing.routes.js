import { Router } from 'express';
import twitterMarketingController from './twitterMarketing.controller';
import validate from '../../middlewares/validate.middleware';
import twitterMarketingValidation from './twitterMarketing.validation';
import adminAuthMiddleware from '../../middlewares/adminAuth.middleware';

const router = Router();

router.post('/admin/twitter/save-tokens', adminAuthMiddleware, validate(twitterMarketingValidation.saveTokens), twitterMarketingController.saveTokens);
router.get('/admin/twitter/token-details', adminAuthMiddleware, twitterMarketingController.getTokenDetails);
router.post('/admin/twitter/clear-tokens', adminAuthMiddleware, twitterMarketingController.clearTokens);
router.patch('/admin/twitter/toggle-status', adminAuthMiddleware, twitterMarketingController.toggleStatus);
router.post('/admin/twitter/test-connection', adminAuthMiddleware, twitterMarketingController.testConnection);

export default router;
