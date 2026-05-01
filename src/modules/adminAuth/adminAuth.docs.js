/**
 * @swagger
 * tags:
 *   name: AdminAuth
 *   description: Admin authentication, 2FA, and admin CRUD management
 */

/**
 * @swagger
 * /admin/auth/login:
 *   post:
 *     summary: Admin login (sends 2FA OTP)
 *     tags: [AdminAuth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent to email
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /admin/verify-otp:
 *   post:
 *     summary: Verify 2FA OTP and complete login
 *     tags: [AdminAuth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *     responses:
 *       200:
 *         description: Login successful with JWT token
 *       400:
 *         description: Invalid or expired OTP
 */

/**
 * @swagger
 * /admin/auth/profile:
 *   get:
 *     summary: Get current admin profile
 *     tags: [AdminAuth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Admin profile
 */

/**
 * @swagger
 * /admin/auth/change-password:
 *   post:
 *     summary: Change admin password
 *     tags: [AdminAuth]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Password changed
 */

/**
 * @swagger
 * /admin/auth/create:
 *   post:
 *     summary: Create a new admin
 *     tags: [AdminAuth]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [super_admin, admin, moderator]
 *               permissions:
 *                 type: object
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin created
 */

/**
 * @swagger
 * /admin/auth/admins:
 *   get:
 *     summary: Get all admins (paginated)
 *     tags: [AdminAuth]
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of admins
 */

/**
 * @swagger
 * /admin/auth/admins/{adminId}:
 *   get:
 *     summary: Get admin by ID
 *     tags: [AdminAuth]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: adminId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Admin details
 *   put:
 *     summary: Update admin
 *     tags: [AdminAuth]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: adminId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Admin updated
 *   delete:
 *     summary: Delete admin
 *     tags: [AdminAuth]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: adminId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Admin deleted
 */
