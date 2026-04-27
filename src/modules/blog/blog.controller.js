import asyncHandler from '../../utils/asyncHandler';
import getHttpStatus from '../../utils/httpStatus';
import getMessage from '../../utils/message';
import blogService from './blog.service';

const createBlog = asyncHandler(async (req, res) => {
  const result = await blogService.createBlog(req.body, req.files);
  return res.status(getHttpStatus('CREATED')).json({
    success: true,
    data: result,
    message: getMessage(req, false, 'Blog created successfully'),
  });
});

const getAllBlogs = asyncHandler(async (req, res) => {
  const result = await blogService.getAllBlogs(req.query);
  return res.status(getHttpStatus('OK')).json({
    success: true,
    data: result,
    message: getMessage(req, false, ''),
  });
});

const getBlogBySlug = asyncHandler(async (req, res) => {
  const result = await blogService.getBlogBySlug(req.params.slug);
  if (!result) {
    return res.status(getHttpStatus('NOT_FOUND')).json({ success: false, data: null, message: 'Blog not found' });
  }
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

const getBlogById = asyncHandler(async (req, res) => {
  const result = await blogService.getBlogById(req.params.id);
  if (!result) {
    return res.status(getHttpStatus('NOT_FOUND')).json({ success: false, data: null, message: 'Blog not found' });
  }
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

const updateBlog = asyncHandler(async (req, res) => {
  const result = await blogService.updateBlog(req.params.id, req.body, req.files);
  if (!result) {
    return res.status(getHttpStatus('NOT_FOUND')).json({ success: false, data: null, message: 'Blog not found' });
  }
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: 'Blog updated successfully' });
});

const deleteBlog = asyncHandler(async (req, res) => {
  const result = await blogService.deleteBlog(req.params.id);
  if (!result) {
    return res.status(getHttpStatus('NOT_FOUND')).json({ success: false, data: null, message: 'Blog not found' });
  }
  return res.status(getHttpStatus('OK')).json({ success: true, data: null, message: 'Blog deleted successfully' });
});

const getPublicBlogBySlug = asyncHandler(async (req, res) => {
  const result = await blogService.getBlogBySlug(req.params.blog_slug);
  if (!result) {
    return res.status(getHttpStatus('NOT_FOUND')).json({ success: false, data: null, message: 'Blog not found' });
  }
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

export default {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  getBlogById,
  updateBlog,
  deleteBlog,
  getPublicBlogBySlug,
};
