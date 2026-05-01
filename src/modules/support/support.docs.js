/**
 * @swagger
 * tags:
 *   name: Support
 *   description: Report a problem
 */

/**
 * @swagger
 * /report-problem:
 *   post:
 *     summary: Submit a report problem request
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [first_name, last_name, mobile_number, email, message]
 *             properties:
 *               first_name:
 *                 type: string
 *                 maxLength: 255
 *               last_name:
 *                 type: string
 *                 maxLength: 255
 *               mobile_number:
 *                 type: string
 *                 maxLength: 50
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 255
 *               company_name:
 *                 type: string
 *                 maxLength: 255
 *                 nullable: true
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Report problem created successfully
 *       400:
 *         description: Missing required fields (first_name, last_name, mobile_number, email, message)
 *       401:
 *         description: Unauthorized — valid JWT required
 */
