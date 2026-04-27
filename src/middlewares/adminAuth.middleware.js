import getHttpStatus from '../utils/httpStatus';

/**
 * Admin authentication middleware.
 * Verifies admin JWT token via adminAuth service and sets req.admin.
 *
 * NOTE: This middleware depends on adminAuth.service which will be created
 * with the adminAuth module. For now it imports dynamically to avoid
 * circular dependency during scaffolding.
 */
const adminAuthMiddleware = async (req, res, next) => {
  try {
    if (!req.headers || !req.headers.authorization) {
      const error = new Error('TOKEN_NOT_FOUND');
      error.status = getHttpStatus('UNAUTHORIZED');
      error.message = 'Admin authorization token required';
      return next(error);
    }

    const parts = req.headers.authorization.split(' ');
    if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) {
      const error = new Error('TOKEN_BAD_FORMAT');
      error.status = getHttpStatus('UNAUTHORIZED');
      error.message = 'Format is Authorization: Bearer [token]';
      return next(error);
    }

    // Dynamic import to avoid circular deps during module-by-module build
    const { verifyAdminToken } = await import('../modules/adminAuth/adminAuth.service');
    const admin = await verifyAdminToken(parts[1]);

    if (!admin) {
      const error = new Error('INVALID_ADMIN_TOKEN');
      error.status = getHttpStatus('UNAUTHORIZED');
      error.message = 'Invalid or expired admin token';
      return next(error);
    }

    req.user = admin;
    req.admin = admin;
    return next();
  } catch (error) {
    error.status = getHttpStatus('UNAUTHORIZED');
    error.message = 'Admin authentication failed';
    return next(error);
  }
};

/**
 * Check if admin has a specific role.
 * @param {string[]} allowedRoles
 */
const requireAdminRole = (allowedRoles) => (req, res, next) => {
  if (!req.admin) {
    const error = new Error('ADMIN_NOT_AUTHENTICATED');
    error.status = getHttpStatus('UNAUTHORIZED');
    error.message = 'Admin authentication required';
    return next(error);
  }

  if (!allowedRoles.includes(req.admin.role)) {
    const error = new Error('INSUFFICIENT_PERMISSIONS');
    error.status = getHttpStatus('FORBIDDEN');
    error.message = 'Insufficient admin permissions';
    return next(error);
  }

  return next();
};

export default adminAuthMiddleware;
export { requireAdminRole };
