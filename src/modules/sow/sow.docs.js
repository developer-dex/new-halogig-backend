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
 *     responses:
 *       200:
 *         description: SOW created/updated
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
