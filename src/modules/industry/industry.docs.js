/**
 * @swagger
 * tags:
 *   name: Industry
 *   description: Industry management
 */

/**
 * @swagger
 * /industry:
 *   get:
 *     summary: Get all industries
 *     tags: [Industry]
 *     responses:
 *       200:
 *         description: List of industries
 *   post:
 *     summary: Create a new industry
 *     tags: [Industry]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - industry
 *             properties:
 *               industry:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, deleted, inactive]
 *     responses:
 *       200:
 *         description: Industry created
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /customerIndustry:
 *   get:
 *     summary: Get customer industries
 *     tags: [Industry]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of customer industries
 */
