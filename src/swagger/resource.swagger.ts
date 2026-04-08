// src/config/swagger/resourceSwaggerDocs.ts
export const resourceSwaggerDocs = `
/**
 * @swagger
 * tags:
 *   name: Resources
 *   description: Dynamic CRUD endpoints for any table
 */

/**
 * @swagger
 * /{resource}:
 *   get:
 *     summary: Get all records of a resource
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: resource
 *         required: true
 *         schema:
 *           type: string
 *         description: Table name
 *       - in: query
 *         name: _fields
 *         schema:
 *           type: string
 *         description: Comma-separated fields to select
 *       - in: query
 *         name: _page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: _limit
 *         schema:
 *           type: integer
 *         description: Page size for pagination
 *       - in: query
 *         name: _sort
 *         schema:
 *           type: string
 *         description: Column to sort by
 *       - in: query
 *         name: _order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Full-text search
 *       - in: query
 *         name: _expand
 *         schema:
 *           type: string
 *         description: Expand parent resource
 *       - in: query
 *         name: _embed
 *         schema:
 *           type: string
 *         description: Embed child resource
 *     responses:
 *       200:
 *         description: List of records
 *       404:
 *         description: Resource not found
 *   post:
 *     summary: Create a new record
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: resource
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Record created
 *       400:
 *         description: Invalid body
 */

/**
 * @swagger
 * /{resource}/{id}:
 *   get:
 *     summary: Get one record by ID
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: resource
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Single record
 *       404:
 *         description: Not found
 */

/**
 * @swagger
 * /{resource}/{id}:
 *   put:
 *     summary: Full update a record
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: resource
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Record updated
 *       400:
 *         description: Invalid ID or body
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /{resource}/{id}:
 *   patch:
 *     summary: Partial update a record
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: resource
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Record updated
 *       400:
 *         description: Invalid ID or body
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /{resource}/{id}:
 *   delete:
 *     summary: Delete a record
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: resource
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Record deleted
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Record not found
`;