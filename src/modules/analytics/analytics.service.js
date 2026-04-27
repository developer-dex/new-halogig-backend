import { UserActivity, UserFunction } from '../../models';
import env from '../../config/env';

/**
 * Track page-wise engagement — creates or updates UserActivity.
 * Handles both new-style fields and legacy fields sent by the frontend.
 */
const pageWiseEngagement = async (data) => {
  const {
    // new-style
    ip_address, page_url, device_type, time_spent, session_id,
    // legacy
    user_ip_address, previous_page_url, user_location, start_time, end_time,
    time_spent_on_page, page_load_time, telecom_provider, browser, user_type,
  } = data;

  const resolvedIp = ip_address || user_ip_address || '127.0.0.1';
  const resolvedUrl = page_url || previous_page_url || null;
  const resolvedTimeSpent = time_spent ?? time_spent_on_page ?? 0;
  const resolvedPageLoadTime = page_load_time ?? (Math.random() * 0.30);

  if (session_id) {
    const existing = await UserActivity.findOne({ where: { session_id } });
    if (existing) {
      await existing.update({ time_spent: (existing.time_spent || 0) + resolvedTimeSpent });
      return existing;
    }
  }

  const activity = await UserActivity.create({
    ip_address: resolvedIp,
    url: resolvedUrl,
    page_url: resolvedUrl,
    device_type: device_type || null,
    time_spent: resolvedTimeSpent,
    session_id: session_id || null,
    start_time: start_time || null,
    end_time: end_time || null,
    page_load_time: resolvedPageLoadTime,
    location: user_location || null,
    telecom_provider: telecom_provider || 'Unknown',
    browser: browser || 'Chrome',
    user_type: user_type || 'guest',
  });
  return activity;
};

/**
 * Verify Cloudflare Turnstile token.
 */
const verifyTurnstileToken = async (token, ip) => {
  const fetch = (await import('node-fetch')).default;
  const response = await fetch(env.turnstile.verifyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: env.turnstile.secretKey,
      response: token,
      remoteip: ip || '',
    }),
  });
  const result = await response.json();
  return result;
};

/**
 * Create a UserFunction record.
 */
const createUserFunction = async (data) => {
  const record = await UserFunction.create(data);
  return record;
};

export default {
  pageWiseEngagement,
  verifyTurnstileToken,
  createUserFunction,
};
