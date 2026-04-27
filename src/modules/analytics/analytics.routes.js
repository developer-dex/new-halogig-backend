import { Router } from 'express';
import analyticsController from './analytics.controller';
import validate from '../../middlewares/validate.middleware';
import analyticsValidation from './analytics.validation';

const router = Router();

// All public routes
router.post('/page-wise-engagement', validate(analyticsValidation.pageWiseEngagement), analyticsController.pageWiseEngagement);
router.post('/verify-turnstile', validate(analyticsValidation.verifyTurnstile), analyticsController.verifyTurnstile);
router.post('/user-function', validate(analyticsValidation.createUserFunction), analyticsController.createUserFunction);

export default router;
