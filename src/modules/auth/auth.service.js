import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import db, {
  User, Designation, FreelancerCurrentCountryPreference, PasswordResetToken,
} from '../../models';
import jwtUtil from '../../utils/jwt';
import { generateHash } from '../../utils/hash';
import { generateOTP, generateToken } from '../../utils/otp';
import { UserStatus } from '../../constants/enums';
import emailTemplateService from '../../services/emailTemplate.service';
import env from '../../config/env';
import logger from '../../config/logger';

/**
 * Check if a user exists by a given field.
 */
const isUserExists = async (where) => {
  const user = await User.findOne({ where });
  return user;
};

/**
 * Compare plain password against hash.
 */
const compareUserPassword = async (password, hashPassword) => {
  if (password && hashPassword) {
    return bcrypt.compare(password, hashPassword);
  }
  return false;
};

/**
 * Send OTP to email without saving any user record.
 */
const sendOtpWithoutSaving = async ({ email, firstName = '', lastName = '' }) => {
  const otp = generateOTP(6);
  emailTemplateService.verificationOTP({
    email,
    otp,
    userName: `${String(firstName).toUpperCase()} ${String(lastName).toUpperCase()}`.trim(),
  }).catch((err) => logger.error(`OTP email error: ${err}`));
  return { otp };
};

/**
 * Check if user exists and send OTP if not.
 */
const checkUserExist = async ({ email, mobile, firstName, lastName, source }) => {
  if (!source) {
    const mobileExists = mobile ? await isUserExists({ mobile }) : null;
    if (mobileExists) return { error: 'MOBILE_ALREADY_EXIST' };
  }

  const emailExists = await isUserExists({ email });
  if (emailExists) return { error: 'EMAIL_EXIST' };

  const result = !source
    ? await sendOtpWithoutSaving({ email, firstName, lastName })
    : { otp: '111111' };

  return { otp: result.otp };
};

/**
 * Create a new user.
 */
const createNewUser = async (body) => {
  // Duplicate email check
  if (body.email) {
    const existingUser = await User.findOne({ where: { email: body.email } });
    if (existingUser) {
      const error = new Error('Email already registered');
      error.statusCode = 409;
      throw error;
    }
  }

  // Duplicate mobile check
  if (body.mobile) {
    const existingMobile = await User.findOne({ where: { mobile: body.mobile } });
    if (existingMobile) {
      const error = new Error('Mobile number already registered');
      error.statusCode = 409;
      throw error;
    }
  }

  const userData = {
    ...body,
    first_name: body.firstName,
    last_name: body.lastName,
    source: body.source || null,
    status: UserStatus.INCOMPLETE,
    role: 'user',
    user_last_path: '/profile',
  };

  const createdUser = await User.create(userData);

  // Notify admin about new user (fire-and-forget)
  const userName = `${createdUser.first_name || ''} ${createdUser.last_name || ''}`.trim() || 'User';
  emailTemplateService.sendNewUserCreatedNotification({
    userId: createdUser.id,
    userName,
    userEmail: createdUser.email || body.email || 'N/A',
    userMobile: createdUser.mobile || body.mobile || 'N/A',
    userSource: createdUser.source || body.source || 'web',
    createdAt: new Date().toISOString(),
  }).catch((err) => logger.error(`New user notification error: ${err}`));

  return createdUser;
};

/**
 * Google signup: verify ID token, create user if email not exists.
 */
const googleSignup = async ({ idToken, login_as }) => {
  if (!idToken) return false;

  const client = new OAuth2Client(env.google.clientId);
  const ticket = await client.verifyIdToken({ idToken, audience: env.google.clientId });
  const payload = ticket.getPayload();
  if (!payload || !payload.email) return false;

  const existing = await User.findOne({ where: { email: payload.email } });
  if (existing) return { exists: true };

  const created = await User.create({
    email: payload.email,
    first_name: payload.given_name || '',
    last_name: payload.family_name || '',
    status: 'completed',
    register_as: login_as || 1,
    user_last_path: '/profile',
    role: 'user',
    signup_type: 'google',
  });

  const token = jwtUtil.createToken({ id: created.id });
  return { user: created, token };
};

/**
 * Google OAuth login/signup — handle both cases.
 */
const googleOAuthLogin = async ({ email, firstName, lastName, login_as }) => {
  if (!email) return { success: false, message: 'Email is required' };

  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    const token = jwtUtil.createToken({ id: existingUser.id });
    const userData = { ...existingUser.dataValues };
    if (userData.profile_image) userData.profile_image = process.env.BACKEND_BASE_URL + userData.profile_image;

    return {
      success: true, isNewUser: false, user: existingUser, token,
      userData: { fullName: `${existingUser.first_name} ${existingUser.last_name}`, ...userData },
    };
  }

  const newUser = await User.create({
    email, first_name: firstName || '', last_name: lastName || '',
    status: 'completed', register_as: login_as || 1, user_last_path: '/profile', role: 'user',
  });

  const token = jwtUtil.createToken({ id: newUser.id });
  return {
    success: true, isNewUser: true, user: newUser, token,
    userData: { fullName: `${newUser.first_name} ${newUser.last_name}`, ...newUser.dataValues },
  };
};

/**
 * Verify user OTP.
 */
const verifyUserOtp = async ({ otp, email }) => {
  const userData = await User.findOne({ where: { otp, email, status: 'incomplete' } });
  if (userData) return userData.update({ status: 'otpVerified' });
  return false;
};

/**
 * User login.
 */
const login = async ({ email, password, login_as }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) return false;

  const regAs = Number(user.register_as);
  const resolvedLoginAs = login_as !== undefined && login_as !== null && login_as !== '' ? login_as : user.register_as;
  const loginAs = Number(resolvedLoginAs);

  // Role-based login restrictions
  if (regAs === 2 && loginAs === 1) return false;
  if (regAs === 3 && loginAs !== 3) return false;
  if (loginAs === 3 && regAs !== 3) return false;

  const isPasswordMatch = await compareUserPassword(password, user.password);
  if (!isPasswordMatch) return false;

  const token = jwtUtil.createToken({ id: user.id });
  const userData = { ...user.dataValues };
  userData.password = '';
  if (userData.profile_image) userData.profile_image = process.env.BACKEND_BASE_URL + userData.profile_image;

  // Track last login
  if (loginAs === 1) await User.update({ freelancer_last_login: new Date() }, { where: { id: user.id } });
  if (loginAs === 2 || loginAs === 3) await User.update({ client_last_login: new Date() }, { where: { id: user.id } });

  return {
    token,
    login_as: String(resolvedLoginAs != null && resolvedLoginAs !== '' ? resolvedLoginAs : user.register_as),
    status: user.status,
    user_last_path: user.user_last_path,
    userKey: { fullName: `${user.first_name}${user.last_name}`, ...userData },
  };
};

/**
 * Resend OTP to email.
 */
const resendOtp = async (email) => {
  if (!email) return null;

  const user = await User.findOne({ where: { email } });
  if (!user) return null;

  const otp = generateOTP(6);
  emailTemplateService.verificationOTP({ email, otp }).catch((err) => logger.error(`Resend OTP error: ${err}`));
  return { otp };
};

/**
 * Request password reset — generate token and send email.
 */
const requestPasswordReset = async ({ email }) => {
  if (!email) return { ok: false, code: 'BAD_REQUEST' };

  const user = await User.findOne({ where: { email } });
  if (!user) return { ok: false, code: 'NOT_FOUND' };

  // Invalidate previous tokens
  if (PasswordResetToken) {
    await PasswordResetToken.update({ used_at: new Date() }, { where: { user_id: user.id, used_at: null } });
  }

  const token = generateToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  if (PasswordResetToken) {
    await PasswordResetToken.create({ user_id: user.id, token, expires_at: expiresAt });
  } else {
    await User.update({ token }, { where: { id: user.id } });
  }

  emailTemplateService.newPasswordSetUrl({
    email: user.email, token,
    userName: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
  }).catch((err) => logger.error(`Password reset email error: ${err}`));

  return { ok: true };
};

/**
 * Validate password reset token.
 */
const validatePasswordResetToken = async (token) => {
  if (!token) return { ok: false, code: 'BAD_REQUEST' };

  if (!PasswordResetToken) {
    const user = await User.findOne({ where: { token } });
    return user ? { ok: true } : { ok: false, code: 'NOT_FOUND' };
  }

  const record = await PasswordResetToken.findOne({ where: { token } });
  if (!record) return { ok: false, code: 'NOT_FOUND' };
  if (record.used_at) return { ok: false, code: 'USED' };
  if (new Date(record.expires_at).getTime() < Date.now()) return { ok: false, code: 'EXPIRED' };
  return { ok: true };
};

/**
 * Set new password by reset token.
 */
const setNewPasswordByToken = async ({ token, password }) => {
  if (!token || !password) return false;

  if (!PasswordResetToken) {
    const user = await User.findOne({ where: { token } });
    if (!user) return false;
    const hashPassword = await generateHash(password);
    await User.update({ password: hashPassword, token: null }, { where: { id: user.id } });
    return true;
  }

  const record = await PasswordResetToken.findOne({ where: { token } });
  if (!record || record.used_at) return false;
  if (new Date(record.expires_at).getTime() < Date.now()) return false;

  const user = await User.findByPk(record.user_id);
  if (!user) return false;

  const hashPassword = await generateHash(password);
  await User.update({ password: hashPassword }, { where: { id: user.id } });
  await PasswordResetToken.update({ used_at: new Date() }, { where: { id: record.id } });
  return true;
};

/**
 * Reset password by token (legacy endpoint).
 */
const resetPasswordByToken = async ({ token, password }) => {
  if (!token || !password) return false;
  const user = await User.findOne({ where: { token } });
  if (!user) return false;
  const hashPassword = await generateHash(password);
  await User.update({ password: hashPassword, token: null }, { where: { id: user.id } });
  return true;
};

// ---- LinkedIn OAuth ----

/**
 * Build LinkedIn OAuth authorization URL (signup).
 */
const getLinkedInAuthUrl = () => {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = `${process.env.LINKEDIN_REDIRECT_URI}/api/auth/linkedin/callback`;
  if (!clientId) return { error: 'LinkedIn Client ID not configured' };
  const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const scope = 'openid profile email';
  const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${encodeURIComponent(scope)}`;
  return { url, state };
};

/**
 * Build LinkedIn OAuth authorization URL (login).
 */
const getLinkedInAuthUrlForLogin = (loginAs = '1') => {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = `${process.env.LINKEDIN_REDIRECT_URI}/api/auth/linkedin/callback/login`;
  if (!clientId) return { error: 'LinkedIn Client ID not configured' };
  const state = `login_as=${loginAs}`;
  const scope = 'openid profile email';
  const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}&scope=${encodeURIComponent(scope)}`;
  return { url };
};

/**
 * Exchange LinkedIn code for access token and fetch profile.
 */
const exchangeLinkedInCode = async (code, redirectUri) => {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error('LinkedIn OAuth not configured');

  const tokenParams = [
    'grant_type=authorization_code',
    `code=${encodeURIComponent(code)}`,
    `redirect_uri=${encodeURIComponent(redirectUri)}`,
    `client_id=${encodeURIComponent(clientId)}`,
    `client_secret=${encodeURIComponent(clientSecret)}`,
  ].join('&');

  const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', tokenParams, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  const accessToken = tokenResponse.data.access_token;
  if (!accessToken) throw new Error('Invalid LinkedIn tokens');

  let email = null;
  let givenName = '';
  let familyName = '';

  try {
    const userinfoResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const profile = userinfoResponse.data;
    email = profile.email || null;
    givenName = profile.given_name || '';
    familyName = profile.family_name || '';
  } catch (e) {
    // fallback: try v2 email endpoint
    try {
      const emailResponse = await axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      email = emailResponse.data?.elements?.[0]?.['handle~']?.emailAddress || null;
    } catch (emailErr) { /* ignore */ }
  }

  return { email, givenName, familyName };
};

/**
 * LinkedIn OAuth signup callback — login or create user.
 */
const linkedInOAuthCallback = async (code) => {
  const redirectUri = `${process.env.LINKEDIN_REDIRECT_URI}/api/auth/linkedin/callback`;
  const { email, givenName, familyName } = await exchangeLinkedInCode(code, redirectUri);
  if (!email) throw new Error('Email not available from LinkedIn');
  return googleOAuthLogin({ email, firstName: givenName, lastName: familyName, login_as: 1 });
};

/**
 * LinkedIn OAuth login callback — verify user exists.
 */
const linkedInOAuthCallbackForLogin = async (code, state) => {
  let loginAs = '1';
  if (state?.includes('login_as=')) {
    const [, extracted] = state.match(/login_as=(\d+)/) || [];
    if (extracted) loginAs = extracted;
  }

  const redirectUri = `${process.env.LINKEDIN_REDIRECT_URI}/api/auth/linkedin/callback/login`;
  const { email } = await exchangeLinkedInCode(code, redirectUri);
  if (!email) throw new Error('Email not available from LinkedIn');

  const existingUser = await isUserExists({ email, source: 'linkedin' });
  if (!existingUser) throw new Error('User not found. Please sign up first.');

  const regAs = Number(existingUser.register_as);
  const la = Number(loginAs);
  if ((regAs === 2 && la === 1) || (regAs === 3 && la !== 3) || (la === 3 && regAs !== 3)) {
    throw new Error('Invalid login type');
  }

  const token = jwtUtil.createToken({ id: existingUser.id });
  const userData = { ...existingUser.dataValues };
  if (userData.profile_image) userData.profile_image = process.env.BACKEND_BASE_URL + userData.profile_image;

  return {
    token,
    login_as: loginAs,
    status: existingUser.status,
    user_last_path: existingUser.user_last_path,
    userKey: { fullName: `${existingUser.first_name}${existingUser.last_name}`, ...userData },
  };
};

// ---- Facebook OAuth ----

/**
 * Build Facebook OAuth authorization URL.
 */
const getFacebookAuthUrl = () => {
  const clientId = process.env.FACEBOOK_APP_ID;
  const redirectUri = `${process.env.FACEBOOK_REDIRECT_URI || 'https://localhost:8080'}/api/auth/facebook/callback`;
  if (!clientId) return { error: 'Facebook App ID not configured' };
  const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const scope = 'email public_profile';
  const url = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${encodeURIComponent(scope)}&response_type=code`;
  return { url, state };
};

/**
 * Facebook OAuth callback — login or create user.
 */
const facebookOAuthCallback = async (code) => {
  const clientId = process.env.FACEBOOK_APP_ID;
  const clientSecret = process.env.FACEBOOK_APP_SECRET;
  const redirectUri = `${process.env.FACEBOOK_REDIRECT_URI || 'https://localhost:8080'}/api/auth/facebook/callback`;
  if (!clientId || !clientSecret) throw new Error('Facebook OAuth not configured');

  const tokenParams = [
    'grant_type=authorization_code',
    `code=${encodeURIComponent(code)}`,
    `redirect_uri=${encodeURIComponent(redirectUri)}`,
    `client_id=${encodeURIComponent(clientId)}`,
    `client_secret=${encodeURIComponent(clientSecret)}`,
  ].join('&');

  const tokenResponse = await axios.post('https://graph.facebook.com/v18.0/oauth/access_token', tokenParams, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    timeout: 30000,
  });

  const accessToken = tokenResponse.data.access_token;
  if (!accessToken) throw new Error('Invalid Facebook tokens');

  const profileResponse = await axios.get('https://graph.facebook.com/v18.0/me?fields=id,name,email,first_name,last_name', {
    headers: { Authorization: `Bearer ${accessToken}` },
    timeout: 30000,
  });

  const profile = profileResponse.data;
  const email = profile.email || null;
  let givenName = profile.first_name || '';
  let familyName = profile.last_name || '';

  if (!givenName && !familyName && profile.name) {
    const parts = profile.name.split(' ');
    givenName = parts[0] || '';
    familyName = parts.slice(1).join(' ') || '';
  }

  if (!email) throw new Error('Email not available from Facebook');

  return googleOAuthLogin({ email, firstName: givenName, lastName: familyName, login_as: 1 });
};

export default {
  isUserExists,
  compareUserPassword,
  sendOtpWithoutSaving,
  checkUserExist,
  createNewUser,
  googleSignup,
  googleOAuthLogin,
  verifyUserOtp,
  login,
  resendOtp,
  requestPasswordReset,
  validatePasswordResetToken,
  setNewPasswordByToken,
  resetPasswordByToken,
  getLinkedInAuthUrl,
  getLinkedInAuthUrlForLogin,
  linkedInOAuthCallback,
  linkedInOAuthCallbackForLogin,
  getFacebookAuthUrl,
  facebookOAuthCallback,
};
