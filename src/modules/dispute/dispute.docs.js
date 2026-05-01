/**
 * @swagger
 * tags:
 *   name: Dispute
 *   description: Dispute management endpoints
 */

/**
 * @swagger
 * /dispute:
 *   post:
 *     summary: Create a dispute for a project bid
 *     tags: [Dispute]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [projectId, projectBidId, generatedBy]
 *             properties:
 *               projectId:
 *                 type: integer
 *                 description: ID of the project
 *               projectBidId:
 *                 type: integer
 *                 description: ID of the project bid (must exist)
 *               generatedBy:
 *                 type: string
 *                 enum: [freelancer, client]
 *                 description: Role of the user raising the dispute
 *               message:
 *                 type: string
 *                 nullable: true
 *                 description: Dispute message/description
 *               type:
 *                 type: string
 *                 nullable: true
 *                 description: Type of dispute
 *     responses:
 *       200:
 *         description: Dispute created successfully
 *       400:
 *         description: Missing required fields or project bid not found
 *       401:
 *         description: Unauthorized — valid JWT required
 */

/**
 * @swagger
 * /ongoing-projects:
 *   post:
 *     summary: Get ongoing projects eligible for dispute
 *     tags: [Dispute]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               generated_by:
 *                 type: string
 *                 enum: [freelancer, client]
 *                 description: Filter by role
 *     responses:
 *       200:
 *         description: List of ongoing projects
 *       401:
 *         description: Unauthorized — valid JWT required
 */

/**
 * @swagger
 * /disputes:
 *   post:
 *     summary: Get disputes for the authenticated user
 *     tags: [Dispute]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of disputes
 *       401:
 *         description: Unauthorized — valid JWT required
 */
