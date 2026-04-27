import { Router } from 'express';
import feedbackController from './feedback.controller';
import validate from '../../middlewares/validate.middleware';
import feedbackValidation from './feedback.validation';
import authMiddleware from '../../middlewares/auth.middleware';

const router = Router();

router.post('/client/feedback', authMiddleware, validate(feedbackValidation.createFeedback), feedbackController.createFeedback);
router.get('/freelancer/feedback', authMiddleware, feedbackController.getFreelancerFeedback);

export default router;
