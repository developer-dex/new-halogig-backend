/**
 * Wraps an async route handler to catch errors and forward them to Express error middleware.
 * Eliminates repetitive try-catch blocks in every controller method.
 *
 * @param {Function} fn - Async route handler (req, res, next)
 * @returns {Function} Express middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
