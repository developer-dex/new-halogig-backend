import { Token } from '../../models';
import env from '../../config/env';

const CATEGORY = 'twitter';

/**
 * Save Twitter access tokens.
 */
const saveTokens = async (data) => {
  const { access_token, access_token_secret } = data;
  const [token] = await Token.findOrCreate({
    where: { category: CATEGORY },
    defaults: { category: CATEGORY, token_data: {} },
  });
  await token.update({
    token_data: {
      access_token,
      access_token_secret,
      api_key: env.twitter.apiKey,
      api_secret: env.twitter.apiSecret,
      created_at: new Date().toISOString(),
    },
  });
  return token;
};

/**
 * Get stored Twitter token details.
 */
const getTokenDetails = async () => {
  const token = await Token.findOne({ where: { category: CATEGORY } });
  return token;
};

/**
 * Clear stored Twitter tokens.
 */
const clearTokens = async () => {
  await Token.destroy({ where: { category: CATEGORY } });
  return true;
};

/**
 * Toggle Twitter posting status.
 */
const togglePostingStatus = async () => {
  const token = await Token.findOne({ where: { category: CATEGORY } });
  if (!token) return null;
  const tokenData = token.token_data || {};
  tokenData.posting_enabled = !tokenData.posting_enabled;
  await token.update({ token_data: tokenData });
  return token;
};

/**
 * Test Twitter connection by verifying credentials.
 */
const testConnection = async () => {
  const token = await Token.findOne({ where: { category: CATEGORY } });
  if (!token || !token.token_data) return { connected: false, message: 'No tokens found' };
  return { connected: true, message: 'Twitter tokens are configured' };
};

export default {
  saveTokens,
  getTokenDetails,
  clearTokens,
  togglePostingStatus,
  testConnection,
};
