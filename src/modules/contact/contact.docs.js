/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Contact us form submissions
 */

/**
 * @swagger
 * /contact-us:
 *   post:
 *     summary: Submit a contact inquiry
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - mobile
 *             properties:
 *               firstName:
 *                 type: string
 *                 maxLength: 255
 *               lastName:
 *                 type: string
 *                 maxLength: 255
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 255
 *               mobile:
 *                 type: string
 *                 maxLength: 50
 *               companyName:
 *                 type: string
 *                 maxLength: 255
 *               requirements:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *                   example: Contact Created Successfully
 *       400:
 *         description: Validation error
 */
