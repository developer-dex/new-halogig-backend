import { Token } from '../../models';
import env from '../../config/env';

const CATEGORY = 'linkedin';

/**
 * Build LinkedIn OAuth authorization URL.
 */
const getAuthorizationUrl = () => {
  const { clientId, redirectUri } = env.linkedin;
  const scopes = encodeURIComponent('openid profile email w_member_social');
  const state = Math.random().toString(36).substring(2);
  const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&state=${state}`;
  return { url, state };
};

/**
 * Handle OAuth callback — returns HTML page with the authorization code.
 */
const handleCallback = (code, state) => {
  const html = `<!DOCTYPE html><html><head><title>LinkedIn Auth</title></head><body>
    <h2>LinkedIn Authorization Successful</h2>
    <p>Authorization code: <strong>${code}</strong></p>
    <p>State: ${state}</p>
    <p>You can close this window.</p>
    <script>if(window.opener){window.opener.postMessage({code:'${code}',state:'${state}'},'*');}</script>
  </body></html>`;
  return html;
};

/**
 * Exchange authorization code for tokens and save to Token model.
 */
const generateAndSaveTokens = async (code) => {
  const { clientId, clientSecret, redirectUri } = env.linkedin;
  const fetch = (await import('node-fetch')).default;
  const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error_description || data.error);

  const [token] = await Token.findOrCreate({
    where: { category: CATEGORY },
    defaults: { category: CATEGORY, token_data: {} },
  });
  await token.update({
    token_data: {
      access_token: data.access_token,
      expires_in: data.expires_in,
      refresh_token: data.refresh_token || null,
      created_at: new Date().toISOString(),
    },
  });
  return token;
};

/**
 * Get stored LinkedIn token details.
 */
const getTokenDetails = async () => {
  const token = await Token.findOne({ where: { category: CATEGORY } });
  return token;
};

/**
 * Clear stored LinkedIn tokens.
 */
const clearTokens = async () => {
  await Token.destroy({ where: { category: CATEGORY } });
  return true;
};

/**
 * Toggle LinkedIn posting status.
 */
const togglePostingStatus = async () => {
  const token = await Token.findOne({ where: { category: CATEGORY } });
  if (!token) return null;
  const tokenData = token.token_data || {};
  tokenData.posting_enabled = !tokenData.posting_enabled;
  await token.update({ token_data: tokenData });
  return token;
};

export default {
  getAuthorizationUrl,
  handleCallback,
  generateAndSaveTokens,
  getTokenDetails,
  clearTokens,
  togglePostingStatus,
};
