import type { Request, Response } from 'express'
import mongoose from 'mongoose'
import { asyncHandler } from '../../utils/asyncHandler'
import { ApiError } from '../../utils/ApiError'
import {
  clearDatabase,
  createResource,
  deleteResource,
  getResourceByQuery,
  listResources,
  type ListResourcesOptions,
  provisionResource,
  replaceResource,
  updateBasicInfo,
  updateProjectDetails,
} from './resource.service'

const parseResourceQuery = (value: string) => {
  const numeric = Number(value)
  if (Number.isInteger(numeric) && numeric > 0) {
    return { resourceId: numeric }
  }
  if (mongoose.Types.ObjectId.isValid(value)) {
    return { _id: value }
  }
  throw new ApiError(400, 'Resource id must be a positive number or ObjectId')
}

const parsePositiveInt = (
  raw: unknown,
  fallback: number,
  fieldName: string,
) => {
  if (raw === undefined) {
    return fallback
  }
  const value = Number(raw)
  if (!Number.isInteger(value) || value <= 0) {
    throw new ApiError(400, `${fieldName} must be a positive integer`)
  }
  return value
}

const parseSortOrder = (raw: unknown): 'asc' | 'desc' => {
  if (raw === undefined) {
    return 'desc'
  }
  if (raw === 'asc' || raw === 'desc') {
    return raw
  }
  throw new ApiError(400, 'sortOrder must be one of: asc, desc')
}

const parseStatusFilter = (raw: unknown): 'draft' | 'completed' | undefined => {
  if (raw === undefined || raw === '') {
    return undefined
  }
  if (raw === 'draft' || raw === 'completed') {
    return raw
  }
  throw new ApiError(400, 'status must be one of: draft, completed')
}

export const listResourcesHandler = asyncHandler(async (req: Request, res: Response) => {
  const page = parsePositiveInt(req.query.page, 1, 'page')
  const pageSize = parsePositiveInt(req.query.pageSize, 10, 'pageSize')
  const sortOrder = parseSortOrder(req.query.sortOrder)
  const status = parseStatusFilter(req.query.status)
  const name = typeof req.query.name === 'string' ? req.query.name : undefined

  const options: ListResourcesOptions = {
    page,
    pageSize: Math.min(pageSize, 100),
    sortOrder,
    status,
    name,
  }

  const result = await listResources(options)
  res.json(result)
})

export const getResourceHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.params.id) {
    throw new ApiError(400, 'Resource id is required')
  }
  const query = parseResourceQuery(req.params.id)
  const resource = await getResourceByQuery(query)
  res.json(resource)
})

export const createResourceHandler = asyncHandler(async (req: Request, res: Response) => {
  const { resourceName } = req.body as { resourceName?: string }
  if (!resourceName) {
    throw new ApiError(400, 'resourceName is required')
  }
  const resource = await createResource(resourceName)
  res.status(201).json(resource)
})

export const updateBasicInfoHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.params.id) {
    throw new ApiError(400, 'Resource id is required')
  }
  const query = parseResourceQuery(req.params.id)
  const resource = await updateBasicInfo(query, req.body ?? {})
  res.json(resource)
})

export const updateProjectDetailsHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.params.id) {
    throw new ApiError(400, 'Resource id is required')
  }
  const query = parseResourceQuery(req.params.id)
  const resource = await updateProjectDetails(query, req.body ?? {})
  res.json(resource)
})

export const provisionResourceHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.params.id) {
    throw new ApiError(400, 'Resource id is required')
  }

  const query = parseResourceQuery(req.params.id)
  const resource = await provisionResource(query)
  res.json(resource.resource)
})

export const replaceResourceHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.params.id) {
    throw new ApiError(400, 'Resource id is required')
  }
  const query = parseResourceQuery(req.params.id)
  const resource = await replaceResource(query, req.body)
  res.json(resource)
})

export const deleteResourceHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.params.id) {
    throw new ApiError(400, 'Resource id is required')
  }
  const query = parseResourceQuery(req.params.id)
  const resource = await deleteResource(query)
  res.json(resource)
})

export const clearDatabaseHandler = asyncHandler(async (_req: Request, res: Response) => {
  await clearDatabase()
  res.json({ message: 'Database cleared successfully' })
})
