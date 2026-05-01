/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication - signup, login, OTP, OAuth, password reset
 */

/**
 * @swagger
 * /user/create-user:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, firstName, lastName]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               mobile:
 *                 type: string
 *               firstName:
 *                 type: string
 *                 maxLength: 255
 *                 description: Must not exceed 255 characters
 *               lastName:
 *                 type: string
 *               password:
 *                 type: string
 *               register_as:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created
 *       400:
 *         description: Bad request — firstName exceeds 255 characters, or user already exists
 */

/**
 * @swagger
 * /user/check-user-exist:
 *   post:
 *     summary: Check if user exists and send OTP
 *     tags: [Auth]
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
 *               mobile:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
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
 *               password:
 *                 type: string
 *                 maxLength: 128
 *                 description: Password must not exceed 128 characters
 *               login_as:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Bad request — missing or oversized password (> 128 chars), or invalid credentials
 */

/**
 * @swagger
 * /user/otp-verify:
 *   put:
 *     summary: Verify OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [otp, email]
 *             properties:
 *               otp:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset email
 *     tags: [Auth]
 *     description: >
 *       Always returns 200 with a generic message regardless of whether the
 *       email address is registered. This prevents email enumeration attacks.
 *       If the email is registered, a password reset link is sent to that address.
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
 *     responses:
 *       200:
 *         description: >
 *           Generic success response — returned for both registered and
 *           unregistered email addresses to prevent email enumeration.
 */

/**
 * @swagger
 * /auth/set-new-password:
 *   post:
 *     summary: Set new password using reset token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password]
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 */

/**
 * @swagger
 * /auth/google/url:
 *   get:
 *     summary: Get Google OAuth consent URL
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: OAuth URL
 */
