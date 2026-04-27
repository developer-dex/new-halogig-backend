/**
 * @swagger
 * tags:
 *   name: WebRotData
 *   description: Web rot data management (admin)
 */

/**
 * @swagger
 * /admin/web-rot-data:
 *   get:
 *     summary: Get all web rot data with filters and pagination
 *     tags: [WebRotData]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: serviceName
 *         schema: { type: string }
 *       - in: query
 *         name: industry
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *     responses:
 *       200: { description: Web rot data list }
 */

/**
 * @swagger
 * /admin/web-rot-data/unique-industries:
 *   get:
 *     summary: Get unique industries
 *     tags: [WebRotData]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of unique industries }
 */

/**
 * @swagger
 * /admin/web-rot-data/unique-slug-links:
 *   get:
 *     summary: Get unique slug links
 *     tags: [WebRotData]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of unique slug links }
 */
