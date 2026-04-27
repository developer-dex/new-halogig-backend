/**
 * @swagger
 * tags:
 *   name: Project
 *   description: Client projects, saved projects, project listings
 */

/**
 * @swagger
 * /client-project:
 *   post:
 *     summary: Create a client project
 *     tags: [Project]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Project created
 *   get:
 *     summary: Get user's client projects
 *     tags: [Project]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of projects
 */

/**
 * @swagger
 * /client-projects:
 *   get:
 *     summary: Public project listing with filters
 *     tags: [Project]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: searchText
 *         schema:
 *           type: string
 *       - in: query
 *         name: mainFilter
 *         schema:
 *           type: string
 *           enum: [lowToHigh, highToLow, newestFirst, oldestFirst]
 *     responses:
 *       200:
 *         description: Paginated project list
 */

/**
 * @swagger
 * /saved-project:
 *   get:
 *     summary: Get saved projects
 *     tags: [Project]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Saved projects
 *   post:
 *     summary: Save/unsave a project
 *     tags: [Project]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Project saved/unsaved
 */

/**
 * @swagger
 * /project-details-count:
 *   get:
 *     summary: Get project details with bid counts
 *     tags: [Project]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Projects with bid statistics
 */
