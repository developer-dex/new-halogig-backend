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
 *               status: { type: string }
 *     responses:
 *       200: { description: Status updated }
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
