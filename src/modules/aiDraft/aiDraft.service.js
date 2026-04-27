import env from '../../config/env';

const AI_API_BASE_URL = env.aiApi.baseUrl;

/**
 * Proxy GET request to AI API.
 */
const proxyAiApiGet = async (path) => {
  const fetch = (await import('node-fetch')).default;
  const response = await fetch(`${AI_API_BASE_URL}${path}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  return data;
};

/**
 * Proxy POST request to AI API.
 */
const proxyAiApiPost = async (path, body) => {
  const fetch = (await import('node-fetch')).default;
  const response = await fetch(`${AI_API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
};

/**
 * Get draft campaign names from AI API.
 */
const getDraftCampaignNames = async () => {
  return proxyAiApiGet('/draft/campaign-names');
};

/**
 * Start followup via AI API.
 */
const startFollowup = async (body) => {
  if (!body || !body.campaign_name) throw new Error('campaign_name is required');
  return proxyAiApiPost('/followup/start', body);
};

export default {
  proxyAiApiGet,
  proxyAiApiPost,
  getDraftCampaignNames,
  startFollowup,
};
