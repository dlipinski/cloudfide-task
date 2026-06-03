import { Router } from 'express'
import { clearDatabaseHandler } from '../modules/resources/resource.controller'

export const adminRouter = Router()

/**
 * @swagger
 * /api/admin/database:
 *   delete:
 *     summary: Clear all application data
 *     description: |
 *       Development/administration endpoint that deletes all resources from the database.
 *       
 *       Use for local reset scenarios only.
 *     tags:
 *       - Admin
 *     responses:
 *       200:
 *         description: Database cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
adminRouter.delete('/database', clearDatabaseHandler)
