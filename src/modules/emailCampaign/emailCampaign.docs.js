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
 *       200:
 *         description: List of email campaigns (returns empty list on error)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 campaigns:
 *                   type: array
 *                   items:
 *                     type: object
 *                 total_count:
 *                   type: integer
 *       401: { description: Unauthorized — missing or invalid admin token }
 */
