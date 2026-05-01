/**
 * @swagger
 * tags:
 *   name: WebsiteData
 *   description: Website data management (admin) and public access
 */

/**
 * @swagger
 * /admin/website-data/upload-excel:
 *   post:
 *     summary: Upload Excel file to bulk import website data
 *     tags: [WebsiteData]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               excelFile: { type: string, format: binary }
 *     responses:
 *       200: { description: Excel processed }
 */

/**
 * @swagger
 * /admin/website-data/download-excel:
 *   get:
 *     summary: Download all website data as an Excel file
 *     tags: [WebsiteData]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Excel file download
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       401: { description: Unauthorized }
 */

/**
 * @swagger
 * /admin/website-data:
 *   get:
 *     summary: Get all website data (paginated)
 *     tags: [WebsiteData]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Website data list }
 */
