import { Router } from 'express';
import disputeController from './dispute.controller';
import validate from '../../middlewares/validate.middleware';
import disputeValidation from './dispute.validation';
import authMiddleware from '../../middlewares/auth.middleware';

const router = Router();

router.post('/dispute', authMiddleware, validate(disputeValidation.createDispute), disputeController.createDispute);
router.post('/ongoing-projects', authMiddleware, validate(disputeValidation.getOngoingProjects), disputeController.getOngoingProjects);
router.post('/disputes', authMiddleware, disputeController.getDisputes);

export default router;
