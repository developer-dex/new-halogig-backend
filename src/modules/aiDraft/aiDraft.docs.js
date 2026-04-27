/**
 * @swagger
 * tags:
 *   name: AiDraft
 *   description: AI draft and followup campaign management (proxied to AI API)
 */

/**
 * @swagger
 * /draft/campaign-names:
 *   get:
 *     summary: Get draft campaign names from AI API
 *     tags: [AiDraft]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of campaign names }
 */

/**
 * @swagger
 * /followup/start:
 *   post:
 *     summary: Start a followup campaign via AI API
 *     tags: [AiDraft]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [campaign_name]
 *             properties:
 *               campaign_name: { type: string }
 *               template: { type: string }
 *               batch_size: { type: integer }
 *     responses:
 *       200: { description: Followup started }
 */
