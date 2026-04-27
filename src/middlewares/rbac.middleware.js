import getHttpStatus from '../utils/httpStatus';
import { isModuleAllowed } from '../utils/rbac';

/**
 * Require that the authenticated admin has access to a module.
 * Super admins (role === 'super_admin') bypass all checks.
 *
 * @param {string} moduleKey - The module permission key to check
 */
const requireModuleAccess = (moduleKey) => (req, res, next) => {
  try {
    const admin = req.admin || req.user;

    if (!admin) {
      const error = new Error('ADMIN_NOT_AUTHENTICATED');
      error.status = getHttpStatus('UNAUTHORIZED');
      error.message = 'Admin authentication required';
      return next(error);
    }

    // Super admins have full access
    if (admin.role === 'super_admin') return next();

    const { permissions } = admin;
    if (!permissions || typeof permissions !== 'object') {
      const error = new Error('INSUFFICIENT_PERMISSIONS');
      error.status = getHttpStatus('FORBIDDEN');
      error.message = 'Insufficient admin permissions';
      return next(error);
    }

    if (!isModuleAllowed(permissions[moduleKey])) {
      const error = new Error('INSUFFICIENT_PERMISSIONS');
      error.status = getHttpStatus('FORBIDDEN');
      error.message = 'Insufficient admin permissions';
      return next(error);
    }

    return next();
  } catch (error) {
    error.status = error.status || getHttpStatus('FORBIDDEN');
    error.message = error.message || 'Admin permission check failed';
    return next(error);
  }
};

export default requireModuleAccess;
