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
 *       409:
 *         description: Already submitted a bid — freelancer has already bid on this project
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
 *           minimum: 1
 *           default: 1
 *         description: Page number (minimum 1, defaults to 1 if invalid or missing)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Items per page (minimum 1, maximum 100, defaults to 10 if invalid or missing)
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
 * /freelancer/bids/{id}:
 *   get:
 *     summary: Get freelancer bid detail by ID (owner only)
 *     tags: [Bid]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Bid ID
 *     responses:
 *       200:
 *         description: Bid detail returned successfully
 *       400:
 *         description: Bid not found
 *       403:
 *         description: Access denied — bid belongs to a different freelancer
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
 *     summary: Freelancer sends milestone to client (must own the milestone's bid)
 *     tags: [Bid]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               freelancer_remarks:
 *                 type: string
 *     responses:
 *       200:
 *         description: Milestone sent to client
 *       403:
 *         description: Access denied — caller does not own this milestone
 *       404:
 *         description: Milestone not found
 */
