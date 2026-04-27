import { Router } from 'express';
import paymentController from './payment.controller';
import validate from '../../middlewares/validate.middleware';
import paymentValidation from './payment.validation';
import authMiddleware from '../../middlewares/auth.middleware';

const router = Router();

router.post('/order', authMiddleware, validate(paymentValidation.createOrder), paymentController.createRazorpayOrder);
router.get('/order', paymentController.getRazorpayOrderDetails);
router.post('/order-status', validate(paymentValidation.updatePaymentStatus), paymentController.updatePaymentStatus);
router.get('/user-order', authMiddleware, paymentController.getAllTransaction);
router.get('/transaction-status', authMiddleware, paymentController.getTransactionStatus);
router.post('/paypal/webhook', paymentController.paypalWebhook);

export default router;
