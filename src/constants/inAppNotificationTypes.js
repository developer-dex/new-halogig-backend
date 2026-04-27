/**
 * Type keys for in-app notifications. Use these when calling
 * inAppNotificationService.createInAppNotification.
 *
 * Title and description templates use $paramName placeholders replaced at runtime.
 *
 * Sender policy (no polymorphic admin FK):
 * - Pass IN_APP_NO_USER_SENDER (null) when the actor is an admin, automated job, or system.
 * - Never put admins.id in sender_id — it references users.id only.
 * - Put display text in options.params (e.g. actorName: 'Halogig Team') if templates need it.
 */
export const IN_APP_NO_USER_SENDER = null;

export const IN_APP_NOTIFICATION_TYPE = {
  /** Sample: client published a project relevant to the freelancer */
  PROJECT_PUBLISHED: 'PROJECT_PUBLISHED',
  /** Sample: new chat message in a room */
  NEW_CHAT_MESSAGE: 'NEW_CHAT_MESSAGE',
  /** Sample: someone placed a bid on a project */
  BID_RECEIVED: 'BID_RECEIVED',
  /** Freelancer updated an existing bid; notify client */
  BID_UPDATED: 'BID_UPDATED',
  /** Freelancer submitted a Statement of Work (SOW); notify client */
  SOW_SUBMITTED: 'SOW_SUBMITTED',
  /** Client updated SOW status; notify freelancer */
  SOW_STATUS_UPDATED: 'SOW_STATUS_UPDATED',
  /** Admin updated client project status; notify client */
  PROJECT_STATUS_UPDATED: 'PROJECT_STATUS_UPDATED',
  /** Sample: payment completed */
  PAYMENT_RECEIVED: 'PAYMENT_RECEIVED',
  /** Sample: admin or system approved a profile */
  PROFILE_APPROVED: 'PROFILE_APPROVED',
  /** Sample: milestone or deadline reminder */
  PROJECT_MILESTONE_DUE: 'PROJECT_MILESTONE_DUE',
};

/**
 * @typedef {object} InAppNotificationTypeDefinition
 * @property {string} title - Template with $placeholders
 * @property {string} description - Template with $placeholders
 * @property {string} [url] - Optional default URL template with $placeholders
 */

/** @type {Record<string, InAppNotificationTypeDefinition>} */
export const IN_APP_NOTIFICATION_TYPES = {
  [IN_APP_NOTIFICATION_TYPE.PROJECT_PUBLISHED]: {
    title: 'New project: $projectTitle',
    description: '$publisherName posted a new project. Category: $categoryName.',
    url: '/projects/$projectId',
  },
  [IN_APP_NOTIFICATION_TYPE.NEW_CHAT_MESSAGE]: {
    title: 'New message from $senderName',
    description: 'You have a new message in $roomName: "$messagePreview"',
    url: '/chat/$roomId',
  },
  [IN_APP_NOTIFICATION_TYPE.BID_RECEIVED]: {
    title: 'New bid on $projectTitle',
    description: '$bidderName submitted a bid of $bidAmount for your project.',
    url: '/projects/$projectId/bids',
  },
  [IN_APP_NOTIFICATION_TYPE.BID_UPDATED]: {
    title: 'Bid updated on $projectTitle',
    description: '$bidderName updated their bid. Current amount: $bidAmount.',
    url: '/projects/$projectId/bids',
  },
  [IN_APP_NOTIFICATION_TYPE.SOW_SUBMITTED]: {
    title: 'SOW submitted for $projectTitle',
    description: '$actorName submitted a Statement of Work (SOW) for your review.',
    url: '/project-details/proposal-details/$projectBidId',
  },
  [IN_APP_NOTIFICATION_TYPE.SOW_STATUS_UPDATED]: {
    title: 'SOW $sowStatus for $projectTitle',
    description: '$actorName marked the SOW as "$sowStatus" for $projectTitle.',
    url: '/project-details/statement-of-work/$projectBidId',
  },
  [IN_APP_NOTIFICATION_TYPE.PROJECT_STATUS_UPDATED]: {
    title: 'Project status updated: $projectStatus',
    description: '$actorName set your project "$projectTitle" to $projectStatus.',
    url: '/project-details/$projectId',
  },
  [IN_APP_NOTIFICATION_TYPE.PAYMENT_RECEIVED]: {
    title: 'Payment received',
    description: 'You received $amount for invoice $invoiceNumber.',
    url: '/payments/$paymentId',
  },
  [IN_APP_NOTIFICATION_TYPE.PROFILE_APPROVED]: {
    title: 'Profile approved',
    description: 'Your $profileSection profile has been approved. You can continue on Halogig.',
    url: '/profile',
  },
  [IN_APP_NOTIFICATION_TYPE.PROJECT_MILESTONE_DUE]: {
    title: 'Milestone due soon',
    description: 'Milestone "$milestoneName" for $projectTitle is due on $dueDate.',
    url: '/projects/$projectId/milestones',
  },
};
