import bcrypt from 'bcryptjs';

/**
 * Generate a bcrypt hash from a plain string.
 * @param {string} plainText
 * @returns {Promise<string>} Hashed string
 */
export const generateHash = async (plainText) => {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(plainText, salt);
};

/**
 * Compare a plain string against a bcrypt hash.
 * @param {string} plainText
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export const compareHash = async (plainText, hash) => bcrypt.compare(plainText, hash);
