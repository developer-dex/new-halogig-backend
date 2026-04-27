/**
 * @swagger
 * tags:
 *   name: CategoryManagement
 *   description: Category, sub-category, and technology management (admin)
 */

/**
 * @swagger
 * /admin/category-management/categories:
 *   get:
 *     summary: Get all categories (paginated)
 *     tags: [CategoryManagement]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of categories }
 *   post:
 *     summary: Create a new category
 *     tags: [CategoryManagement]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *     responses:
 *       201: { description: Category created }
 */

/**
 * @swagger
 * /admin/category-management/sub-categories:
 *   get:
 *     summary: Get all sub-categories (paginated)
 *     tags: [CategoryManagement]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of sub-categories }
 */

/**
 * @swagger
 * /admin/category-management/technologies:
 *   get:
 *     summary: Get all technologies (paginated)
 *     tags: [CategoryManagement]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of technologies }
 */
