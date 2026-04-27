/**
 * @swagger
 * tags:
 *   name: EmailCampaign
 *   description: Email campaign management (route handled via admin module)
 */

/**
 * @swagger
 * /admin/email-campaigns:
 *   get:
 *     summary: Get all email campaigns (paginated)
 *     tags: [EmailCampaign]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: List of email campaigns }
 */
