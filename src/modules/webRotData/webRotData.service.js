import { Op } from 'sequelize';
import { WebRotData, sequelize } from '../../models';
import { calculatePagination } from '../../utils/pagination';

/**
 * Get all web rot data with pagination and filters.
 */
const getAllWebRotData = async (query) => {
  const { page, limit, serviceName, industry, slugLink, batchNo, status } = query;
  const { offset, parsedLimit } = calculatePagination(page, limit);
  const where = {};
  if (serviceName) where.service_name = serviceName;
  if (industry) where.industry = industry;
  if (slugLink) where.slug_link = slugLink;
  if (batchNo) where.batch_no = batchNo;
  if (status) where.status = status;
  const { count, rows } = await WebRotData.findAndCountAll({ where, order: [['createdAt', 'DESC']], offset, limit: parsedLimit });
  return { total: count, data: rows, page: Number(page) || 1, limit: parsedLimit };
};

/**
 * Get unique industries from web rot data.
 */
const getUniqueIndustries = async () => {
  const industries = await WebRotData.findAll({
    attributes: [[sequelize.fn('DISTINCT', sequelize.col('industry')), 'industry']],
    where: { industry: { [Op.ne]: null } },
    raw: true,
  });
  return industries.map((i) => i.industry);
};

/**
 * Get unique slug links from web rot data.
 */
const getUniqueSlugLinks = async () => {
  const slugLinks = await WebRotData.findAll({
    attributes: [[sequelize.fn('DISTINCT', sequelize.col('slug_link')), 'slug_link']],
    where: { slug_link: { [Op.ne]: null } },
    raw: true,
  });
  return slugLinks.map((s) => s.slug_link);
};

/**
 * Get active data by industry and slug.
 */
const getActiveDataByIndustryAndSlug = async (industry, slugLink) => {
  const data = await WebRotData.findAll({
    where: { industry, slug_link: slugLink, status: 'active' },
  });
  return data;
};

export default {
  getAllWebRotData,
  getUniqueIndustries,
  getUniqueSlugLinks,
  getActiveDataByIndustryAndSlug,
};
