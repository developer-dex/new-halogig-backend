/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: Blog management (admin) and public blog access
 */

/**
 * @swagger
 * /admin/blog:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string }
 *               slug: { type: string }
 *               content: { type: string }
 *               image: { type: string, format: binary }
 *               thumbnail_image: { type: string, format: binary }
 *     responses:
 *       201: { description: Blog created }
 *       401: { description: Unauthorized - admin token required }
 */

/**
 * @swagger
 * /admin/blogs:
 *   get:
 *     summary: Get all blogs (paginated)
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: List of blogs }
 */

/**
 * @swagger
 * /admin/blog/{id}:
 *   delete:
 *     summary: Delete a blog post by ID
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Blog ID
 *     responses:
 *       200: { description: Blog deleted successfully }
 *       401: { description: Unauthorized - admin token required }
 *       404: { description: Blog not found }
 */

/**
 * @swagger
 * /blog/{blog_slug}:
 *   get:
 *     summary: Get a public blog by slug
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: blog_slug
 *         required: true
 *         schema: { type: string }
 *         description: Blog slug (only alphanumeric, hyphens, and underscores allowed)
 *     responses:
 *       200: { description: Blog details }
 *       400: { description: Invalid slug (contains only special characters) }
 *       404: { description: Blog not found }
 */
