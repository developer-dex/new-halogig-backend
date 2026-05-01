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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - project_title
 *             properties:
 *               project_title:
 *                 type: string
 *                 minLength: 20
 *                 description: Project title (required, minimum 20 characters)
 *               project_summary:
 *                 type: string
 *                 nullable: true
 *               project_category:
 *                 type: integer
 *                 nullable: true
 *               project_sub_category:
 *                 oneOf:
 *                   - type: string
 *                   - type: array
 *                     items:
 *                       type: integer
 *               customer_industry:
 *                 type: integer
 *                 nullable: true
 *               model_engagement:
 *                 type: string
 *                 nullable: true
 *               project_amount_min:
 *                 type: number
 *                 nullable: true
 *               project_amount_max:
 *                 type: number
 *                 nullable: true
 *                 description: Must be >= project_amount_min when both are provided
 *               project_duration_min:
 *                 type: number
 *                 nullable: true
 *               project_duration_max:
 *                 type: number
 *                 nullable: true
 *               currency:
 *                 type: string
 *                 nullable: true
 *               location_preferancer:
 *                 type: string
 *                 nullable: true
 *               technologty_pre:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Project created
 *       400:
 *         description: Validation error — project_title required (min 20 chars), or project_amount_max < project_amount_min
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
 * /client-project/{id}/details:
 *   get:
 *     summary: Get client project details by ID
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Client project ID
 *     responses:
 *       200:
 *         description: Project details returned
 *       404:
 *         description: Project not found
 */

/**
 * @swagger
 * /client-project/{id}:
 *   get:
 *     summary: Get own client project by ID (owner only)
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Client project ID
 *     responses:
 *       200:
 *         description: Project returned
 *       403:
 *         description: Access denied — project belongs to another client
 *       404:
 *         description: Project not found
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
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number (defaults to 1 if not provided)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of results per page (defaults to 10 if not provided)
 *       - in: query
 *         name: model_engagement
 *         schema:
 *           type: string
 *         description: Optional filter by model engagement type
 *       - in: query
 *         name: customer_industry
 *         schema:
 *           type: string
 *         description: Optional filter by customer industry
 *       - in: query
 *         name: searchText
 *         schema:
 *           type: string
 *         description: Optional search text for project title or summary
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
 * /user/client-project/publish:
 *   patch:
 *     summary: Publish a client project
 *     tags: [Project]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - project_id
 *             properties:
 *               project_id:
 *                 type: integer
 *                 description: ID of the client project to publish
 *               is_published:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Project published successfully
 *       400:
 *         description: project_id is required
 */

/**
 * @swagger
 * /project-details-count:
 *   get:
 *     summary: Get project details with bid counts
 *     tags: [Project]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number (defaults to 1 if not provided)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of results per page (defaults to 10 if not provided)
 *       - in: query
 *         name: model_engagement
 *         schema:
 *           type: string
 *         description: Optional filter by model engagement type
 *     responses:
 *       200:
 *         description: Projects with bid statistics
 */
