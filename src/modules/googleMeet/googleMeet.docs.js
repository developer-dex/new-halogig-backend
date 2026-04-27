/**
 * @swagger
 * tags:
 *   name: GoogleMeet
 *   description: Google Meet OAuth and calendar integration
 */

/**
 * @swagger
 * /admin/google-meet/authorize:
 *   get:
 *     summary: Get Google OAuth authorization URL
 *     tags: [GoogleMeet]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Authorization URL }
 */

/**
 * @swagger
 * /admin/google-meet/generate-tokens:
 *   post:
 *     summary: Exchange authorization code for tokens
 *     tags: [GoogleMeet]
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
