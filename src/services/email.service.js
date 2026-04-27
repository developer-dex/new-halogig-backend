import nodemailer from 'nodemailer';
import env from '../config/env';
import logger from '../config/logger';

const { fromEmail, smtp } = env.mail;
const transport = nodemailer.createTransport(smtp);

/**
 * Send an email via SMTP.
 *
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.message - HTML body
 * @param {Array}  [options.attachments] - File attachments
 * @param {string} [options.bcc] - BCC recipients
 * @param {string} [options.cc] - CC recipients
 * @param {string} [type='send'] - 'send' for outgoing, 'receive' for admin copy
 * @returns {Promise<Object>} Nodemailer info object
 */
const sendEmail = async (options, type = 'send') => {
  const mailOptions = {
    from: `Halogig <${fromEmail}>`,
    to: type === 'send' ? options.to : fromEmail,
    subject: options.subject,
    html: options.message,
  };

  if (options.attachments) mailOptions.attachments = options.attachments;
  if (options.bcc) mailOptions.bcc = options.bcc;
  if (options.cc) mailOptions.cc = options.cc;

  return new Promise((resolve, reject) => {
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error(`Email send error: ${error}`);
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

/**
 * Verify SMTP connection then send email.
 */
const verifyEmailServer = async (options) => {
  const result = await transport.verify();
  if (result) return sendEmail(options);
  return false;
};

export default { sendEmail, verifyEmailServer };
