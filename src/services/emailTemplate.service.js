import env from '../config/env';
import logger from '../config/logger';
import getMessage from '../utils/message';
import emailer from './email.service';
import ejsTemplate from './ejs.service';
import { ADMIN_NOTIFICATION_EMAIL } from '../config/paths';

const {
  app: { adminUrl, baseUrl, environment },
  frontendUrl,
} = env;
const logo = `${baseUrl}public/logo.png`;

export default {
  /**
   * Send Admin 2FA OTP email
   */
  async sendAdmin2FAOTP({ email, otp, adminName }) {
    try {
      const data = { logo, otp, adminName, email };
      const result = await ejsTemplate.generateEjsTemplate({ template: 'admin2FAOTP.ejs', data });
      return await emailer.sendEmail({
        to: email,
        subject: 'Admin Login - Two-Factor Authentication Code',
        message: result,
      });
    } catch (error) {
      logger.error(`Admin 2FA OTP email error: ${error}`);
      throw error;
    }
  },

  /**
   * Send staff creation email with temp password
   */
  async createStaff({ email, userName, password, dateTime }) {
    try {
      const data = { logo, email, userName, password, dateTime, url: adminUrl };
      const result = await ejsTemplate.generateEjsTemplate({ template: 'createUserAccount.ejs', data });
      return await emailer.sendEmail({
        to: email,
        subject: getMessage({}, false, 'STAFF_ADD_EMAIL'),
        message: result,
      });
    } catch (error) {
      logger.error(`Create staff email error: ${error}`);
      throw error;
    }
  },

  /**
   * Send forgot password email
   */
  async forgotPassword({ email, userName, token, userRole }) {
    try {
      const data = {
        userName,
        redirectUrlCheck: `${adminUrl}${userRole}/reset-password/${token}`,
        logo,
      };
      if (userRole === 'seller') data.redirectUrlCheck = `${adminUrl}reset-password/${token}`;
      const result = await ejsTemplate.generateEjsTemplate({ template: 'resetPassword.ejs', data });
      return await emailer.sendEmail({
        to: email,
        subject: getMessage({}, false, 'RESET_PASSWORD_EMAIL'),
        message: result,
      });
    } catch (error) {
      logger.error(`Forgot password email error: ${error}`);
      throw error;
    }
  },

  /**
   * Send verification OTP email
   */
  async verificationOTP({ email, otp, userName }) {
    try {
      const data = { logo, otp, userName, email };
      const result = await ejsTemplate.generateEjsTemplate({ template: 'verificationOTP.ejs', data });
      return await emailer.sendEmail({
        to: email,
        subject: 'Verify Your Email',
        message: result,
      });
    } catch (error) {
      logger.error(`Verification OTP email error: ${error}`);
      throw error;
    }
  },

  /**
   * Send new password set URL to client
   */
  async newPasswordSetUrl({ email, token }) {
    try {
      const url = `${environment === 'development' ? frontendUrl.local : frontendUrl.production}/change-password/${token}`;
      const data = { logo, email, token, url };
      const result = await ejsTemplate.generateEjsTemplate({ template: 'newPasswordSetUrl.ejs', data });
      return await emailer.sendEmail({
        to: email,
        subject: getMessage({}, false, 'Password Reset'),
        message: result,
      });
    } catch (error) {
      logger.error(`New password set URL email error: ${error}`);
      throw error;
    }
  },

  /**
   * Send bid received notification to client
   */
  async sendBidReceivedToClient({ email, userName, projectTitle, bidderName, bidAmount, projectBidId }) {
    try {
      const base = String(frontendUrl?.base || '').replace(/\/$/, '');
      const viewProjectUrl = base && projectBidId ? `${base}/project-details/proposal-details/${projectBidId}` : '';
      const data = { logo, userName, projectTitle, bidderName, bidAmount, viewProjectUrl, email };
      const result = await ejsTemplate.generateEjsTemplate({ template: 'bidReceivedClient.ejs', data });
      return await emailer.sendEmail({
        to: email,
        subject: `New bid on ${projectTitle || 'your project'}`,
        message: result,
      });
    } catch (error) {
      logger.error(`Bid received email error: ${error}`);
      throw error;
    }
  },

  /**
   * Send bid updated notification to client
   */
  async sendBidUpdatedToClient({ email, userName, projectTitle, bidderName, bidAmount, projectBidId }) {
    try {
      const base = String(frontendUrl?.base || '').replace(/\/$/, '');
      const viewProjectUrl = base && projectBidId ? `${base}/project-details/proposal-details/${projectBidId}` : '';
      const data = { logo, userName, projectTitle, bidderName, bidAmount, viewProjectUrl, email };
      const result = await ejsTemplate.generateEjsTemplate({ template: 'bidUpdatedClient.ejs', data });
      return await emailer.sendEmail({
        to: email,
        subject: `Bid updated on ${projectTitle || 'your project'}`,
        message: result,
      });
    } catch (error) {
      logger.error(`Bid updated email error: ${error}`);
      throw error;
    }
  },

  /**
   * Send SOW submitted notification to client
   */
  async sendSowSubmittedToClient({ email, userName, projectTitle, actorName, projectBidId }) {
    try {
      const base = String(frontendUrl?.base || '').replace(/\/$/, '');
      const viewProjectUrl = base && projectBidId ? `${base}/project-details/statement-of-work/${projectBidId}` : '';
      const data = { logo, userName, projectTitle, actorName, viewProjectUrl, email };
      const result = await ejsTemplate.generateEjsTemplate({ template: 'sowSubmittedClient.ejs', data });
      return await emailer.sendEmail({
        to: email,
        subject: `SOW submitted - ${projectTitle || 'your project'}`,
        message: result,
      });
    } catch (error) {
      logger.error(`SOW submitted email error: ${error}`);
      throw error;
    }
  },

  /**
   * Send SOW status updated notification to freelancer
   */
  async sendSowStatusUpdatedToFreelancer({ email, userName, projectTitle, actorName, sowStatus, projectBidId }) {
    try {
      const base = String(frontendUrl?.base || '').replace(/\/$/, '');
      const viewProjectUrl = base && projectBidId ? `${base}/project-details/statement-of-work/${projectBidId}` : '';
      const data = { logo, userName, projectTitle, actorName, sowStatus, viewProjectUrl, email };
      const result = await ejsTemplate.generateEjsTemplate({ template: 'sowStatusUpdatedFreelancer.ejs', data });
      return await emailer.sendEmail({
        to: email,
        subject: `SOW ${sowStatus || 'status updated'} - ${projectTitle || 'your project'}`,
        message: result,
      });
    } catch (error) {
      logger.error(`SOW status updated email error: ${error}`);
      throw error;
    }
  },

  /**
   * Send project status updated notification to client
   */
  async sendProjectStatusUpdatedToClient({ email, userName, projectTitle, actorName, projectStatus, projectId }) {
    try {
      const base = String(frontendUrl?.base || '').replace(/\/$/, '');
      const viewProjectUrl = base && projectId ? `${base}/project-details/${projectId}` : '';
      const data = { logo, userName, projectTitle, actorName, projectStatus, viewProjectUrl, email };
      const result = await ejsTemplate.generateEjsTemplate({ template: 'projectStatusUpdatedClient.ejs', data });
      return await emailer.sendEmail({
        to: email,
        subject: `Project status updated - ${projectTitle || `#${projectId}`}`,
        message: result,
      });
    } catch (error) {
      logger.error(`Project status updated email error: ${error}`);
      throw error;
    }
  },

  /**
   * Send chat room invitation email
   */
  async sendChatRoomInvitation({ email, userName, roomName, adminName, roomUrl, roomDescription }) {
    try {
      const data = { userName, roomName, adminName, roomUrl, roomDescription, logo };
      const result = await ejsTemplate.generateEjsTemplate({ template: 'chatRoomInvitation.ejs', data });
      return await emailer.sendEmail({
        to: email,
        subject: `You've been invited to join ${roomName} chat room`,
        message: result,
      });
    } catch (error) {
      logger.error(`Chat room invitation email error: ${error}`);
      throw error;
    }
  },

  /**
   * Send admin-created client project link to client
   */
  async sendAdminCreatedClientProjectLinkToClient({ email, userName, projectTitle, projectLink, projectId }) {
    try {
      const data = { userName: userName || 'there', projectTitle: projectTitle || 'Your project', projectLink, projectId, logo };
      const result = await ejsTemplate.generateEjsTemplate({ template: 'adminCreatedClientProject.ejs', data });
      const safeTitle = (projectTitle && String(projectTitle).slice(0, 80)) || `Project #${projectId || ''}`;
      return await emailer.sendEmail({
        to: email,
        subject: `Your Halogig project is ready - ${safeTitle}`,
        message: result,
      });
    } catch (error) {
      logger.error(`Admin-created client project email error: ${error}`);
      throw error;
    }
  },

  /**
   * Send new client project published notification to admin
   */
  async sendNewClientProjectPublishedNotification({ adminEmail, projectId, projectTitle, projectDescription, clientName, clientEmail, publishedAt }) {
    try {
      const data = { projectId, projectTitle, projectDescription, clientName, clientEmail, publishedAt, logo };
      const result = await ejsTemplate.generateEjsTemplate({ template: 'newClientProjectPublished.ejs', data });
      return await emailer.sendEmail({
        to: adminEmail || ADMIN_NOTIFICATION_EMAIL,
        subject: `New Client Project Published - ${projectTitle || `#${projectId}`}`,
        message: result,
      });
    } catch (error) {
      logger.error(`New client project published email error: ${error}`);
      throw error;
    }
  },

  /**
   * Send new user created notification to admin
   */
  async sendNewUserCreatedNotification({ adminEmail, userId, userName, userEmail, userMobile, userSource, createdAt }) {
    try {
      const data = { userId, userName, userEmail, userMobile, userSource, createdAt, logo };
      const result = await ejsTemplate.generateEjsTemplate({ template: 'newUserCreatedNotification.ejs', data });
      return await emailer.sendEmail({
        to: adminEmail || ADMIN_NOTIFICATION_EMAIL,
        subject: `New User Registered - ${userName || userEmail || `#${userId}`}`,
        message: result,
      });
    } catch (error) {
      logger.error(`New user created email error: ${error}`);
      throw error;
    }
  },

  /**
   * Send custom email to freelancer from admin
   */
  async sendFreelancerCustomEmail({ email, subject, message, userName }) {
    try {
      const data = { subject, message, userName, logo };
      const result = await ejsTemplate.generateEjsTemplate({ template: 'adminFreelancerCustomEmail.ejs', data });
      return await emailer.sendEmail({
        to: email,
        subject: subject || 'Message from Halogig Admin',
        message: result,
      });
    } catch (error) {
      logger.error(`Freelancer custom email error: ${error}`);
      throw error;
    }
  },
};
