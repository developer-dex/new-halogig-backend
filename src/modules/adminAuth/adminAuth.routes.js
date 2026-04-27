import { Router } from 'express';
import adminAuthController from './adminAuth.controller';
import validate from '../../middlewares/validate.middleware';
import adminAuthValidation from './adminAuth.validation';
import adminAuthMiddleware from '../../middlewares/adminAuth.middleware';
import requireModuleAccess from '../../middlewares/rbac.middleware';

const router = Router();

// ============ Public routes ============
router.post('/admin/auth/login', validate(adminAuthValidation.adminLogin), adminAuthController.adminLogin);
router.post('/admin/login', validate(adminAuthValidation.adminLogin), adminAuthController.adminLogin);
router.post('/admin/verify-otp', validate(adminAuthValidation.verifyOtp), adminAuthController.verifyOtpAndLogin);

// ============ Protected routes (admin auth required) ============
router.get('/admin/auth/profile', adminAuthMiddleware, adminAuthController.getAdminProfile);
router.post('/admin/auth/change-password', adminAuthMiddleware, validate(adminAuthValidation.changePassword), adminAuthController.changePassword);

// ============ Admin CRUD (admin auth + RBAC) ============
router.post('/admin/auth/create', adminAuthMiddleware, validate(adminAuthValidation.createAdmin), adminAuthController.createAdmin);
router.get('/admin/auth/admins', adminAuthMiddleware, adminAuthController.getAllAdmins);
router.get('/admin/auth/admins/:adminId', adminAuthMiddleware, adminAuthController.getAdminById);
router.put('/admin/auth/admins/:adminId', adminAuthMiddleware, validate(adminAuthValidation.updateAdmin), adminAuthController.updateAdmin);
router.delete('/admin/auth/admins/:adminId', adminAuthMiddleware, adminAuthController.deleteAdmin);

// ============ RBAC-protected admin CRUD (from admin.route.js) ============
router.get('/admins', adminAuthMiddleware, requireModuleAccess('/admin/admins'), adminAuthController.getAllAdmins);
router.post('/admins', adminAuthMiddleware, requireModuleAccess('/admin/admins'), adminAuthController.createAdmin);
router.get('/admins/:adminId', adminAuthMiddleware, requireModuleAccess('/admin/admins'), adminAuthController.getAdminById);
router.put('/admins/:adminId', adminAuthMiddleware, requireModuleAccess('/admin/admins'), adminAuthController.updateAdmin);
router.delete('/admins/:adminId', adminAuthMiddleware, requireModuleAccess('/admin/admins'), adminAuthController.deleteAdmin);

// ============ Legacy admin create (from admin.route.js) ============
router.post('/admin/create', adminAuthController.createAdmin);

export default router;
