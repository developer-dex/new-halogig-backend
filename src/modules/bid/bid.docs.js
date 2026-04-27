/**
 * @swagger
 * tags:
 *   name: Bid
 *   description: Project bids, milestones, delivery tracking, candidate profiles
 */

/**
 * @swagger
 * /freelancer/bids:
 *   post:
 *     summary: Create a project bid (with optional candidate profiles and resumes)
 *     tags: [Bid]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Bid created
 *   get:
 *     summary: Get freelancer bids with pagination
 *     tags: [Bid]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paginated bid list
 */

/**
 * @swagger
 * /bid/{id}:
 *   get:
 *     summary: Get full bid detail with freelancer, client, SOW, milestones
 *     tags: [Bid]
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
 *         description: Bid detail
 */

/**
 * @swagger
 * /client/my-project:
 *   get:
 *     summary: Get client projects with bids
 *     tags: [Bid]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Client bids
 */

/**
 * @swagger
 * /freelancer/delivery-project:
 *   get:
 *     summary: Get freelancer delivery projects
 *     tags: [Bid]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Delivery projects
 */

/**
 * @swagger
 * /freelancer/milestone/{id}/send-to-client:
 *   put:
 *     summary: Freelancer sends milestone to client
 *     tags: [Bid]
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
 *         description: Milestone sent
 */
