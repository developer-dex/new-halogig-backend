import asyncHandler from '../../utils/asyncHandler';
import getHttpStatus from '../../utils/httpStatus';
import getMessage from '../../utils/message';
import authService from './auth.service';
import { UserStatus } from '../../constants/enums';

/**
 * POST /api/user/check-user-exist
 */
const checkUserExist = asyncHandler(async (req, res) => {
  const { email, mobile, firstName = '', lastName = '', source = '' } = req.body || {};

  if (!email || (!mobile && !source)) {
    return res.status(getHttpStatus('BAD_REQUEST')).json({
      success: false, data: null, message: getMessage(req, false, 'EMAIL_MOBILE_NOT_FOUND'),
    });
  }

  const result = await authService.checkUserExist({ email, mobile, firstName, lastName, source });

  if (result.error) {
    return res.status(getHttpStatus('BAD_REQUEST')).json({
      success: false, data: null, message: getMessage(req, false, result.error),
    });
  }

  return res.status(getHttpStatus('OK')).json({
    success: true, data: { otp: result.otp }, message: getMessage(req, false, 'SEND_EMAIL_VERIFICATION'),
  });
});

/**
 * POST /api/user/create-user
 */
const createNewUser = asyncHandler(async (req, res) => {
  const result = await authService.createNewUser(req.body);
  if (result) {
    return res.status(getHttpStatus('OK')).json({
      success: true, data: result, message: getMessage(req, false, 'SIGNUP'),
    });
  }
  return res.status(getHttpStatus('BAD_REQUEST')).json({
    success: false, data: null, message: getMessage(req, false, 'FALSE_RESPONSE'),
  });
});

/**
 * POST /api/user/google-signup
 */
const googleSignup = asyncHandler(async (req, res) => {
  const result = await authService.googleSignup(req.body);
  if (result) {
    return res.status(getHttpStatus('OK')).json({
      success: true, data: result, message: getMessage(req, false, 'SIGNUP'),
    });
  }
  return res.status(getHttpStatus('BAD_REQUEST')).json({
    success: false, data: null, message: getMessage(req, false, 'FALSE_RESPONSE'),
  });
});

/**
 * PUT /api/user/otp-verify
 */
const verifyUserOtp = asyncHandler(async (req, res) => {
  const result = await authService.verifyUserOtp(req.body);
  if (result) {
    return res.status(getHttpStatus('OK')).json({
      success: true, data: result, message: getMessage(req, false, 'SIGNUP'),
    });
  }
  return res.status(getHttpStatus('BAD_REQUEST')).json({
    success: false, data: null, message: getMessage(req, false, 'INVALID_OTP'),
  });
});

/**
 * POST /api/login
 */
const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);

  if (result) {
    if (result.status === UserStatus.PENDING && Number(req.body.login_as) === 1) {
      return res.status(getHttpStatus('BAD_REQUEST')).json({
        success: false, data: null, message: getMessage(req, false, 'Your Application Is Still Under Review'),
      });
    }
    return res.status(getHttpStatus('OK')).json({
      success: true, data: result, message: getMessage(req, false, ''),
    });
  }

  return res.status(getHttpStatus('BAD_REQUEST')).json({
    success: false, data: null, message: getMessage(req, false, 'Email or Password is incorrect'),
  });
});

/**
 * POST /api/auth/resendotp
 */
const resendOtp = asyncHandler(async (req, res) => {
  const email = req.body.email || req.body.phoneNumber;
  const result = await authService.resendOtp(email);
  if (result) {
    return res.status(getHttpStatus('OK')).json({
      success: true, data: result, message: getMessage(req, false, 'OTP_RE_SENT'),
    });
  }
  return res.status(getHttpStatus('BAD_REQUEST')).json({
    success: false, data: null, message: getMessage(req, false, 'FALSE_RESPONSE'),
  });
});

/**
 * POST /api/auth/forgot-password
 */
const requestPasswordReset = asyncHandler(async (req, res) => {
  const result = await authService.requestPasswordReset(req.body);
  if (result.ok) {
    return res.status(getHttpStatus('OK')).json({
      success: true, data: null, message: getMessage(req, false, 'PASSWORD_LINK_SENT'),
    });
  }
  const msgKey = result.code === 'NOT_FOUND' ? 'EMAIL_NOT_EXIST' : 'FALSE_RESPONSE';
  return res.status(getHttpStatus('BAD_REQUEST')).json({
    success: false, data: null, message: getMessage(req, false, msgKey),
  });
});

/**
 * GET /api/auth/reset-token/:token/validate
 */
const validatePasswordResetToken = asyncHandler(async (req, res) => {
  const result = await authService.validatePasswordResetToken(req.params.token);
  if (result.ok) {
    return res.status(getHttpStatus('OK')).json({ success: true, data: null, message: 'Token is valid' });
  }
  return res.status(getHttpStatus('BAD_REQUEST')).json({
    success: false, data: null, message: result.code === 'EXPIRED' ? 'Token has expired' : 'Invalid token',
  });
});

/**
 * POST /api/auth/set-new-password
 */
const setNewPasswordByToken = asyncHandler(async (req, res) => {
  const result = await authService.setNewPasswordByToken(req.body);
  if (result) {
    return res.status(getHttpStatus('OK')).json({
      success: true, data: null, message: getMessage(req, false, 'PASSWORD_CREATED_SUCCESS'),
    });
  }
  return res.status(getHttpStatus('BAD_REQUEST')).json({
    success: false, data: null, message: getMessage(req, false, 'FALSE_RESPONSE'),
  });
});

/**
 * POST /api/auth/reset-password
 */
const resetPasswordByToken = asyncHandler(async (req, res) => {
  const result = await authService.resetPasswordByToken(req.body);
  if (result) {
    return res.status(getHttpStatus('OK')).json({
      success: true, data: null, message: getMessage(req, false, 'PASSWORD_CREATED_SUCCESS'),
    });
  }
  return res.status(getHttpStatus('BAD_REQUEST')).json({
    success: false, data: null, message: getMessage(req, false, 'FALSE_RESPONSE'),
  });
});

/**
 * GET /api/auth/google/url — Return Google OAuth consent URL
 */
const getGoogleAuthUrl = asyncHandler(async (req, res) => {
  const client = new (await import('google-auth-library')).OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );
  const url = client.generateAuthUrl({
    access_type: 'offline',
    scope: ['openid', 'email', 'profile'],
    prompt: 'consent',
  });
  res.status(getHttpStatus('OK')).json({ success: true, url });
});

/**
 * GET /api/auth/google/callback — Google OAuth callback
 */
const googleOAuthCallback = asyncHandler(async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(getHttpStatus('BAD_REQUEST')).json({ success: false, message: 'No code provided' });
  }

  const client = new (await import('google-auth-library')).OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );

  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);

  const ticket = await client.verifyIdToken({ idToken: tokens.id_token, audience: process.env.GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();

  const result = await authService.googleOAuthLogin({
    email: payload.email,
    firstName: payload.given_name || '',
    lastName: payload.family_name || '',
    login_as: req.query.login_as || 1,
  });

  const frontendUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:3000';
  return res.redirect(`${frontendUrl}/auth/callback?token=${result.token}&isNewUser=${result.isNewUser}`);
});

/**
 * GET /api/auth/google/url/login — Google OAuth URL for login
 */
const getGoogleAuthUrlForLogin = asyncHandler(async (req, res) => {
  const loginAs = req.query.login_as || '1';
  const client = new (await import('google-auth-library')).OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.GOOGLE_REDIRECT_URI}/login`,
  );
  const url = client.generateAuthUrl({
    access_type: 'offline',
    scope: ['openid', 'email', 'profile'],
    prompt: 'consent',
    state: `login_as=${loginAs}`,
  });
  res.status(getHttpStatus('OK')).json({ success: true, url });
});

/**
 * GET /api/auth/google/callback/login — Google OAuth login callback
 */
const googleOAuthCallbackForLogin = asyncHandler(async (req, res) => {
  const { code, state } = req.query;
  if (!code) {
    return res.status(getHttpStatus('BAD_REQUEST')).json({ success: false, message: 'No code provided' });
  }

  let loginAs = '1';
  if (state?.includes('login_as=')) {
    const [, extracted] = state.match(/login_as=(\d+)/) || [];
    if (extracted) loginAs = extracted;
  }

  const client = new (await import('google-auth-library')).OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.GOOGLE_REDIRECT_URI}/login`,
  );

  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);
  const ticket = await client.verifyIdToken({ idToken: tokens.id_token, audience: process.env.GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();

  const result = await authService.googleOAuthLogin({
    email: payload.email,
    firstName: payload.given_name || '',
    lastName: payload.family_name || '',
    login_as: loginAs,
  });

  const frontendUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:3000';
  return res.redirect(`${frontendUrl}/login?token=${result.token}&login_as=${loginAs}`);
});

/**
 * GET /api/auth/linkedin/url — LinkedIn OAuth URL (signup)
 */
const getLinkedInAuthUrl = asyncHandler(async (req, res) => {
  const result = authService.getLinkedInAuthUrl();
  if (result.error) return res.status(getHttpStatus('BAD_REQUEST')).json({ success: false, message: result.error });
  return res.status(getHttpStatus('OK')).json({ success: true, url: result.url, state: result.state });
});

/**
 * GET /api/auth/linkedin/callback — LinkedIn OAuth signup callback
 */
const linkedInOAuthCallback = asyncHandler(async (req, res) => {
  const { code } = req.query;
  const frontendUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:3000';
  if (!code) return res.redirect(`${frontendUrl}/signup?error=missing_code`);
  try {
    const result = await authService.linkedInOAuthCallback(code);
    const queryParams = `token=${result.token}&isNewUser=${result.isNewUser}&success=true&source=linkedin`;
    return res.redirect(`${frontendUrl}/signup?${queryParams}`);
  } catch (error) {
    return res.redirect(`${frontendUrl}/signup?error=server_error&message=${encodeURIComponent(error.message)}`);
  }
});

/**
 * GET /api/auth/linkedin/url/login — LinkedIn OAuth URL (login)
 */
const getLinkedInAuthUrlForLogin = asyncHandler(async (req, res) => {
  const result = authService.getLinkedInAuthUrlForLogin(req.query.login_as);
  if (result.error) return res.status(getHttpStatus('BAD_REQUEST')).json({ success: false, message: result.error });
  return res.status(getHttpStatus('OK')).json({ success: true, url: result.url });
});

/**
 * GET /api/auth/linkedin/callback/login — LinkedIn OAuth login callback
 */
const linkedInOAuthCallbackForLogin = asyncHandler(async (req, res) => {
  const { code, state } = req.query;
  const frontendUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:3000';
  if (!code) return res.redirect(`${frontendUrl}/login?error=missing_code`);
  try {
    const result = await authService.linkedInOAuthCallbackForLogin(code, state);
    const queryParams = `token=${result.token}&login_as=${result.login_as}&success=true&source=linkedin`;
    return res.redirect(`${frontendUrl}/login?${queryParams}`);
  } catch (error) {
    return res.redirect(`${frontendUrl}/login?error=server_error&message=${encodeURIComponent(error.message)}`);
  }
});

/**
 * GET /api/auth/facebook/url — Facebook OAuth URL
 */
const getFacebookAuthUrl = asyncHandler(async (req, res) => {
  const result = authService.getFacebookAuthUrl();
  if (result.error) return res.status(getHttpStatus('BAD_REQUEST')).json({ success: false, message: result.error });
  return res.status(getHttpStatus('OK')).json({ success: true, url: result.url, state: result.state });
});

/**
 * GET /api/auth/facebook/callback — Facebook OAuth callback
 */
const facebookOAuthCallback = asyncHandler(async (req, res) => {
  const { code } = req.query;
  const frontendUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:3000';
  if (!code) return res.redirect(`${frontendUrl}/signup?error=missing_code`);
  try {
    const result = await authService.facebookOAuthCallback(code);
    const queryParams = `token=${result.token}&isNewUser=${result.isNewUser}&success=true&source=facebook`;
    return res.redirect(`${frontendUrl}/signup?${queryParams}`);
  } catch (error) {
    return res.redirect(`${frontendUrl}/signup?error=server_error&message=${encodeURIComponent(error.message)}`);
  }
});

export default {
  checkUserExist,
  createNewUser,
  googleSignup,
  verifyUserOtp,
  login,
  resendOtp,
  requestPasswordReset,
  validatePasswordResetToken,
  setNewPasswordByToken,
  resetPasswordByToken,
  getGoogleAuthUrl,
  googleOAuthCallback,
  getGoogleAuthUrlForLogin,
  googleOAuthCallbackForLogin,
  getLinkedInAuthUrl,
  linkedInOAuthCallback,
  getLinkedInAuthUrlForLogin,
  linkedInOAuthCallbackForLogin,
  getFacebookAuthUrl,
  facebookOAuthCallback,
};
