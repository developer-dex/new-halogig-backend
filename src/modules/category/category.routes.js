import { Router } from 'express';
import categoryController from './category.controller';
import validate from '../../middlewares/validate.middleware';
import categoryValidation from './category.validation';
import adminAuthMiddleware from '../../middlewares/adminAuth.middleware';

const router = Router();

// Category CRUD
router.get('/admin/category-management/categories', adminAuthMiddleware, categoryController.getCategories);
router.post('/admin/category-management/categories', adminAuthMiddleware, validate(categoryValidation.createCategory), categoryController.createCategory);
router.put('/admin/category-management/categories/:id', adminAuthMiddleware, validate(categoryValidation.idParam), categoryController.updateCategory);
router.delete('/admin/category-management/categories/:id', adminAuthMiddleware, validate(categoryValidation.idParam), categoryController.deleteCategory);

// SubCategory CRUD
router.get('/admin/category-management/sub-categories', adminAuthMiddleware, categoryController.getSubCategories);
router.post('/admin/category-management/sub-categories', adminAuthMiddleware, validate(categoryValidation.createSubCategory), categoryController.createSubCategory);
router.put('/admin/category-management/sub-categories/:id', adminAuthMiddleware, validate(categoryValidation.idParam), categoryController.updateSubCategory);
router.delete('/admin/category-management/sub-categories/:id', adminAuthMiddleware, validate(categoryValidation.idParam), categoryController.deleteSubCategory);

// Technology CRUD
router.get('/admin/category-management/technologies', adminAuthMiddleware, categoryController.getTechnologies);
router.post('/admin/category-management/technologies', adminAuthMiddleware, validate(categoryValidation.createTechnology), categoryController.createTechnology);
router.put('/admin/category-management/technologies/:id', adminAuthMiddleware, validate(categoryValidation.idParam), categoryController.updateTechnology);
router.delete('/admin/category-management/technologies/:id', adminAuthMiddleware, validate(categoryValidation.idParam), categoryController.deleteTechnology);

// Lookups
router.get('/admin/categories', adminAuthMiddleware, categoryController.getAllCategoriesLookup);
router.get('/admin/sub-categories/:categoryId/information', adminAuthMiddleware, validate(categoryValidation.categoryIdParam), categoryController.getSubCategoriesByCategoryId);

export default router;
