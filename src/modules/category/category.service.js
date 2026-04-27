import { Op } from 'sequelize';
import { Category, SubCategory, Technology } from '../../models';
import { calculatePagination } from '../../utils/pagination';

// ---- Categories ----
const getAllCategories = async (query) => {
  const { page, limit, search } = query || {};
  if (page || limit) {
    const { offset, parsedLimit } = calculatePagination(page, limit);
    const where = {};
    if (search) where.name = { [Op.like]: `%${search}%` };
    const { count, rows } = await Category.findAndCountAll({ where, order: [['name', 'ASC']], offset, limit: parsedLimit });
    return { total: count, data: rows, page: Number(page) || 1, limit: parsedLimit };
  }
  return Category.findAll({ order: [['name', 'ASC']] });
};

const createCategory = async (data) => Category.create(data);

const updateCategory = async (id, data) => {
  const cat = await Category.findByPk(id);
  if (!cat) return null;
  await cat.update(data);
  return cat;
};

const deleteCategory = async (id) => {
  const cat = await Category.findByPk(id);
  if (!cat) return null;
  await cat.destroy();
  return cat;
};

// ---- SubCategories ----
const getAllSubCategories = async (query) => {
  const { page, limit, search } = query || {};
  if (page || limit) {
    const { offset, parsedLimit } = calculatePagination(page, limit);
    const where = {};
    if (search) where.name = { [Op.like]: `%${search}%` };
    const { count, rows } = await SubCategory.findAndCountAll({ where, order: [['name', 'ASC']], offset, limit: parsedLimit });
    return { total: count, data: rows, page: Number(page) || 1, limit: parsedLimit };
  }
  return SubCategory.findAll({ order: [['name', 'ASC']] });
};

const createSubCategory = async (data) => SubCategory.create(data);

const updateSubCategory = async (id, data) => {
  const sub = await SubCategory.findByPk(id);
  if (!sub) return null;
  await sub.update(data);
  return sub;
};

const deleteSubCategory = async (id) => {
  const sub = await SubCategory.findByPk(id);
  if (!sub) return null;
  await sub.destroy();
  return sub;
};

// ---- Technologies ----
const getAllTechnologies = async (query) => {
  const { page, limit, search } = query || {};
  if (page || limit) {
    const { offset, parsedLimit } = calculatePagination(page, limit);
    const where = {};
    if (search) where.name = { [Op.like]: `%${search}%` };
    const { count, rows } = await Technology.findAndCountAll({ where, order: [['name', 'ASC']], offset, limit: parsedLimit });
    return { total: count, data: rows, page: Number(page) || 1, limit: parsedLimit };
  }
  return Technology.findAll({ order: [['name', 'ASC']] });
};

const createTechnology = async (data) => Technology.create(data);

const updateTechnology = async (id, data) => {
  const tech = await Technology.findByPk(id);
  if (!tech) return null;
  await tech.update(data);
  return tech;
};

const deleteTechnology = async (id) => {
  const tech = await Technology.findByPk(id);
  if (!tech) return null;
  await tech.destroy();
  return tech;
};

// ---- Lookups ----
const getSubCategoriesByCategoryId = async (categoryId) => {
  const subs = await SubCategory.findAll({ where: { category_id: categoryId }, order: [['name', 'ASC']] });
  return subs;
};

export default {
  getAllCategories, createCategory, updateCategory, deleteCategory,
  getAllSubCategories, createSubCategory, updateSubCategory, deleteSubCategory,
  getAllTechnologies, createTechnology, updateTechnology, deleteTechnology,
  getSubCategoriesByCategoryId,
};
