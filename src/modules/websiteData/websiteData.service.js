import { Op } from 'sequelize';
import { WebsiteData, UserFunction, FreelancerCv, sequelize } from '../../models';
import { calculatePagination } from '../../utils/pagination';

/**
 * Process uploaded Excel file and bulk insert website data.
 */
const processExcelFile = async (filePath) => {
  const XLSX = require('xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  if (!data.length) return { inserted: 0 };
  const records = data.map((row) => ({
    service_name: row.service_name || row.serviceName || null,
    category: row.category || null,
    title: row.title || null,
    description: row.description || null,
    slug: row.slug || null,
    meta_title: row.meta_title || null,
    meta_description: row.meta_description || null,
    order: row.order || 0,
  }));
  await WebsiteData.bulkCreate(records, { ignoreDuplicates: true });
  return { inserted: records.length };
};

/**
 * Generate Excel file from all website data.
 */
const generateExcelFile = async () => {
  const XLSX = require('xlsx');
  const data = await WebsiteData.findAll({ raw: true });
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'WebsiteData');
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
};

/**
 * Get unique categories from website data.
 */
const getUniqueCategories = async () => {
  const categories = await WebsiteData.findAll({
    attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']],
    where: { category: { [Op.ne]: null } },
    raw: true,
  });
  return categories.map((c) => c.category);
};

/**
 * Get website data by category name.
 */
const getWebsiteDataByCategory = async (categoryName) => {
  const data = await WebsiteData.findAll({ where: { category: categoryName } });
  return data;
};

/**
 * Bulk update website data fields.
 */
const bulkUpdateWebsiteDataFields = async (updates) => {
  const results = [];
  for (const update of updates) {
    const { id, ...fields } = update;
    const [affectedRows] = await WebsiteData.update(fields, { where: { id } });
    results.push({ id, updated: affectedRows > 0 });
  }
  return results;
};

/**
 * Update display order of website data items.
 */
const updateOrder = async (items) => {
  const results = [];
  for (const item of items) {
    const [affectedRows] = await WebsiteData.update({ order: item.order }, { where: { id: item.id } });
    results.push({ id: item.id, updated: affectedRows > 0 });
  }
  return results;
};

/**
 * Get all unique slugs.
 */
const getWebsiteDataSlugs = async () => {
  const slugs = await WebsiteData.findAll({
    attributes: [[sequelize.fn('DISTINCT', sequelize.col('slug')), 'slug']],
    where: { slug: { [Op.ne]: null } },
    raw: true,
  });
  return slugs.map((s) => s.slug);
};

/**
 * Create a new website data record.
 */
const createWebsiteData = async (data) => {
  const record = await WebsiteData.create(data);
  return record;
};

/**
 * Get all website data with pagination.
 */
const getAllWebsiteData = async (query) => {
  const { page, limit, search, category } = query;
  const { offset, parsedLimit } = calculatePagination(page, limit);
  const where = {};
  if (search) where.title = { [Op.like]: `%${search}%` };
  if (category) where.category = category;
  const { count, rows } = await WebsiteData.findAndCountAll({ where, order: [['order', 'ASC']], offset, limit: parsedLimit });
  return { total: count, data: rows, page: Number(page) || 1, limit: parsedLimit };
};

/**
 * Get website data by ID.
 */
const getWebsiteDataById = async (id) => {
  const record = await WebsiteData.findByPk(id);
  return record;
};

/**
 * Update website data by ID.
 */
const updateWebsiteData = async (id, data) => {
  const record = await WebsiteData.findByPk(id);
  if (!record) return null;
  await record.update(data);
  return record;
};

/**
 * Update video thumbnail for website data.
 */
const updateWebsiteVideoThumbnail = async (id, file) => {
  const record = await WebsiteData.findByPk(id);
  if (!record) return null;
  await record.update({ video_thumbnail: file.filename });
  return record;
};

/**
 * Delete website data by ID.
 */
const deleteWebsiteData = async (id) => {
  const record = await WebsiteData.findByPk(id);
  if (!record) return null;
  await record.destroy();
  return record;
};

/**
 * Delete all website data (TRUNCATE).
 */
const deleteAllWebsiteData = async () => {
  await WebsiteData.destroy({ truncate: true });
  return true;
};

/**
 * Get website data by service name with UserFunction and FreelancerCv lookup.
 */
const getWebsiteDataByServiceName = async (serviceName, ipAddress) => {
  const data = await WebsiteData.findAll({ where: { service_name: serviceName } });
  let userFunction = null;
  if (ipAddress) {
    userFunction = await UserFunction.findOne({ where: { ip_address: ipAddress }, order: [['createdAt', 'DESC']] });
  }
  return { websiteData: data, userFunction };
};

/**
 * Get data by industry (public).
 */
const getDataByIndustry = async (body) => {
  const { industry, category } = body;
  const where = {};
  if (industry) where.industry = industry;
  if (category) where.category = category;
  const data = await WebsiteData.findAll({ where });
  return data;
};

export default {
  processExcelFile,
  generateExcelFile,
  getUniqueCategories,
  getWebsiteDataByCategory,
  bulkUpdateWebsiteDataFields,
  updateOrder,
  getWebsiteDataSlugs,
  createWebsiteData,
  getAllWebsiteData,
  getWebsiteDataById,
  updateWebsiteData,
  updateWebsiteVideoThumbnail,
  deleteWebsiteData,
  deleteAllWebsiteData,
  getWebsiteDataByServiceName,
  getDataByIndustry,
};
