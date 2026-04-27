import { AdminNotification } from '../models';

/**
 * Create a single generic admin notification row (visible to all admins).
 *
 * @param {{ notification_type: string, sender_user_id?: number|null, title: string, description: string, url?: string|null }} data
 */
export async function createAdminNotification(data) {
  return AdminNotification.create({
    notification_type: data.notification_type,
    sender_user_id: data.sender_user_id ?? null,
    title: data.title,
    description: data.description,
    url: data.url ?? null,
    is_seen: false,
  });
}

export default { createAdminNotification };
