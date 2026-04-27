import { Router } from 'express';
import notificationController from './notification.controller';
import validate from '../../middlewares/validate.middleware';
import notificationValidation from './notification.validation';
import authMiddleware from '../../middlewares/auth.middleware';

const router = Router();

router.get('/user/in-app-notifications/unread-count', authMiddleware, notificationController.getMyInAppNotificationsUnreadCount);
router.get('/user/in-app-notifications', authMiddleware, validate(notificationValidation.getNotifications), notificationController.getMyInAppNotifications);
router.patch('/user/in-app-notifications/read-all', authMiddleware, notificationController.markAllMyInAppNotificationsAsSeen);
router.patch('/user/in-app-notifications/:id/read', authMiddleware, validate(notificationValidation.markOneRead), notificationController.markMyInAppNotificationAsSeen);

export default router;
