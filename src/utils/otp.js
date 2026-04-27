import env from '../config/env';

/**
 * Generate a random integer of specified length.
 * @param {number} length - Number of digits
 * @returns {number}
 */
export const generateRandomInteger = (length = 8) => {
  const addData = Math.random() * 9 * 10 ** (length - 1);
  return Math.floor(10 ** (length - 1) + addData);
};

/**
 * Generate a 4-digit OTP.
 * Returns 4444 in development for easy testing.
 * @returns {number}
 */
export const generateOtp = () => (
  env.app.environment === 'development' ? 4444 : generateRandomInteger(4)
);

/**
 * Generate a random alphanumeric string.
 * @param {number} length
 * @returns {string}
 */
export const generateRandomString = (length) => {
  const chars = 'klmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghij';
  let output = '';
  for (let x = 0; x < length; x++) {
    const i = Math.floor(Math.random() * chars.length);
    output += chars.charAt(i);
  }
  return output;
};

/**
 * Generate a random password (8 chars).
 * @returns {string}
 */
export const generateRandomPassword = () => generateRandomString(8);
