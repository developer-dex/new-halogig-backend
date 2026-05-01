/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management — users, projects, freelancers, billing, logs, testimonials, etc.
 */

/**
 * @swagger
 * /admin/user:
 *   get:
 *     summary: Get all users (paginated)
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: role
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of users }
 */

/**
 * @swagger
 * /admin/user/{id}/status:
 *   patch:
 *     summary: Update user status
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [incomplete, pending, approved, rejected, suspended, completed, otpVerified] }
 *     responses:
 *       200: { description: Status updated }
 *       400: { description: Invalid status value }
 *       404: { description: User not found }
 */

/**
 * @swagger
 * /admin/projects:
 *   get:
 *     summary: Get all projects (paginated)
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of projects }
 */

/**
 * @swagger
 * /admin/freelancer/{userId}/complete-data:
 *   get:
 *     summary: Get complete freelancer data
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Freelancer complete data }
 *       404: { description: Freelancer not found }
 */

/**
 * @swagger
 * /admin/freelancer-payments:
 *   get:
 *     summary: Get all freelancer payments (paginated)
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *         description: Items per page (default 10)
 *     responses:
 *       200: { description: List of freelancer payments }
 *       401: { description: Unauthorized — admin token required }
 */

/**
 * @swagger
 * /admin/logs:
 *   get:
 *     summary: Get all logs (paginated)
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *         description: Items per page (default 10)
 *     responses:
 *       200: { description: List of logs }
 *       401: { description: Unauthorized — admin token required }
 */

/**
 * @swagger
 * /admin/logs/statistics:
 *   get:
 *     summary: Get log statistics
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Log statistics }
 *       401: { description: Unauthorized — admin token required }
 */

/**
 * @swagger
 * /admin/logs/{id}:
 *   get:
 *     summary: Get a log by ID
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Log details }
 *       401: { description: Unauthorized — admin token required }
 *       404: { description: Log not found }
 */

/**
 * @swagger
 * /admin/logs/{id}/resolve:
 *   patch:
 *     summary: Resolve a log by ID
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Log resolved }
 *       401: { description: Unauthorized — admin token required }
 *       404: { description: Log not found }
 */
