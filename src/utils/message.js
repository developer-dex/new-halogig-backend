import language from '../language';

/**
 * Get localized message string by key.
 * Falls back to the key itself if not found in the language file.
 *
 * @param {Object} req - Express request (reads req.headers.language)
 * @param {*} data - If truthy, calls the message as a function with data
 * @param {string} key - Message key from language file
 * @returns {string} Resolved message
 */
const getMessage = (req, data, key) => {
  let languageCode = req.headers && req.headers.language;
  languageCode = languageCode || 'en';

  const messageExists = language[languageCode] && language.en[`${key}`];

  if (data) {
    return messageExists ? language[languageCode][`${key}`](data) : key;
  }

  return messageExists ? language[languageCode][`${key}`] : key;
};

export default getMessage;
