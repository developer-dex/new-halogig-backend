import { Op } from 'sequelize';
import { ContactUs } from '../../models';
import emailService from '../../services/email.service';
import ejsService from '../../services/ejs.service';
import env from '../../config/env';
import logger from '../../config/logger';
import { ADMIN_NOTIFICATION_EMAIL } from '../../config/paths';

/**
 * Check if a contact with the same email or mobile already exists.
 * @param {string} email
 * @param {string} mobile
 * @returns {Promise<Object|null>}
 */
const checkExistingContact = async (email, mobile) => {
  const orConditions = [];
  if (email != null && String(email).trim() !== '') {
    orConditions.push({ email });
  }
  if (mobile != null && String(mobile).trim() !== '') {
    orConditions.push({ mobile });
  }
  if (orConditions.length === 0) return null;

  return ContactUs.findOne({
    where: { [Op.or]: orConditions },
  });
};

/**
 * Create a new contact entry.
 * If a contact with the same email/mobile exists, marks is_client_added = true.
 *
 * @param {Object} data - Contact fields
 * @returns {Promise<Object>} Created contact record
 */
const createContact = async (data) => {
  const existing = await checkExistingContact(data.email, data.mobile);
  const contactData = {
    ...data,
    is_client_added: existing ? true : data.is_client_added,
  };
  return ContactUs.create(contactData);
};

/**
 * Send contact notification email to admin (fire-and-forget).
 * @param {Object} contactData
 */
const sendContactNotificationEmail = async (contactData) => {
  try {
    const {
      firstName, lastName, email, mobile, companyName, requirements,
    } = contactData;

    const fullName = `${firstName} ${lastName}`;
    const logoUrl = `${env.app.baseUrl}emailImages/logo.png`;

    const emailHtml = await ejsService.generateEjsTemplate({
      template: 'contactUsNotification.ejs',
      data: {
        logo: logoUrl,
        fullName,
        email: email || 'Not provided',
        mobile,
        companyName,
        requirements,
      },
    });

    await emailService.sendEmail({
      to: ADMIN_NOTIFICATION_EMAIL,
      subject: `New Contact Request from ${fullName}`,
      message: emailHtml,
    });

    logger.info(`Contact notification email sent for ${fullName}`);
  } catch (error) {
    logger.error(`Failed to send contact notification email: ${error.message}`);
  }
};

export default {
  createContact,
  sendContactNotificationEmail,
};
