import { InAppNotification } from '../../models';
import { calculatePagination } from '../../utils/pagination';

const getMyInAppNotifications = async ({ userId, query }) => {
  const { offset, parsedLimit } = calculatePagination(query.page, query.limit);
  const { rows, count } = await InAppNotification.findAndCountAll({
    where: { receiver_id: userId }, order: [['created_at', 'DESC']], limit: parsedLimit, offset,
  });
  return { data: rows.map((r) => (r.toJSON ? r.toJSON() : r)), totalCount: count };
};

const getUnreadCount = async (userId) => InAppNotification.count({
  where: { receiver_id: userId, is_seen: false },
});

const markAsSeen = async ({ notificationId, userId }) => {
  const [count] = await InAppNotification.update({ is_seen: true }, { where: { id: notificationId, receiver_id: userId } });
  return count;
};

const markAllAsSeen = async (userId) => {
  const [count] = await InAppNotification.update({ is_seen: true }, { where: { receiver_id: userId, is_seen: false } });
  return count;
};

export default { getMyInAppNotifications, getUnreadCount, markAsSeen, markAllAsSeen };
