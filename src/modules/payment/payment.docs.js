/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: Payment gateway (Razorpay, PayPal) and transaction management
 */

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Create a payment order (Razorpay for India, PayPal otherwise)
 *     tags: [Payment]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bidId, amount]
 *             properties:
 *               bidId:
 *                 type: integer
 *               amount:
 *                 type: number
 *               milestoneId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Order created
 *       400:
 *         description: Invalid or missing amount (must be a positive number)
 *   get:
 *     summary: Get Razorpay order details
 *     tags: [Payment]
 *     parameters:
 *       - in: query
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 */

/**
 * @swagger
 * /order-status:
 *   post:
 *     summary: Verify Razorpay payment and update status
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [razorpay_order_id]
 *             properties:
 *               razorpay_order_id:
 *                 type: string
 *               razorpay_payment_id:
 *                 type: string
 *               razorpay_signature:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment status updated
 */

/**
 * @swagger
 * /user-order:
 *   get:
 *     summary: Get all transactions for current user
 *     tags: [Payment]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions
 */

/**
 * @swagger
 * /transaction-status:
 *   get:
 *     summary: Get transaction status
 *     tags: [Payment]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction status
 */

/**
 * @swagger
 * /paypal/webhook:
 *   post:
 *     summary: PayPal webhook endpoint
 *     tags: [Payment]
 *     responses:
 *       200:
 *         description: Webhook processed
 */
