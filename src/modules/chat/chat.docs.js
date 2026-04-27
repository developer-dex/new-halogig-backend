/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Chat rooms, messages, Google Meet integration
 */

/**
 * @swagger
 * /admin/chat/rooms:
 *   post:
 *     summary: Create a group chat room (admin)
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, userEmails]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               userEmails:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: email
 *     responses:
 *       200:
 *         description: Chat room created
 *   get:
 *     summary: Get admin chat rooms
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Chat rooms list
 */

/**
 * @swagger
 * /user/chat/rooms:
 *   get:
 *     summary: Get user chat rooms
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User chat rooms
 */

/**
 * @swagger
 * /chat/rooms/{roomId}/messages:
 *   post:
 *     summary: Send a message (admin or user)
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               message:
 *                 type: string
 *               messageType:
 *                 type: string
 *                 enum: [text, file, image, google_meet]
 *     responses:
 *       201:
 *         description: Message sent
 */

/**
 * @swagger
 * /chat/rooms/{roomId}/meetings/google:
 *   post:
 *     summary: Create Google Meet meeting for a chat room
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Meeting created
 */
