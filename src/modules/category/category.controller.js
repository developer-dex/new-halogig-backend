import asyncHandler from '../../utils/asyncHandler';
import getHttpStatus from '../../utils/httpStatus';
import categoryService from './category.service';

// ---- Categories ----
const getCategories = asyncHandler(async (req, res) => {
  const result = await categoryService.getAllCategories(req.query);
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

const createCategory = asyncHandler(async (req, res) => {
  const result = await categoryService.createCategory(req.body);
  return res.status(getHttpStatus('CREATED')).json({ success: true, data: result, message: 'Category created' });
});

const updateCategory = asyncHandler(async (req, res) => {
  const result = await categoryService.updateCategory(req.params.id, req.body);
  if (!result) return res.status(getHttpStatus('NOT_FOUND')).json({ success: false, data: null, message: 'Category not found' });
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: 'Category updated' });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const result = await categoryService.deleteCategory(req.params.id);
  if (!result) return res.status(getHttpStatus('NOT_FOUND')).json({ success: false, data: null, message: 'Category not found' });
  return res.status(getHttpStatus('OK')).json({ success: true, data: null, message: 'Category deleted' });
});

// ---- SubCategories ----
const getSubCategories = asyncHandler(async (req, res) => {
  const result = await categoryService.getAllSubCategories(req.query);
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

const createSubCategory = asyncHandler(async (req, res) => {
  const result = await categoryService.createSubCategory(req.body);
  return res.status(getHttpStatus('CREATED')).json({ success: true, data: result, message: 'Sub-category created' });
});

const updateSubCategory = asyncHandler(async (req, res) => {
  const result = await categoryService.updateSubCategory(req.params.id, req.body);
  if (!result) return res.status(getHttpStatus('NOT_FOUND')).json({ success: false, data: null, message: 'Sub-category not found' });
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: 'Sub-category updated' });
});

const deleteSubCategory = asyncHandler(async (req, res) => {
  const result = await categoryService.deleteSubCategory(req.params.id);
  if (!result) return res.status(getHttpStatus('NOT_FOUND')).json({ success: false, data: null, message: 'Sub-category not found' });
  return res.status(getHttpStatus('OK')).json({ success: true, data: null, message: 'Sub-category deleted' });
});

// ---- Technologies ----
const getTechnologies = asyncHandler(async (req, res) => {
  const result = await categoryService.getAllTechnologies(req.query);
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

const createTechnology = asyncHandler(async (req, res) => {
  const result = await categoryService.createTechnology(req.body);
  return res.status(getHttpStatus('CREATED')).json({ success: true, data: result, message: 'Technology created' });
});

const updateTechnology = asyncHandler(async (req, res) => {
  const result = await categoryService.updateTechnology(req.params.id, req.body);
  if (!result) return res.status(getHttpStatus('NOT_FOUND')).json({ success: false, data: null, message: 'Technology not found' });
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: 'Technology updated' });
});

const deleteTechnology = asyncHandler(async (req, res) => {
  const result = await categoryService.deleteTechnology(req.params.id);
  if (!result) return res.status(getHttpStatus('NOT_FOUND')).json({ success: false, data: null, message: 'Technology not found' });
  return res.status(getHttpStatus('OK')).json({ success: true, data: null, message: 'Technology deleted' });
});

// ---- Lookups ----
const getAllCategoriesLookup = asyncHandler(async (req, res) => {
  const result = await categoryService.getAllCategories();
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

const getSubCategoriesByCategoryId = asyncHandler(async (req, res) => {
  const result = await categoryService.getSubCategoriesByCategoryId(req.params.categoryId);
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

export default {
  getCategories, createCategory, updateCategory, deleteCategory,
  getSubCategories, createSubCategory, updateSubCategory, deleteSubCategory,
  getTechnologies, createTechnology, updateTechnology, deleteTechnology,
  getAllCategoriesLookup, getSubCategoriesByCategoryId,
};
