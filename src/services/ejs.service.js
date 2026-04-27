import ejs from 'ejs';
import path from 'path';

/**
 * Render an EJS email template.
 *
 * @param {Object} params
 * @param {string} params.template - EJS filename (e.g. 'contactUsNotification.ejs')
 * @param {Object} params.data - Data to pass into the template
 * @returns {Promise<string>} Rendered HTML string
 */
const generateEjsTemplate = ({ template, data }) => new Promise((resolve, reject) => {
  const ejsFilePath = path.join(__dirname, '..', 'ejs', template);
  ejs.renderFile(ejsFilePath, { data }, (err, result) => {
    if (err) reject(err);
    else resolve(result);
  });
});

export default { generateEjsTemplate };
