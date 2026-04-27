import { Blog } from '../../models';
import { calculatePagination } from '../../utils/pagination';
import env from '../../config/env';

const BACKEND_BASE_URL = env.app.baseUrl;

/**
 * Create a new blog post with optional image uploads.
 */
const createBlog = async (data, files) => {
  const blogData = { ...data };
  if (files) {
    if (files.image && files.image[0]) blogData.image = files.image[0].filename;
    if (files.thumbnail_image && files.thumbnail_image[0]) blogData.thumbnail_image = files.thumbnail_image[0].filename;
  }
  const blog = await Blog.create(blogData);
  return blog;
};

/**
 * Get all blogs with pagination.
 */
const getAllBlogs = async (query) => {
  const { page, limit } = query;
  const { offset, parsedLimit } = calculatePagination(page, limit);
  const { count, rows } = await Blog.findAndCountAll({
    order: [['createdAt', 'DESC']],
    offset,
    limit: parsedLimit,
  });
  return { total: count, blogs: rows, page: Number(page) || 1, limit: parsedLimit };
};

/**
 * Get a single blog by slug with full image URLs.
 */
const getBlogBySlug = async (slug) => {
  const sanitizedSlug = slug.replace(/[^a-zA-Z0-9-_]/g, '');
  const blog = await Blog.findOne({ where: { slug: sanitizedSlug } });
  if (!blog) return null;
  const blogData = blog.toJSON();
  if (blogData.image) blogData.imageUrl = `${BACKEND_BASE_URL}/blogImages/${blogData.image}`;
  if (blogData.thumbnail_image) blogData.thumbnailUrl = `${BACKEND_BASE_URL}/blogThumbnails/${blogData.thumbnail_image}`;
  return blogData;
};

/**
 * Get a single blog by ID.
 */
const getBlogById = async (id) => {
  const blog = await Blog.findByPk(id);
  return blog;
};

/**
 * Update a blog post, optionally replacing images.
 */
const updateBlog = async (id, data, files) => {
  const blog = await Blog.findByPk(id);
  if (!blog) return null;
  const updateData = { ...data };
  if (files) {
    if (files.image && files.image[0]) updateData.image = files.image[0].filename;
    if (files.thumbnail_image && files.thumbnail_image[0]) updateData.thumbnail_image = files.thumbnail_image[0].filename;
  }
  await blog.update(updateData);
  return blog;
};

/**
 * Delete a blog post by ID.
 */
const deleteBlog = async (id) => {
  const blog = await Blog.findByPk(id);
  if (!blog) return null;
  await blog.destroy();
  return blog;
};

export default {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  getBlogById,
  updateBlog,
  deleteBlog,
};
