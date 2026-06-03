import { Router } from 'express'
import {
  createResourceHandler,
  deleteResourceHandler,
  getResourceHandler,
  listResourcesHandler,
  provisionResourceHandler,
  replaceResourceHandler,
  updateBasicInfoHandler,
  updateProjectDetailsHandler,
} from './resource.controller'

export const resourceRouter = Router()

/**
 * @swagger
 * /api/resources:
 *   get:
 *     summary: Get all resources
 *     description: |
 *       Returns resources using backend-driven filtering, sorting, and pagination.
 *       
 *       Supported query params:
 *       - `page` (default `1`)
 *       - `pageSize` (default `10`, max `100`)
 *       - `status` (`draft` or `completed`)
 *       - `name` (case-insensitive partial name match)
 *       - `sortOrder` (`desc` newest first, `asc` oldest first)
 *     tags:
 *       - Resources
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, completed]
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *           example: onboarding
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: desc
 *     responses:
 *       200:
 *         description: Resources loaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResourceListResponse'
 *       400:
 *         description: Invalid query parameter value
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
resourceRouter.get('/', listResourcesHandler)

/**
 * @swagger
 * /api/resources/{id}:
 *   get:
 *     summary: Get a resource by id
 *     description: |
 *       Loads one resource using either:
 *       - numeric resourceId (for example `1`), or
 *       - Mongo ObjectId.
 *       
 *       Returns 400 for invalid id format and 404 when the resource does not exist.
 *     tags:
 *       - Resources
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *     responses:
 *       200:
 *         description: Resource loaded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resource'
 *       400:
 *         description: Invalid id format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Resource not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
resourceRouter.get('/:id', getResourceHandler)

/**
 * @swagger
 * /api/resources:
 *   post:
 *     summary: Create a new resource
 *     description: |
 *       Creates a new resource in `draft` status.
 *       
 *       Business defaults on create:
 *       - `status = draft`
 *       - `resourceId` is auto-incremented
 *       - `basicInfo` and `projectDetails` are initialized with empty defaults
 *       - `resourceName` becomes immutable after creation
 *     tags:
 *       - Resources
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateResourceInput'
 *     responses:
 *       201:
 *         description: Resource created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resource'
 *       400:
 *         description: Validation error (for example missing resourceName)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
resourceRouter.post('/', createResourceHandler)

/**
 * @swagger
 * /api/resources/{id}/basic-info:
 *   patch:
 *     summary: Update basic info module (draft resources only)
 *     description: |
 *       Updates the Basic Info module only when resource status is `draft`.
 *       
 *       Business rule:
 *       - `resourceName` is immutable and cannot be changed after create.
 *       - Completed resources cannot be updated via module PATCH endpoints.
 *       - To edit completed resources, update in frontend memory and persist with `PUT /api/resources/{id}`.
 *     tags:
 *       - Resources
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BasicInfo'
 *     responses:
 *       200:
 *         description: Basic Info updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resource'
 *       400:
 *         description: Invalid id format or completed-resource module PATCH is not allowed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Resource not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
resourceRouter.patch('/:id/basic-info', updateBasicInfoHandler)

/**
 * @swagger
 * /api/resources/{id}/project-details:
 *   patch:
 *     summary: Update project details module (draft resources only)
 *     description: |
 *       Updates the Project Details module only when resource status is `draft`.
 *       
 *       Business rule:
 *       - Basic Info must be completed first.
 *       - Completed resources cannot be updated via module PATCH endpoints.
 *       - To edit completed resources, update in frontend memory and persist with `PUT /api/resources/{id}`.
 *     tags:
 *       - Resources
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectDetails'
 *     responses:
 *       200:
 *         description: Project Details updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resource'
 *       400:
 *         description: Invalid id format, Basic Info not completed, or completed-resource module PATCH is not allowed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Resource not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
resourceRouter.patch('/:id/project-details', updateProjectDetailsHandler)

/**
 * @swagger
 * /api/resources/{id}/provisioning:
 *   patch:
 *     summary: Mark resource as completed
 *     description: |
 *       The only endpoint that can change status.
 *       
 *       Business rule:
 *       - Allowed only when current status is `draft`.
 *       - Basic Info and Project Details must both be complete before provisioning.
 *       - `draft -> completed` is allowed.
 *       - completed resources cannot be reprovisioned.
 *     tags:
 *       - Resources
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *     responses:
 *       200:
 *         description: Provisioning result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resource'
 *       400:
 *         description: Invalid id format, completed resource reprovisioning, or incomplete modules
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Resource not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
resourceRouter.patch('/:id/provisioning', provisionResourceHandler)

/**
 * @swagger
 * /api/resources/{id}:
 *   put:
 *     summary: Replace full resource data while preserving current status
 *     description: |
 *       Replaces resource business fields in one request:
 *       - `name`
 *       - `basicInfo`
 *       - `projectDetails`
 *       
 *       Business rule:
 *       - allowed only when resource status is `completed`.
 *       - drafts cannot be replaced using this endpoint.
 *       - `name` and `basicInfo.resourceName` are immutable after create.
 *       - status is preserved and cannot be changed by this endpoint.
 *       - status transitions are handled only by `PATCH /api/resources/{id}/provisioning`.
 *     tags:
 *       - Resources
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Resource'
 *     responses:
 *       200:
 *         description: Resource replaced successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resource'
 *       400:
 *         description: Invalid id format or draft resources cannot be replaced with PUT
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Resource not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
resourceRouter.put('/:id', replaceResourceHandler)

/**
 * @swagger
 * /api/resources/{id}:
 *   delete:
 *     summary: Delete a resource
 *     description: Permanently deletes a resource by numeric resourceId or Mongo ObjectId.
 *     tags:
 *       - Resources
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *     responses:
 *       200:
 *         description: Resource deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resource'
 *       400:
 *         description: Invalid id format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Resource not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
resourceRouter.delete('/:id', deleteResourceHandler)

