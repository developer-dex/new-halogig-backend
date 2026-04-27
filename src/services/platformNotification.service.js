import { ClientProject, User, ProjectBid, Admin, Sow } from '../models';
import { createInAppNotification, interpolateTemplate } from './inAppNotification.service';
import { createAdminNotification } from './adminNotification.service';
import emailTemplateService from './emailTemplate.service';
import logger from '../config/logger';
import { IN_APP_NOTIFICATION_TYPE, IN_APP_NOTIFICATION_TYPES } from '../constants/inAppNotificationTypes';

function buildTitleAndDescription(type, params) {
  const definition = IN_APP_NOTIFICATION_TYPES[type];
  if (!definition) return { title: '', description: '' };
  return {
    title: interpolateTemplate(definition.title, params),
    description: interpolateTemplate(definition.description, params),
  };
}

async function notifyAllActiveAdmins({ type, senderUserId, params, url }) {
  try {
    const admins = await Admin.findAll({
      where: { status: 'active' },
      attributes: ['id', 'email', 'first_name', 'last_name'],
    });
    if (!admins?.length) return;

    const { title, description } = buildTitleAndDescription(type, params);
    const base = String(process.env.FRONTEND_BASE_URL || '').replace(/\/$/, '');
    const actionUrl = base && url ? `${base}${url}` : '';

    try {
      await createAdminNotification({
        notification_type: type,
        sender_user_id: senderUserId ?? null,
        title: title || 'Halogig update',
        description: description || '',
        url: url || null,
      });
    } catch (dbError) {
      logger.error(`notifyAllActiveAdmins db error: ${dbError?.message || dbError}`);
    }

    await Promise.all(admins.map(async (admin) => {
      const adminName = [admin?.first_name, admin?.last_name].filter(Boolean).join(' ').trim() || 'Admin';
      try {
        if (admin?.email) {
          await emailTemplateService.sendAdminPlatformNotification({
            email: admin.email, adminName,
            title: title || 'Halogig update',
            description: description || '',
            actionUrl,
          });
        }
      } catch (emailError) {
        logger.error(`notifyAllActiveAdmins email error: ${emailError?.message || emailError}`);
      }
    }));
  } catch (error) {
    logger.error(`notifyAllActiveAdmins error: ${error?.message || error}`);
  }
}

export default {
  /**
   * Notify client when a freelancer submits a new bid.
   */
  async notifyClientNewProjectBid({ projectBid, freelancerUser, body = {} }) {
    const projectId = projectBid?.project_id ?? projectBid?.dataValues?.project_id ?? body.project_id;
    if (!projectId) return;

    const clientProject = await ClientProject.findOne({ where: { id: projectId } });
    if (!clientProject) return;

    const clientReceiverId = Number(clientProject.posted_by_user_id || body.client_id);
    if (!Number.isInteger(clientReceiverId) || clientReceiverId <= 0) return;

    const bidderName = [freelancerUser?.first_name, freelancerUser?.last_name].filter(Boolean).join(' ').trim()
      || freelancerUser?.username || freelancerUser?.email || 'A freelancer';
    const bidAmount = projectBid?.bid_amount ?? projectBid?.dataValues?.bid_amount ?? body?.bid_amount ?? 'a custom amount';
    const projectTitle = clientProject.project_title || 'your project';
    const deepLinkPath = `/project-details/proposal-details/${projectBid?.id}`;

    try {
      await createInAppNotification(IN_APP_NOTIFICATION_TYPE.BID_RECEIVED, freelancerUser.id, clientReceiverId, {
        params: { projectTitle, bidderName, bidAmount, projectId: clientProject.id },
        url: deepLinkPath,
      });
    } catch (e) { logger.error(`notifyClientNewProjectBid in-app error: ${e?.message}`); }

    try {
      const clientUser = await User.findByPk(clientReceiverId, { attributes: ['email', 'first_name', 'last_name'] });
      if (clientUser?.email) {
        const clientDisplayName = [clientUser.first_name, clientUser.last_name].filter(Boolean).join(' ').trim() || 'there';
        await emailTemplateService.sendBidReceivedToClient({
          email: clientUser.email, userName: clientDisplayName,
          projectTitle, bidderName, bidAmount: String(bidAmount), projectBidId: projectBid.id,
        });
      }
    } catch (e) { logger.error(`notifyClientNewProjectBid email error: ${e?.message}`); }

    await notifyAllActiveAdmins({
      type: IN_APP_NOTIFICATION_TYPE.BID_RECEIVED,
      senderUserId: freelancerUser?.id ?? null,
      params: { projectTitle, bidderName, bidAmount, projectId: clientProject.id },
      url: deepLinkPath,
    });
  },

  /**
   * Notify client when a freelancer updates their bid.
   */
  async notifyClientProjectBidUpdated({ bidId, freelancerUser, body = {}, updateResult }) {
    const affected = Array.isArray(updateResult) ? Number(updateResult[0]) : 0;
    if (!affected) return;

    const numericBidId = Number(bidId);
    if (!Number.isInteger(numericBidId) || numericBidId <= 0) return;

    const bid = await ProjectBid.findByPk(numericBidId);
    if (!bid || Number(bid.from_user_id) !== Number(freelancerUser?.id)) return;

    const projectId = bid.project_id ?? bid.dataValues?.project_id;
    if (!projectId) return;

    const clientProject = await ClientProject.findOne({ where: { id: projectId } });
    if (!clientProject) return;

    const clientReceiverId = Number(clientProject.posted_by_user_id || bid.client_id);
    if (!Number.isInteger(clientReceiverId) || clientReceiverId <= 0) return;

    const bidderName = [freelancerUser?.first_name, freelancerUser?.last_name].filter(Boolean).join(' ').trim()
      || freelancerUser?.username || freelancerUser?.email || 'A freelancer';
    const bidAmount = bid.bid_amount ?? bid.dataValues?.bid_amount ?? body?.bid_amount ?? '—';
    const projectTitle = clientProject.project_title || 'your project';
    const deepLinkPath = `/project-details/proposal-details/${bid.id}`;

    try {
      await createInAppNotification(IN_APP_NOTIFICATION_TYPE.BID_UPDATED, freelancerUser.id, clientReceiverId, {
        params: { projectTitle, bidderName, bidAmount, projectId: clientProject.id },
        url: deepLinkPath,
      });
    } catch (e) { logger.error(`notifyClientProjectBidUpdated in-app error: ${e?.message}`); }

    try {
      const clientUser = await User.findByPk(clientReceiverId, { attributes: ['email', 'first_name', 'last_name'] });
      if (clientUser?.email) {
        const clientDisplayName = [clientUser.first_name, clientUser.last_name].filter(Boolean).join(' ').trim() || 'there';
        await emailTemplateService.sendBidUpdatedToClient({
          email: clientUser.email, userName: clientDisplayName,
          projectTitle, bidderName, bidAmount: String(bidAmount), projectBidId: bid.id,
          actorName: bidderName, actorLabel: 'freelancer',
        });
      }
    } catch (e) { logger.error(`notifyClientProjectBidUpdated email error: ${e?.message}`); }

    await notifyAllActiveAdmins({
      type: IN_APP_NOTIFICATION_TYPE.BID_UPDATED,
      senderUserId: freelancerUser?.id ?? null,
      params: { projectTitle, bidderName, bidAmount, projectId: clientProject.id },
      url: deepLinkPath,
    });
  },

  /**
   * Notify client when a freelancer submits a SOW.
   */
  async notifyClientSowSubmitted({ sow, freelancerUser, body = {} }) {
    const projectBidId = Number(body.project_leads_id || sow?.project_leads_id);
    if (!Number.isInteger(projectBidId) || projectBidId <= 0) return;

    const bid = await ProjectBid.findByPk(projectBidId);
    if (!bid || Number(bid.from_user_id) !== Number(freelancerUser?.id)) return;

    const projectId = bid.project_id ?? bid.dataValues?.project_id;
    if (!projectId) return;

    const clientProject = await ClientProject.findOne({ where: { id: projectId } });
    if (!clientProject) return;

    const clientReceiverId = Number(clientProject.posted_by_user_id || bid.client_id);
    if (!Number.isInteger(clientReceiverId) || clientReceiverId <= 0) return;

    const actorName = [freelancerUser?.first_name, freelancerUser?.last_name].filter(Boolean).join(' ').trim()
      || freelancerUser?.username || freelancerUser?.email || 'A freelancer';
    const projectTitle = clientProject.project_title || 'your project';
    const deepLinkPath = `/project-details/statement-of-work/${projectBidId}`;

    try {
      await createInAppNotification(IN_APP_NOTIFICATION_TYPE.SOW_SUBMITTED, freelancerUser.id, clientReceiverId, {
        params: { projectTitle, actorName, projectBidId },
        url: deepLinkPath,
      });
    } catch (e) { logger.error(`notifyClientSowSubmitted in-app error: ${e?.message}`); }

    try {
      const clientUser = await User.findByPk(clientReceiverId, { attributes: ['email', 'first_name', 'last_name'] });
      if (clientUser?.email) {
        const clientDisplayName = [clientUser.first_name, clientUser.last_name].filter(Boolean).join(' ').trim() || 'there';
        await emailTemplateService.sendSowSubmittedToClient({
          email: clientUser.email, userName: clientDisplayName,
          projectTitle, actorName, projectBidId,
        });
      }
    } catch (e) { logger.error(`notifyClientSowSubmitted email error: ${e?.message}`); }

    await notifyAllActiveAdmins({
      type: IN_APP_NOTIFICATION_TYPE.SOW_SUBMITTED,
      senderUserId: freelancerUser?.id ?? null,
      params: { projectTitle, actorName, projectBidId },
      url: deepLinkPath,
    });
  },

  /**
   * Notify freelancer when a client updates SOW status.
   */
  async notifyFreelancerSowStatusChanged({ sowId, clientUser, body = {}, updateResult }) {
    const affected = Array.isArray(updateResult) ? Number(updateResult[0]) : 0;
    if (!affected) return;

    const status = String(body.status || '').trim().toLowerCase();
    if (!new Set(['modify', 'rejected', 'reconsider', 'accepted']).has(status)) return;

    const numericSowId = Number(sowId);
    if (!Number.isInteger(numericSowId) || numericSowId <= 0) return;

    // Dynamically access Sow model via sequelize
    const sow = await Sow.findByPk(numericSowId);
    if (!sow) return;

    const projectBidId = Number(sow.project_leads_id);
    if (!Number.isInteger(projectBidId) || projectBidId <= 0) return;

    const bid = await ProjectBid.findByPk(projectBidId);
    if (!bid) return;

    const projectId = bid.project_id ?? bid.dataValues?.project_id;
    if (!projectId) return;

    const clientProject = await ClientProject.findOne({ where: { id: projectId } });
    if (!clientProject || Number(clientProject.posted_by_user_id) !== Number(clientUser?.id)) return;

    const freelancerReceiverId = Number(bid.from_user_id);
    if (!Number.isInteger(freelancerReceiverId) || freelancerReceiverId <= 0) return;

    const freelancer = await User.findByPk(freelancerReceiverId, { attributes: ['email', 'first_name', 'last_name'] });
    const freelancerDisplayName = [freelancer?.first_name, freelancer?.last_name].filter(Boolean).join(' ').trim() || 'there';
    const actorName = [clientUser?.first_name, clientUser?.last_name].filter(Boolean).join(' ').trim()
      || clientUser?.company_name || clientUser?.email || 'A client';
    const projectTitle = clientProject.project_title || 'your project';
    const deepLinkPath = `/project-details/statement-of-work/${projectBidId}`;

    try {
      await createInAppNotification(IN_APP_NOTIFICATION_TYPE.SOW_STATUS_UPDATED, clientUser.id, freelancerReceiverId, {
        params: { projectTitle, actorName, sowStatus: status, projectBidId },
        url: deepLinkPath,
      });
    } catch (e) { logger.error(`notifyFreelancerSowStatusChanged in-app error: ${e?.message}`); }

    try {
      if (freelancer?.email) {
        await emailTemplateService.sendSowStatusUpdatedToFreelancer({
          email: freelancer.email, userName: freelancerDisplayName,
          projectTitle, actorName, sowStatus: status, projectBidId,
        });
      }
    } catch (e) { logger.error(`notifyFreelancerSowStatusChanged email error: ${e?.message}`); }

    await notifyAllActiveAdmins({
      type: IN_APP_NOTIFICATION_TYPE.SOW_STATUS_UPDATED,
      senderUserId: clientUser?.id ?? null,
      params: { projectTitle, actorName, sowStatus: status, projectBidId },
      url: deepLinkPath,
    });
  },

  /**
   * Notify client when admin updates project status.
   */
  async notifyClientProjectStatusChangedByAdmin({ project, adminUser, status }) {
    const projectId = Number(project?.id);
    if (!Number.isInteger(projectId) || projectId <= 0) return;

    const clientReceiverId = Number(project?.posted_by_user_id);
    if (!Number.isInteger(clientReceiverId) || clientReceiverId <= 0) return;

    const statusNumber = Number(status ?? project?.status);
    let statusLabel = 'updated';
    if (statusNumber === 1) statusLabel = 'pending';
    if (statusNumber === 2) statusLabel = 'approved';
    if (statusNumber === 3) statusLabel = 'rejected';

    const actorName = adminUser?.name || adminUser?.email || 'Halogig Admin';
    const projectTitle = project?.project_title || 'your project';
    const deepLinkPath = `/project-details/${projectId}`;

    try {
      await createInAppNotification(IN_APP_NOTIFICATION_TYPE.PROJECT_STATUS_UPDATED, null, clientReceiverId, {
        params: { actorName, projectTitle, projectStatus: statusLabel, projectId },
        url: deepLinkPath,
      });
    } catch (e) { logger.error(`notifyClientProjectStatusChangedByAdmin in-app error: ${e?.message}`); }

    try {
      const clientUserRow = await User.findByPk(clientReceiverId, { attributes: ['email', 'first_name', 'last_name'] });
      if (clientUserRow?.email) {
        const clientDisplayName = [clientUserRow.first_name, clientUserRow.last_name].filter(Boolean).join(' ').trim() || 'there';
        await emailTemplateService.sendProjectStatusUpdatedToClient({
          email: clientUserRow.email, userName: clientDisplayName,
          projectTitle, actorName, projectStatus: statusLabel, projectId,
        });
      }
    } catch (e) { logger.error(`notifyClientProjectStatusChangedByAdmin email error: ${e?.message}`); }

    await notifyAllActiveAdmins({
      type: IN_APP_NOTIFICATION_TYPE.PROJECT_STATUS_UPDATED,
      senderUserId: null,
      params: { actorName, projectTitle, projectStatus: statusLabel, projectId },
      url: deepLinkPath,
    });
  },
};
