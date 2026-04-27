import { Router } from 'express';
import industryController from './industry.controller';
import validate from '../../middlewares/validate.middleware';
import industryValidation from './industry.validation';
import authMiddleware from '../../middlewares/auth.middleware';

const router = Router();

router.get('/industry', industryController.getIndustry);

router.post(
  '/industry',
  authMiddleware,
  validate(industryValidation.createIndustry),
  industryController.createIndustry,
);

router.get('/customerIndustry', authMiddleware, industryController.getCustomerIndustries);

export default router;
