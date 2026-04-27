import httpStatus from 'http-status';

/**
 * Get HTTP status code by name.
 * Wraps the http-status library for convenience.
 *
 * @param {string} status - Status name (e.g. 'OK', 'BAD_REQUEST', 'UNAUTHORIZED')
 * @returns {number} HTTP status code
 */
const getHttpStatus = (status) => httpStatus[status];

export default getHttpStatus;
