import { Router } from 'express';
import billingController from './billing.controller';
import validate from '../../middlewares/validate.middleware';
import billingValidation from './billing.validation';
import authMiddleware from '../../middlewares/auth.middleware';
import fileUpload from '../../middlewares/fileUpload.middleware';

const router = Router();

router.post('/add-billing-details', authMiddleware, validate(billingValidation.addBillingDetails), billingController.addBillingDetails);
router.post('/add-gst-details', authMiddleware, fileUpload.uploadGstImage, billingController.addGstDetails);
router.put('/update-billing-details', authMiddleware, billingController.updateBillingDetails);
router.get('/billing-information', authMiddleware, billingController.getBillingInformation);
router.get('/client-county-city-state', authMiddleware, billingController.getClientCountyCityState);
router.put('/bid/:bidId/gst-details', authMiddleware, fileUpload.uploadGstImage, validate(billingValidation.updateGstDetails), billingController.updateGstDetails);
router.post('/create-payment', authMiddleware, validate(billingValidation.createPayment), billingController.createPayment);
router.put('/change-payment-status', authMiddleware, validate(billingValidation.changePaymentStatus), billingController.changePaymentStatus);
router.get('/freelancer/payment-dashboard', authMiddleware, billingController.getFreelancerPaymentDashboard);
router.get('/freelancer/payment-list', authMiddleware, validate(billingValidation.getFreelancerPaymentList), billingController.getFreelancerPaymentList);

export default router;
