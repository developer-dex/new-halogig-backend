import { Router } from 'express';
import googleMeetController from './googleMeet.controller';
import adminAuthMiddleware from '../../middlewares/adminAuth.middleware';

const router = Router();

router.get('/admin/google-meet/authorize', adminAuthMiddleware, googleMeetController.authorize);
router.get('/admin/google-meet/callback', googleMeetController.callback);
router.post('/admin/google-meet/generate-tokens', adminAuthMiddleware, googleMeetController.generateTokens);
router.get('/admin/google-meet/token-details', adminAuthMiddleware, googleMeetController.getTokenDetails);
router.post('/admin/google-meet/clear-tokens', adminAuthMiddleware, googleMeetController.clearTokens);

export default router;
