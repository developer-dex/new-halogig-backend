import logger from '../config/logger';
import getHttpStatus from '../utils/httpStatus';
import getMessage from '../utils/message';

/**
 * Safely extract error info for JSON response (avoids circular refs).
 */
const safeErrorPayload = (error) => {
  if (!error || typeof error !== 'object') {
    return { message: String(error) };
  }
  const payload = {
    name: error.name,
    message: error.message,
  };
  if (error.status != null) payload.status = error.status;
  if (process.env.NODE_ENV !== 'production' && error.stack) {
    payload.stack = error.stack;
  }
  return payload;
};

/**
 * Global error handling middleware.
 * Must be registered AFTER all routes.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    logger.error(`Error after response started ${req.method} ${req.originalUrl}: ${error}`);
    return;
  }

  const internalError = getHttpStatus('INTERNAL_SERVER_ERROR');
  const status = error.status || error.statusCode || internalError;

  if (!error.status || error.status === internalError) {
    logger.error(`Internal error ${new Date()} ${error}`);
  }

  const message = status === internalError
    ? getMessage(req, false, 'INTERNAL_ERROR')
    : error.message;

  res.status(status).json({
    success: false,
    data: null,
    error: safeErrorPayload(error),
    message,
  });
};

export default errorHandler;
