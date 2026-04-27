import crypto from 'crypto';
import asyncHandler from '../../utils/asyncHandler';
import getHttpStatus from '../../utils/httpStatus';
import adminAuthService from './adminAuth.service';
import emailTemplateService from '../../services/emailTemplate.service';

const generateTempPassword = (length = 12) => {
  const raw = crypto.randomBytes(Math.ceil(length * 0.75)).toString('base64');
  return raw.replace(/[^a-zA-Z0-9]/g, '').slice(0, length);
};

const capitalize = (value) => {
  const str = String(value || '').trim();
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const deriveNameFromEmail = (email) => {
  const base = String(email || '').split('@')[0] || '';
  const parts = base.split(/[._-]/).filter(Boolean);
  return { firstName: capitalize(parts[0]) || 'Admin', lastName: capitalize(parts[1]) || 'User' };
};

/**
 * POST /api/admin/auth/login
 */
const adminLogin = asyncHandler(async (req, res) => {
  const result = await adminAuthService.adminLogin(req.body);

  if (result.success) {
    return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: 'Login successful' });
  }
  return res.status(getHttpStatus('UNAUTHORIZED')).json({ success: false, data: null, message: result.message });
});

/**
 * POST /api/admin/verify-otp
 */
const verifyOtpAndLogin = asyncHandler(async (req, res) => {
  const ipAddress = req.ip || req.connection?.remoteAddress;
  const result = await adminAuthService.verifyOtpAndLogin({ ...req.body, ipAddress });

  if (result.success) {
    return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: 'Login successful' });
  }
  return res.status(getHttpStatus('BAD_REQUEST')).json({ success: false, data: null, message: result.message || 'OTP verification failed' });
});

/**
 * POST /api/admin/auth/create
 */
const createAdmin = asyncHandler(async (req, res) => {
  const { user } = req;
  const { email, permissions, role, firstName: bodyFirstName, lastName: bodyLastName } = req.body;

  const tempPassword = generateTempPassword(12);
  const derived = deriveNameFromEmail(email);
  const firstName = bodyFirstName || derived.firstName;
  const lastName = bodyLastName || derived.lastName;

  const result = await adminAuthService.createAdmin({
    email, permissions, role, firstName, lastName, password: tempPassword, created_by: user.id,
  });

  // Send email with temp password (best-effort)
  emailTemplateService.createStaff({
    email, userName: `${firstName} ${lastName}`.trim(), password: tempPassword, dateTime: new Date().toLocaleString(),
  }).catch((err) => console.error('Failed to send admin create email:', err));

  res.status(getHttpStatus('CREATED')).json({ success: true, data: result, message: 'Admin created successfully' });
});

/**
 * GET /api/admin/auth/profile
 */
const getAdminProfile = asyncHandler(async (req, res) => {
  const result = await adminAuthService.getAdminById(req.user.id);
  res.status(getHttpStatus('OK')).json({ success: true, data: result, message: 'Admin profile retrieved successfully' });
});

/**
 * GET /api/admin/auth/admins
 */
const getAllAdmins = asyncHandler(async (req, res) => {
  const result = await adminAuthService.getAllAdmins(req.query);
  res.status(getHttpStatus('OK')).json({ success: true, data: result, message: 'Admins retrieved successfully' });
});

/**
 * GET /api/admin/auth/admins/:adminId
 */
const getAdminById = asyncHandler(async (req, res) => {
  const result = await adminAuthService.getAdminById(req.params.adminId);
  res.status(getHttpStatus('OK')).json({ success: true, data: result, message: 'Admin retrieved successfully' });
});

/**
 * PUT /api/admin/auth/admins/:adminId
 */
const updateAdmin = asyncHandler(async (req, res) => {
  const result = await adminAuthService.updateAdmin(req.params.adminId, req.body);
  res.status(getHttpStatus('OK')).json({ success: true, data: result, message: 'Admin updated successfully' });
});

/**
 * DELETE /api/admin/auth/admins/:adminId
 */
const deleteAdmin = asyncHandler(async (req, res) => {
  const { user } = req;
  if (String(req.params.adminId) === String(user.id)) {
    return res.status(getHttpStatus('BAD_REQUEST')).json({ success: false, data: null, message: 'Cannot delete yourself' });
  }
  const result = await adminAuthService.deleteAdmin(req.params.adminId);
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: 'Admin deleted successfully' });
});

/**
 * POST /api/admin/auth/change-password
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (currentPassword === newPassword) {
    return res.status(getHttpStatus('BAD_REQUEST')).json({
      success: false, data: null, message: 'New password must be different from current password',
    });
  }

  await adminAuthService.changePassword(req.user.id, currentPassword, newPassword);
  return res.status(getHttpStatus('OK')).json({ success: true, data: null, message: 'Password changed successfully' });
});

export default {
  adminLogin,
  verifyOtpAndLogin,
  createAdmin,
  getAdminProfile,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  changePassword,
};
