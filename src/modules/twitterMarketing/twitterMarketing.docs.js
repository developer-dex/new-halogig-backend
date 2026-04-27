/**
 * @swagger
 * tags:
 *   name: TwitterMarketing
 *   description: Twitter token management and marketing
 */

/**
 * @swagger
 * /admin/twitter/save-tokens:
 *   post:
 *     summary: Save Twitter access tokens
 *     tags: [TwitterMarketing]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [access_token, access_token_secret]
 *             properties:
 *               access_token: { type: string }
 *               access_token_secret: { type: string }
 *     responses:
 *       200: { description: Tokens saved }
 */

/**
 * @swagger
 * /admin/twitter/token-details:
 *   get:
 *     summary: Get Twitter token details
 *     tags: [TwitterMarketing]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Token details }
 */
