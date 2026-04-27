import { Op } from 'sequelize';
import { LogManager, sequelize } from '../../models';
import { calculatePagination } from '../../utils/pagination';

/**
 * Get logs with filters and pagination.
 */
const getLogs = async (query) => {
  const { page, limit, level, resolved, search } = query;
  const { offset, parsedLimit } = calculatePagination(page, limit);
  const where = {};
  if (level) where.level = level;
  if (resolved !== undefined) where.resolved = resolved === 'true';
  if (search) where.message = { [Op.like]: `%${search}%` };
  const { count, rows } = await LogManager.findAndCountAll({ where, order: [['createdAt', 'DESC']], offset, limit: parsedLimit });
  return { total: count, logs: rows, page: Number(page) || 1, limit: parsedLimit };
};

/**
 * Get log statistics.
 */
const getLogStatistics = async () => {
  const total = await LogManager.count();
  const resolved = await LogManager.count({ where: { resolved: true } });
  const unresolved = await LogManager.count({ where: { resolved: false } });
  const critical = await LogManager.count({ where: { level: 'critical' } });
  return { total, resolved, unresolved, critical };
};

/**
 * Get critical errors.
 */
const getCriticalErrors = async (query) => {
  const { page, limit } = query;
  const { offset, parsedLimit } = calculatePagination(page, limit);
  const { count, rows } = await LogManager.findAndCountAll({
    where: { level: 'critical' },
    order: [['createdAt', 'DESC']], offset, limit: parsedLimit,
  });
  return { total: count, logs: rows, page: Number(page) || 1, limit: parsedLimit };
};

/**
 * Get unresolved errors.
 */
const getUnresolvedErrors = async (query) => {
  const { page, limit } = query;
  const { offset, parsedLimit } = calculatePagination(page, limit);
  const { count, rows } = await LogManager.findAndCountAll({
    where: { resolved: false },
    order: [['createdAt', 'DESC']], offset, limit: parsedLimit,
  });
  return { total: count, logs: rows, page: Number(page) || 1, limit: parsedLimit };
};

/**
 * Get logs for a specific user.
 */
const getUserLogs = async (userId, query) => {
  const { page, limit } = query;
  const { offset, parsedLimit } = calculatePagination(page, limit);
  const { count, rows } = await LogManager.findAndCountAll({
    where: { user_id: userId },
    order: [['createdAt', 'DESC']], offset, limit: parsedLimit,
  });
  return { total: count, logs: rows, page: Number(page) || 1, limit: parsedLimit };
};

/**
 * Get logs for a specific API endpoint.
 */
const getApiEndpointLogs = async (endpoint, query) => {
  const { page, limit } = query;
  const { offset, parsedLimit } = calculatePagination(page, limit);
  const { count, rows } = await LogManager.findAndCountAll({
    where: { api_endpoint: { [Op.like]: `%${decodeURIComponent(endpoint)}%` } },
    order: [['createdAt', 'DESC']], offset, limit: parsedLimit,
  });
  return { total: count, logs: rows, page: Number(page) || 1, limit: parsedLimit };
};

/**
 * Mark a log as resolved.
 */
const markLogAsResolved = async (id) => {
  const log = await LogManager.findByPk(id);
  if (!log) return null;
  await log.update({ resolved: true, resolved_at: new Date() });
  return log;
};

/**
 * Cleanup old logs (older than 30 days by default).
 */
const cleanupOldLogs = async (daysOld = 30) => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysOld);
  const deleted = await LogManager.destroy({ where: { createdAt: { [Op.lt]: cutoff } } });
  return { deleted };
};

export default {
  getLogs,
  getLogStatistics,
  getCriticalErrors,
  getUnresolvedErrors,
  getUserLogs,
  getApiEndpointLogs,
  markLogAsResolved,
  cleanupOldLogs,
};
