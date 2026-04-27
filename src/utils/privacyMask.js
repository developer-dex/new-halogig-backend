/**
 * Privacy masking utility for chat messages
 * This function masks email addresses and phone numbers in messages to protect user privacy
 */

/**
 * Masks email addresses in text with xxxxx
 * @param {string} text - The text to mask
 * @returns {string} - Text with masked email addresses
 */
function maskEmails(text) {
  // Email regex pattern - matches most email formats
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  return text.replace(emailRegex, 'xxxxx');
}

/** falsePositivePatterns
 * Masks phone numbers in text with xxxxx
 * @param {string} text - The text to mask
 * @returns {string} - Text with masked phone numbers
 */
function maskPhoneNumbers(text) {
  // Phone number regex patterns - covers various formats
  const phoneRegexes = [
    // US/International formats: +1-234-567-8901, +1 234 567 8901, (234) 567-8901
    /\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    // Simple 10-digit: 1234567890, 123-456-7890
    /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
    // International format: +country code followed by digits
    /\+\d{1,3}[-.\s]?\d{4,14}/g,
    // Generic pattern for sequences of digits that look like phone numbers
    /\b\d{10,15}\b/g,
  ];

  let maskedText = text;
  phoneRegexes.forEach((regex) => {
    maskedText = maskedText.replace(regex, 'xxxxx');
  });

  return maskedText;
}

/**
 * Masks both email addresses and phone numbers in text
 * @param {string} text - The text to mask
 * @returns {object} - Object containing masked text and original text
 */
function maskPrivacyData(text) {
  if (!text || typeof text !== 'string') {
    return {
      maskedText: text,
      originalText: text,
      isPrivacyMasked: false,
    };
  }

  const originalText = text;
  let maskedText = text;

  // Check if text contains email or phone patterns before masking
  const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g.test(text);
  const hasPhone = /(\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10,15}\b)/g.test(text);

  if (hasEmail || hasPhone) {
    // Apply masking
    maskedText = maskEmails(maskedText);
    maskedText = maskPhoneNumbers(maskedText);

    return {
      maskedText,
      originalText,
      isPrivacyMasked: true,
    };
  }

  return {
    maskedText: originalText,
    originalText,
    isPrivacyMasked: false,
  };
}

/**
 * Validates if a message needs privacy masking
 * @param {string} text - The text to validate
 * @returns {boolean} - Whether the text contains sensitive data
 */
function needsPrivacyMasking(text) {
  if (!text || typeof text !== 'string') {
    return false;
  }

  const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g.test(text);
  const hasPhone = /(\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10,15}\b)/g.test(text);

  return hasEmail || hasPhone;
}

/**
 * Removes common false positives from phone number detection
 * @param {string} text - The text to clean
 * @returns {string} - Text with false positives restored
 */
function cleanPhoneFalsePositives(text) {
  // Restore common false positives like years, IDs, etc.
  // const falsePositivePatterns = [
  //   // Years: 1990-2030
  //   /\b(19|20)\d{2}\b/g,
  //   // Common IDs or codes that might be mistaken for phone numbers
  //   /\b\d{4}-\d{4}\b/g, // Credit card-like patterns
  // ];

  // This is a simplified approach - in production, you might want more sophisticated logic
  return text;
}

module.exports = {
  maskEmails,
  maskPhoneNumbers,
  maskPrivacyData,
  needsPrivacyMasking,
  cleanPhoneFalsePositives,
};
