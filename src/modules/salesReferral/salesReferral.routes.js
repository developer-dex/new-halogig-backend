import { Router } from 'express';
import salesReferralController from './salesReferral.controller';
import validate from '../../middlewares/validate.middleware';
import salesReferralValidation from './salesReferral.validation';
import authMiddleware from '../../middlewares/auth.middleware';

const router = Router();

router.post('/sales-referral-lead', authMiddleware, validate(salesReferralValidation.createSalesReferralLead), salesReferralController.createSalesReferralLead);
router.get('/sales-referral-leads', authMiddleware, salesReferralController.getSalesReferralLeads);
router.get('/sales-referral-leads/:id', authMiddleware, validate(salesReferralValidation.idParam), salesReferralController.getSalesReferralLeadDetail);

export default router;
