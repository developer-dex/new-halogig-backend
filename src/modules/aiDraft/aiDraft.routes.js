import { Router } from 'express';
import aiDraftController from './aiDraft.controller';
import validate from '../../middlewares/validate.middleware';
import aiDraftValidation from './aiDraft.validation';
import adminAuthMiddleware from '../../middlewares/adminAuth.middleware';

const router = Router();

router.get('/draft/campaign-names', adminAuthMiddleware, aiDraftController.getDraftCampaignNames);
router.post('/followup/start', adminAuthMiddleware, validate(aiDraftValidation.startFollowup), aiDraftController.startFollowup);

export default router;
