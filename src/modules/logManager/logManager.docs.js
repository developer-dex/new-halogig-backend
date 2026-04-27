/**
 * @swagger
 * tags:
 *   name: LogManager
 *   description: Log management — view, filter, resolve, and cleanup logs
 */

/**
 * @swagger
 * /logs:
 *   get:
 *     summary: Get logs with filters and pagination
 *     tags: [LogManager]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: level
 *         schema: { type: string }
 *       - in: query
 *         name: resolved
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of logs }
 */

/**
 * @swagger
 * /logs/statistics:
 *   get:
 *     summary: Get log statistics
 *     tags: [LogManager]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Log statistics }
 */

/**
 * @swagger
 * /logs/{id}/resolve:
 *   patch:
 *     summary: Mark a log as resolved
 *     tags: [LogManager]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Log resolved }
 *       404: { description: Log not found }
 */

/**
 * @swagger
 * /logs/cleanup:
 *   delete:
 *     summary: Cleanup old logs
 *     tags: [LogManager]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: daysOld
 *         schema: { type: integer, default: 30 }
 *     responses:
 *       200: { description: Cleanup completed }
 */
