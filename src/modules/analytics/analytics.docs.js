/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Public analytics endpoints — page engagement, turnstile verification, user functions
 */

/**
 * @swagger
 * /page-wise-engagement:
 *   post:
 *     summary: Track page-wise user engagement
 *     tags: [Analytics]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ip_address: { type: string }
 *               page_url: { type: string }
 *               device_type: { type: string }
 *               time_spent: { type: number }
 *               session_id: { type: string }
 *     responses:
 *       200: { description: Engagement tracked }
 */

/**
 * @swagger
 * /verify-turnstile:
 *   post:
 *     summary: Verify Cloudflare Turnstile token
 *     tags: [Analytics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token]
 *             properties:
 *               token: { type: string }
 *     responses:
 *       200: { description: Verification result }
 */

/**
 * @swagger
 * /user-function:
 *   post:
 *     summary: Create a user function record
 *     tags: [Analytics]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ip_address: { type: string }
 *               function_name: { type: string }
 *               service_name: { type: string }
 *     responses:
 *       201: { description: User function created }
 */
