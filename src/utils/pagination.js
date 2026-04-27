/**
 * Calculate offset and limit for Sequelize pagination.
 * @param {number|string} page
 * @param {number|string} limit
 * @returns {{ offset: number, parsedLimit: number }}
 */
export const calculatePagination = (page, limit) => {
  const parsedPage = Number(page) || 1;
  const parsedLimit = Number(limit) || 10;
  const offset = (parsedPage - 1) * parsedLimit;
  return { offset, parsedLimit };
};

export default calculatePagination;
