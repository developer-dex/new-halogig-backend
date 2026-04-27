import { Router } from 'express';
import authController from './auth.controller';
import validate from '../../middlewares/validate.middleware';
import authValidation from './auth.validation';

const router = Router();

// User creation & OTP
router.post('/user/create-user', validate(authValidation.createUser), authController.createNewUser);
router.post('/user/check-user-exist', validate(authValidation.checkUserExist), authController.checkUserExist);
router.put('/user/otp-verify', validate(authValidation.verifyOtp), authController.verifyUserOtp);
router.post('/auth/resendotp', validate(authValidation.resendOtp), authController.resendOtp);

// Google signup
router.post('/user/google-signup', validate(authValidation.googleSignup), authController.googleSignup);

// Google OAuth URL and callback
router.get('/auth/google/url', authController.getGoogleAuthUrl);
router.get('/auth/google/callback', authController.googleOAuthCallback);

// Google OAuth Login URL and callback
router.get('/auth/google/url/login', authController.getGoogleAuthUrlForLogin);
router.get('/auth/google/callback/login', authController.googleOAuthCallbackForLogin);

// LinkedIn OAuth URL and callback (signup)
router.get('/auth/linkedin/url', authController.getLinkedInAuthUrl);
router.get('/auth/linkedin/callback', authController.linkedInOAuthCallback);

// LinkedIn OAuth Login URL and callback
router.get('/auth/linkedin/url/login', authController.getLinkedInAuthUrlForLogin);
router.get('/auth/linkedin/callback/login', authController.linkedInOAuthCallbackForLogin);

// Facebook OAuth URL and callback
router.get('/auth/facebook/url', authController.getFacebookAuthUrl);
router.get('/auth/facebook/callback', authController.facebookOAuthCallback);

// Login
router.post('/login', validate(authValidation.login), authController.login);

// Password reset
router.post('/auth/forgot-password', validate(authValidation.forgotPassword), authController.requestPasswordReset);
router.get('/auth/reset-token/:token/validate', authController.validatePasswordResetToken);
router.post('/auth/set-new-password', validate(authValidation.setNewPassword), authController.setNewPasswordByToken);
router.post('/auth/reset-password', validate(authValidation.resetPassword), authController.resetPasswordByToken);

export default router;
