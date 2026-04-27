import jwtUtil from '../utils/jwt';
import getHttpStatus from '../utils/httpStatus';
import getMessage from '../utils/message';

/**
 * Combined authentication middleware — supports both admin and user tokens.
 * Tries admin token first, then user token.
 * Sets req.admin for admins, req.user for regular users.
 */
const combinedAuthMiddleware = async (req, res, next) => {
  try {
    if (!req.headers || !req.headers.authorization) {
      const error = new Error('TOKEN_NOT_FOUND');
      error.status = getHttpStatus('UNAUTHORIZED');
      error.message = getMessage(req, false, 'UNAUTHORIZED_USER_ACCESS');
      return next(error);
    }

    const parts = req.headers.authorization.split(' ');
    if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) {
      const error = new Error('TOKEN_BAD_FORMAT');
      error.status = getHttpStatus('UNAUTHORIZED');
      error.message = getMessage(req, false, 'SESSION_EXPIRE');
      return next(error);
    }

    const token = parts[1];

    // Try admin token first
    try {
      const { verifyAdminToken } = await import('../modules/adminAuth/adminAuth.service');
      const admin = await verifyAdminToken(token);
      if (admin) {
        req.admin = admin;
        return next();
      }
    } catch (adminError) {
      // Admin token failed, try user token
    }

    // Try user token
    try {
      const decoded = jwtUtil.verifyToken(token);
      if (decoded) {
        req.user = decoded;
        return next();
      }
    } catch (userError) {
      // Both failed
    }

    const error = new Error('INVALID_TOKEN');
    error.status = getHttpStatus('UNAUTHORIZED');
    error.message = getMessage(req, false, 'UNAUTHORIZED_USER_ACCESS');
    return next(error);
  } catch (error) {
    error.status = getHttpStatus('UNAUTHORIZED');
    return next(error);
  }
};

export default combinedAuthMiddleware;
