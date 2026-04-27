import asyncHandler from '../../utils/asyncHandler';
import getHttpStatus from '../../utils/httpStatus';
import getMessage from '../../utils/message';
import notificationService from './notification.service';

const getMyInAppNotifications = asyncHandler(async (req, res) => {
  const result = await notificationService.getMyInAppNotifications({ userId: req.user.id, query: req.query });
  res.status(getHttpStatus('OK')).json({ success: true, data: result, message: getMessage(req, false, 'SIGNUP') });
});

const getMyInAppNotificationsUnreadCount = asyncHandler(async (req, res) => {
  const count = await notificationService.getUnreadCount(req.user.id);
  res.status(getHttpStatus('OK')).json({ success: true, data: { unreadCount: count }, message: getMessage(req, false, 'SIGNUP') });
});

const markMyInAppNotificationAsSeen = asyncHandler(async (req, res) => {
  const result = await notificationService.markAsSeen({ notificationId: req.params.id, userId: req.user.id });
  res.status(getHttpStatus('OK')).json({ success: true, data: { updated: result }, message: getMessage(req, false, 'SIGNUP') });
});

const markAllMyInAppNotificationsAsSeen = asyncHandler(async (req, res) => {
  const result = await notificationService.markAllAsSeen(req.user.id);
  res.status(getHttpStatus('OK')).json({ success: true, data: { updated: result }, message: getMessage(req, false, 'SIGNUP') });
});

export default { getMyInAppNotifications, getMyInAppNotificationsUnreadCount, markMyInAppNotificationAsSeen, markAllMyInAppNotificationsAsSeen };
