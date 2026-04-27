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
 *         description: Education list
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
 *     summary: Get all sub-categories (public)
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Sub-category list
 */
