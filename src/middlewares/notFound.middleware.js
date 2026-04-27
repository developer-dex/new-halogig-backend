import getHttpStatus from '../utils/httpStatus';

/**
 * 404 handler — catches any request that didn't match a route.
 */
const notFoundHandler = (req, res) => {
  const status = getHttpStatus('NOT_FOUND');
  res.status(status).json({
    success: false,
    data: null,
    error: { name: 'Error', message: 'Not Found' },
    message: 'Not Found',
  });
};

export default notFoundHandler;
