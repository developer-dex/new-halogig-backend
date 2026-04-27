import { InAppNotification } from '../models';
import { IN_APP_NOTIFICATION_TYPES } from '../constants/inAppNotificationTypes';

/**
 * Replace $placeholder tokens in a template string with values from params.
 */
export function interpolateTemplate(template, params = {}) {
  if (!template) return '';
  return template.replace(/\$(\w+)/g, (_, key) => (params[key] !== undefined ? String(params[key]) : `$${key}`));
}

/**
 * Create a single in-app notification row.
 *
 * @param {string} type - IN_APP_NOTIFICATION_TYPE key
 * @param {number|null} senderId - users.id of actor (null for admin/system)
 * @param {number} receiverId - users.id of recipient
 * @param {{ params?: object, url?: string }} [options]
 */
export async function createInAppNotification(type, senderId, receiverId, options = {}) {
  const definition = IN_APP_NOTIFICATION_TYPES[type];
  if (!definition) throw new Error(`Unknown notification type: ${type}`);

  const { params = {}, url } = options;
  const title = interpolateTemplate(definition.title, params);
  const description = interpolateTemplate(definition.description, params);
  const resolvedUrl = url || (definition.url ? interpolateTemplate(definition.url, params) : null);

  return InAppNotification.create({
    notification_type: type,
    sender_id: senderId ?? null,
    receiver_id: receiverId,
    title,
    description,
    url: resolvedUrl,
    is_seen: false,
  });
}

export default { createInAppNotification, interpolateTemplate };
