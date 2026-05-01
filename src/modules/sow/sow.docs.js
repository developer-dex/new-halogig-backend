/**
 * @swagger
 * tags:
 *   name: SOW
 *   description: Statement of Work management
 */

/**
 * @swagger
 * /sow:
 *   post:
 *     summary: Create or update a SOW with milestones
 *     tags: [SOW]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - project_leads_id
 *             properties:
 *               id:
 *                 type: integer
 *                 nullable: true
 *                 description: If provided, updates existing SOW instead of creating new
 *               project_leads_id:
 *                 type: integer
 *                 description: The project lead ID (required)
 *               status:
 *                 type: string
 *                 nullable: true
 *               milestones:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     hours:
 *                       type: number
 *                       nullable: true
 *                     scope:
 *                       type: string
 *                       nullable: true
 *                     amount:
 *                       type: number
 *                       nullable: true
 *     responses:
 *       200:
 *         description: SOW created/updated
 *       400:
 *         description: Bad request — missing required fields (e.g. project_leads_id)
 *       401:
 *         description: Unauthorized — missing or invalid auth token
 *   get:
 *     summary: Get all SOWs
 *     tags: [SOW]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: SOW list
 */

/**
 * @swagger
 * /sow/{id}:
 *   get:
 *     summary: Get SOW detail with inputs and milestones
 *     tags: [SOW]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: SOW detail
 *       403:
 *         description: Forbidden — SOW does not belong to the authenticated user
 *       401:
 *         description: Unauthorized — missing or invalid auth token
 *   delete:
 *     summary: Delete a SOW
 *     tags: [SOW]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: SOW deleted
 *       403:
 *         description: Forbidden — SOW does not belong to the authenticated user
 *       401:
 *         description: Unauthorized — missing or invalid auth token
 */

/**
 * @swagger
 * /user/sow:
 *   get:
 *     summary: Get current user's SOWs
 *     tags: [SOW]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User SOW list
 */
