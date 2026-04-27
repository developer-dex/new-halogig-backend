import { Token } from '../../models';
import env from '../../config/env';

const CATEGORY = 'google_meet';

/**
 * Build Google OAuth authorization URL with calendar scope.
 */
const getAuthorizationUrl = () => {
  const { meetClientId, meetRedirectUri } = env.google;
  const scopes = encodeURIComponent('https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events');
  const state = Math.random().toString(36).substring(2);
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${meetClientId}&redirect_uri=${encodeURIComponent(meetRedirectUri)}&response_type=code&scope=${scopes}&access_type=offline&prompt=consent&state=${state}`;
  return { url, state };
};

/**
 * Handle OAuth callback — returns HTML page with the authorization code.
 */
const handleCallback = (code, state) => {
  const html = `<!DOCTYPE html><html><head><title>Google Meet Auth</title></head><body>
    <h2>Google Meet Authorization Successful</h2>
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
  const { meetClientId, meetClientSecret, meetRedirectUri } = env.google;
  const fetch = (await import('node-fetch')).default;
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: meetRedirectUri,
      client_id: meetClientId,
      client_secret: meetClientSecret,
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
      refresh_token: data.refresh_token || null,
      expires_in: data.expires_in,
      token_type: data.token_type,
      created_at: new Date().toISOString(),
    },
  });
  return token;
};

/**
 * Get stored Google Meet token details.
 */
const getTokenDetails = async () => {
  const token = await Token.findOne({ where: { category: CATEGORY } });
  return token;
};

/**
 * Clear stored Google Meet tokens.
 */
const clearTokens = async () => {
  await Token.destroy({ where: { category: CATEGORY } });
  return true;
};

export default {
  getAuthorizationUrl,
  handleCallback,
  generateAndSaveTokens,
  getTokenDetails,
  clearTokens,
};
