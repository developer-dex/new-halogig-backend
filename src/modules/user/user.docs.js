/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile management - details, education, certificates, projects, thumbnails, videos
 */

/**
 * @swagger
 * /user/details:
 *   get:
 *     summary: Get user profile with all related data
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *   post:
 *     summary: Add or update ready-made app
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: App created/updated
 */

/**
 * @swagger
 * /user/registration:
 *   put:
 *     summary: Complete user registration
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Registration completed
 */

/**
 * @swagger
 * /user/profile-image:
 *   post:
 *     summary: Upload profile image
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profile_image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile image updated
 */

/**
 * @swagger
 * /user/details/education:
 *   post:
 *     summary: Add education
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Education added
 *   get:
 *     summary: Get education
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Education list (returns empty array if no records or on error)
 *       401:
 *         description: Unauthorized — missing or invalid token
 */

/**
 * @swagger
 * /user/details/certificate:
 *   post:
 *     summary: Add certificate
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Certificate added
 *   get:
 *     summary: Get certificates
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Certificate list
 *   delete:
 *     summary: Delete certificate
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Certificate deleted
 */

/**
 * @swagger
 * /user/details/professional-detail:
 *   post:
 *     summary: Add professional detail
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Professional detail added
 *   get:
 *     summary: Get professional details
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Professional detail
 */

/**
 * @swagger
 * /user/details/project:
 *   post:
 *     summary: Add user portfolio project
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Project added
 *   get:
 *     summary: Get user portfolio projects
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Project list
 */

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get all categories (public)
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Category list
 */

/**
 * @swagger
 * /sub-category:
 *   get:
 *     summary: Get all sub-categories by category_id (public)
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: category_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the parent category
 *     responses:
 *       200:
 *         description: Sub-category list
 *       400:
 *         description: category_id is required
 */

/**
 * @swagger
 * /user/readymad/publish:
 *   patch:
 *     summary: Publish a ready-made app
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the ready-made app to publish
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: App published successfully
 *       400:
 *         description: id is required
 *       404:
 *         description: App not found
 */

/**
 * @swagger
 * /user/update-details:
 *   put:
 *     summary: Update user details
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - country
 *               - city
 *               - register_as
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               register_as:
 *                 type: string
 *               aboutme:
 *                 type: string
 *               mobileNumberUpdate:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User details updated successfully
 *       400:
 *         description: Validation error — required fields missing (first_name, last_name, country, city, register_as)
 *       401:
 *         description: Unauthorized — missing or invalid token
 */
