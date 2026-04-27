import jwtUtil from '../utils/jwt';
import getHttpStatus from '../utils/httpStatus';
import getMessage from '../utils/message';

/**
 * User authentication middleware.
 * Verifies JWT Bearer token and sets req.user.
 */
const authMiddleware = async (req, res, next) => {
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

    const decoded = jwtUtil.verifyToken(parts[1]);
    if (!decoded) {
      const error = new Error('TOKEN_NOT_FOUND');
      error.status = getHttpStatus('BAD_REQUEST');
      error.message = getMessage(req, false, 'UNAUTHORIZED_USER_ACCESS');
      return next(error);
    }

    req.user = decoded;
    return next();
  } catch (error) {
    error.status = getHttpStatus('UNAUTHORIZED');
    return next(error);
  }
};

/**
 * Optional auth — sets req.user if token is valid, but doesn't block if missing.
 */
const optionalAuthMiddleware = async (req, res, next) => {
  try {
    if (req.headers && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
        const decoded = jwtUtil.verifyToken(parts[1]);
        if (decoded) req.user = decoded;
      }
    }
    next();
  } catch (error) {
    // Silently continue without user
    next();
  }
};

export default authMiddleware;
export { optionalAuthMiddleware };
