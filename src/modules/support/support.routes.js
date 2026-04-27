import { Router } from 'express';
import supportController from './support.controller';
import validate from '../../middlewares/validate.middleware';
import supportValidation from './support.validation';
import authMiddleware from '../../middlewares/auth.middleware';

const router = Router();

router.post('/report-problem', authMiddleware, validate(supportValidation.createReportProblem), supportController.createReportProblem);

export default router;
