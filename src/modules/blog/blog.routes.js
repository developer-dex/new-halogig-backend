import { Router } from 'express';
import blogController from './blog.controller';
import validate from '../../middlewares/validate.middleware';
import blogValidation from './blog.validation';
import adminAuthMiddleware from '../../middlewares/adminAuth.middleware';
import fileUpload from '../../middlewares/fileUpload.middleware';

const router = Router();

// Admin routes
router.post('/admin/blog', adminAuthMiddleware, fileUpload.uploadBlogImage, validate(blogValidation.createBlog), blogController.createBlog);
router.get('/admin/blogs', adminAuthMiddleware, blogController.getAllBlogs);
router.get('/admin/blog/slug/:slug', adminAuthMiddleware, validate(blogValidation.slugParam), blogController.getBlogBySlug);
router.get('/admin/blog/:id', adminAuthMiddleware, validate(blogValidation.idParam), blogController.getBlogById);
router.put('/admin/blog/:id', adminAuthMiddleware, fileUpload.uploadBlogImage, blogController.updateBlog);
router.delete('/admin/blog/:id', adminAuthMiddleware, validate(blogValidation.idParam), blogController.deleteBlog);

// Public route
router.get('/blog/:blog_slug', blogController.getPublicBlogBySlug);

export default router;
