/**
 * @swagger
 * tags:
 *   name: LinkedInMarketing
 *   description: LinkedIn OAuth and marketing management
 */

/**
 * @swagger
 * /admin/linkedin/authorize:
 *   get:
 *     summary: Get LinkedIn OAuth authorization URL
 *     tags: [LinkedInMarketing]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Authorization URL }
 */

/**
 * @swagger
 * /admin/linkedin/generate-tokens:
 *   post:
 *     summary: Exchange authorization code for tokens
 *     tags: [LinkedInMarketing]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code]
 *             properties:
 *               code: { type: string }
 *     responses:
 *       200: { description: Tokens generated }
 */
