import bcrypt from 'bcryptjs';
import { Admin } from '../../models';
import jwtUtil from '../../utils/jwt';
import { calculatePagination } from '../../utils/pagination';
import { normalizePermissions, hasAtLeastOnePermission } from '../../utils/rbac';
import emailTemplateService from '../../services/emailTemplate.service';
import logger from '../../config/logger';

const SALT_ROUNDS = 10;

/**
 * Create a new admin account.
 */
const createAdmin = async ({
  email, password, firstName, lastName, role = 'admin', created_by, createdBy, permissions,
}) => {
  const existingAdmin = await Admin.findOne({ where: { email } });
  if (existingAdmin) throw new Error('Admin with this email already exists');

  const normalizedPermissions = normalizePermissions(permissions) || {};
  if (!hasAtLeastOnePermission(normalizedPermissions)) {
    throw new Error('At least one permission must be selected');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const admin = await Admin.create({
    first_name: firstName,
    last_name: lastName,
    email,
    password: hashedPassword,
    role,
    created_by: createdBy || created_by || 1,
    status: 'active',
    permissions: normalizedPermissions,
    permissions_version: 1,
  });

  const adminResponse = admin.toJSON();
  delete adminResponse.password;
  return adminResponse;
};

/**
 * Admin login — validates credentials and sends 2FA OTP.
 */
const adminLogin = async ({ email, password }) => {
  const admin = await Admin.findOne({ where: { email, status: 'active' } });
  if (!admin) return { success: false, message: 'Invalid email or password' };

  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) return { success: false, message: 'Invalid email or password' };

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await Admin.update({ otp, otp_expiry: otpExpiry }, { where: { id: admin.id } });

  // Send OTP email (fire-and-forget)
  emailTemplateService.sendAdmin2FAOTP({
    email: admin.email,
    otp,
    adminName: `${admin.first_name} ${admin.last_name}`,
  }).catch((err) => logger.error(`Failed to send OTP email: ${err}`));

  return {
    success: true,
    requiresOtp: true,
    otp,
    adminId: admin.id,
    email: admin.email,
    message: 'OTP sent to your email',
  };
};

/**
 * Verify OTP and complete admin login.
 */
const verifyOtpAndLogin = async ({ email, otp, ipAddress }) => {
  const admin = await Admin.findOne({ where: { email, status: 'active' } });
  if (!admin) return { success: false, message: 'Invalid request' };

  if (!admin.otp || admin.otp !== otp) return { success: false, message: 'Invalid OTP' };
  if (!admin.otp_expiry || new Date() > new Date(admin.otp_expiry)) return { success: false, message: 'OTP has expired' };

  await Admin.update(
    { otp: null, otp_expiry: null, last_login: new Date(), last_login_ip: ipAddress },
    { where: { id: admin.id } },
  );

  const token = jwtUtil.createToken({
    id: admin.id, email: admin.email, role: admin.role, type: 'admin',
  });

  const adminResponse = admin.toJSON();
  delete adminResponse.password;
  delete adminResponse.otp;
  delete adminResponse.otp_expiry;

  return {
    success: true,
    token,
    admin: { ...adminResponse, fullName: `${admin.first_name} ${admin.last_name}` },
  };
};

/**
 * Verify an admin JWT token. Returns admin object or null.
 * Used by adminAuth middleware.
 */
const verifyAdminToken = async (token) => {
  try {
    const decoded = jwtUtil.verifyToken(token);
    if (!decoded || decoded.type !== 'admin') return null;

    const admin = await Admin.findByPk(decoded.id, { attributes: { exclude: ['password'] } });
    if (!admin || admin.status !== 'active') return null;

    return admin;
  } catch (error) {
    return null;
  }
};

/**
 * Get admin by ID.
 */
const getAdminById = async (adminId) => {
  const admin = await Admin.findByPk(adminId, {
    attributes: { exclude: ['password'] },
    include: [{ model: Admin, as: 'creator', attributes: ['id', 'first_name', 'last_name', 'email'] }],
  });
  if (!admin) throw new Error('Admin not found');
  return admin;
};

/**
 * Get all admins with pagination.
 */
const getAllAdmins = async ({ page = 1, limit = 50, status, role }) => {
  const { offset, parsedLimit } = calculatePagination(page, limit);

  const whereClause = {};
  whereClause.status = status || 'active';
  if (role) whereClause.role = role;

  const totalCount = await Admin.count({ where: whereClause });
  const admins = await Admin.findAll({
    where: whereClause,
    attributes: { exclude: ['password'] },
    include: [{ model: Admin, as: 'creator', attributes: ['id', 'first_name', 'last_name', 'email'] }],
    order: [['created_at', 'DESC']],
    limit: parsedLimit,
    offset,
  });

  return {
    admins,
    total_count: totalCount,
    current_page: parseInt(page, 10),
    per_page: parsedLimit,
    total_pages: Math.ceil(totalCount / parsedLimit),
  };
};

/**
 * Update admin.
 */
const updateAdmin = async (adminId, updateData) => {
  const admin = await Admin.findByPk(adminId);
  if (!admin) throw new Error('Admin not found');

  let updatedFields = { ...updateData };

  if (updateData.password) {
    updatedFields.password = await bcrypt.hash(updateData.password, SALT_ROUNDS);
  }

  if (updateData.permissions) {
    const normalized = normalizePermissions(updateData.permissions);
    updatedFields.permissions = normalized;
    updatedFields.permissions_version = (admin.permissions_version || 1) + 1;
  }

  await Admin.update(updatedFields, { where: { id: adminId } });
  return Admin.findByPk(adminId, { attributes: { exclude: ['password'] } });
};

/**
 * Delete admin (hard delete).
 */
const deleteAdmin = async (adminId) => {
  const admin = await Admin.findByPk(adminId);
  if (!admin) throw new Error('Admin not found');
  await Admin.destroy({ where: { id: adminId } });
  return true;
};

/**
 * Change admin password.
 */
const changePassword = async (adminId, currentPassword, newPassword) => {
  const admin = await Admin.findByPk(adminId);
  if (!admin) throw new Error('Admin not found');

  const isValid = await bcrypt.compare(currentPassword, admin.password);
  if (!isValid) throw new Error('Current password is incorrect');

  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await Admin.update({ password: hashed }, { where: { id: adminId } });
  return true;
};

export {
  createAdmin,
  adminLogin,
  verifyOtpAndLogin,
  verifyAdminToken,
  getAdminById,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  changePassword,
};

export default {
  createAdmin,
  adminLogin,
  verifyOtpAndLogin,
  verifyAdminToken,
  getAdminById,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  changePassword,
};
