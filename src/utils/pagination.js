/**
 * Calculate offset and limit for Sequelize pagination.
 * @param {number|string} page
 * @param {number|string} limit
 * @returns {{ offset: number, parsedLimit: number }}
 */
export const calculatePagination = (page, limit) => {
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const offset = (parsedPage - 1) * parsedLimit;
  return { offset, parsedLimit };
};

export default calculatePagination;
