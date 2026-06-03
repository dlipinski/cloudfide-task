import { ApiError } from '../../utils/ApiError'
import type {
  BasicInfo,
  ProjectDetails,
  ResourcePayload,
  ResourceStatus,
} from './resource.dto'
import { ResourceModel } from './resource.model'

type ResourceQuery = { resourceId?: number; _id?: string }

const NAME_REGEX = /^[A-Za-z0-9 -]+$/
const OWNER_REGEX = /^[A-Za-z ]+$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const INTEGER_REGEX = /^\d+$/
const PROJECT_CATEGORY_VALUES = ['internal', 'external', 'vendor'] as const
const PRIORITY_VALUES = ['low', 'medium', 'high'] as const
const TEAM_MEMBER_VALUES = [
  'FE devs',
  'BE devs',
  'Designer',
  'Data Eng',
  'Product Owner',
] as const

export interface ListResourcesOptions {
  page: number
  pageSize: number
  status?: ResourceStatus
  name?: string
  sortOrder: 'asc' | 'desc'
}

export interface ListResourcesResult {
  items: unknown[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
}

const isBasicInfoComplete = (basicInfo: BasicInfo) => {
  return Boolean(
    basicInfo.resourceName &&
      basicInfo.owner &&
      basicInfo.email &&
      basicInfo.description &&
      basicInfo.priority,
  )
}

const isProjectDetailsComplete = (projectDetails: ProjectDetails) => {
  return Boolean(
    projectDetails.projectName &&
      projectDetails.budget &&
      projectDetails.category &&
      projectDetails.options.length > 0,
  )
}

async function ensureUniqueResourceName(name: string, currentId?: string) {
  const existing = await ResourceModel.findOne({
    name: { $regex: `^${escapeRegex(name)}$`, $options: 'i' },
    ...(currentId ? { _id: { $ne: currentId } } : {}),
  })

  if (existing) {
    throw new ApiError(400, 'resourceName must be unique')
  }
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function validateResourceName(value: string) {
  const trimmed = value.trim()
  if (!trimmed) {
    throw new ApiError(400, 'resourceName is required')
  }
  if (trimmed.length > 255) {
    throw new ApiError(400, 'resourceName must be at most 255 characters long')
  }
  if (!NAME_REGEX.test(trimmed)) {
    throw new ApiError(
      400,
      'resourceName can contain only letters, numbers, spaces, and hyphens',
    )
  }
}

function validateOwner(value: string) {
  const trimmed = value.trim()
  if (!trimmed) {
    throw new ApiError(400, 'owner is required')
  }
  if (trimmed.length > 255) {
    throw new ApiError(400, 'owner must be at most 255 characters long')
  }
  if (!OWNER_REGEX.test(trimmed)) {
    throw new ApiError(
      400,
      'owner can contain only letters and spaces',
    )
  }
}

function validateEmail(value: string) {
  const trimmed = value.trim()
  if (!trimmed) {
    throw new ApiError(400, 'email is required')
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    throw new ApiError(400, 'email must be a valid email format')
  }
}

function validateDescription(value: string) {
  const trimmed = value.trim()
  if (!trimmed) {
    throw new ApiError(400, 'description is required')
  }
  if (trimmed.length > 1000) {
    throw new ApiError(400, 'description must be at most 1000 characters long')
  }
}

function validatePriority(value: string) {
  if (!PRIORITY_VALUES.includes(value as (typeof PRIORITY_VALUES)[number])) {
    throw new ApiError(400, 'priority must be one of: low, medium, high')
  }
}

function validateProjectName(value: string) {
  const trimmed = value.trim()
  if (!trimmed) {
    throw new ApiError(400, 'projectName is required')
  }
  if (trimmed.length > 255) {
    throw new ApiError(400, 'projectName must be at most 255 characters long')
  }
  if (!NAME_REGEX.test(trimmed)) {
    throw new ApiError(
      400,
      'projectName can contain only letters, numbers, spaces, and hyphens',
    )
  }
}

function validateBudget(value: string) {
  const trimmed = value.trim()
  if (!trimmed) {
    throw new ApiError(400, 'budget is required')
  }
  if (!INTEGER_REGEX.test(trimmed)) {
    throw new ApiError(400, 'budget must contain only integers')
  }
}

function validateProjectCategory(value: string) {
  if (
    !PROJECT_CATEGORY_VALUES.includes(
      value as (typeof PROJECT_CATEGORY_VALUES)[number],
    )
  ) {
    throw new ApiError(400, 'category must be one of: internal, external, vendor')
  }
}

function validateTeamMembers(values: string[]) {
  if (!Array.isArray(values) || values.length === 0) {
    throw new ApiError(400, 'At least one team member is required')
  }

  const invalid = values.find(
    (value) =>
      !TEAM_MEMBER_VALUES.includes(value as (typeof TEAM_MEMBER_VALUES)[number]),
  )
  if (invalid) {
    throw new ApiError(400, `Unsupported team member option: ${invalid}`)
  }
}

function validateBasicInfoPayload(data: Partial<BasicInfo>): asserts data is BasicInfo {
  if (
    data.resourceName === undefined ||
    data.owner === undefined ||
    data.email === undefined ||
    data.description === undefined ||
    data.priority === undefined
  ) {
    throw new ApiError(
      400,
      'resourceName, owner, email, description and priority are all required',
    )
  }

  validateResourceName(data.resourceName)
  validateOwner(data.owner)
  validateEmail(data.email)
  validateDescription(data.description)
  validatePriority(data.priority)
}

function ensureResourceNameUnchanged(resource: { name: string; basicInfo: { resourceName: string } }, nextValue: string) {
  const currentName = resource.basicInfo.resourceName.trim() || resource.name.trim()
  if (nextValue.trim() !== currentName) {
    throw new ApiError(400, 'resourceName is locked after creation and cannot be changed')
  }
}

function validateProjectDetailsPayload(
  data: Partial<ProjectDetails>,
): asserts data is ProjectDetails {
  if (
    data.projectName === undefined ||
    data.budget === undefined ||
    data.category === undefined ||
    data.options === undefined
  ) {
    throw new ApiError(
      400,
      'projectName, budget, category and options are all required',
    )
  }

  validateProjectName(data.projectName)
  validateBudget(data.budget)
  validateProjectCategory(data.category)
  validateTeamMembers(data.options)
}

async function getNextResourceId(): Promise<number> {
  const latest = await ResourceModel.findOne().sort({ resourceId: -1 }).lean()
  if (!latest?.resourceId) {
    return 1
  }
  return latest.resourceId + 1
}

export async function listResources(
  options: ListResourcesOptions,
): Promise<ListResourcesResult> {
  const filters: {
    status?: ResourceStatus
    name?: { $regex: string; $options: string }
  } = {}

  if (options.status) {
    filters.status = options.status
  }

  if (options.name?.trim()) {
    filters.name = {
      $regex: options.name.trim(),
      $options: 'i',
    }
  }

  const totalItems = await ResourceModel.countDocuments(filters)
  const totalPages = Math.max(1, Math.ceil(totalItems / options.pageSize))
  const page = Math.min(options.page, totalPages)
  const skip = (page - 1) * options.pageSize

  const items = await ResourceModel.find(filters)
    .sort({ createdAt: options.sortOrder === 'asc' ? 1 : -1 })
    .skip(skip)
    .limit(options.pageSize)
    .lean()

  return {
    items,
    pagination: {
      page,
      pageSize: options.pageSize,
      totalItems,
      totalPages,
    },
  }
}

export async function getResourceByQuery(query: ResourceQuery) {
  const resource = await ResourceModel.findOne(query).lean()
  if (!resource) {
    throw new ApiError(404, 'Resource not found')
  }
  return resource
}

export async function createResource(resourceName: string) {
  validateResourceName(resourceName)
  const normalizedName = resourceName.trim()
  await ensureUniqueResourceName(normalizedName)

  const resourceId = await getNextResourceId()
  const resource = await ResourceModel.create({
    resourceId,
    name: normalizedName,
    status: 'draft',
    basicInfo: {
      resourceName: normalizedName,
      owner: '',
      email: '',
      description: '',
      priority: '',
    },
    projectDetails: {
      projectName: '',
      budget: '',
      category: '',
      options: [],
    },
  })

  return resource.toJSON()
}

export async function updateBasicInfo(
  query: ResourceQuery,
  data: Partial<BasicInfo>,
) {
  const resource = await ResourceModel.findOne(query)
  if (!resource) {
    throw new ApiError(404, 'Resource not found')
  }
  if (resource.status === 'completed') {
    throw new ApiError(
      400,
      'Completed resources cannot be updated through module PATCH endpoints. Use PUT /api/resources/{id}.',
    )
  }

  validateBasicInfoPayload(data)
  ensureResourceNameUnchanged(resource, data.resourceName)

  resource.basicInfo = { ...resource.basicInfo, ...data }
  resource.name = resource.basicInfo.resourceName.trim()
  resource.basicInfo.resourceName = resource.basicInfo.resourceName.trim()
  resource.basicInfo.owner = data.owner.trim()
  resource.basicInfo.email = data.email.trim()
  resource.basicInfo.description = data.description.trim()
  resource.basicInfo.priority = data.priority

  await resource.save()
  return resource.toJSON()
}

export async function updateProjectDetails(
  query: ResourceQuery,
  data: Partial<ProjectDetails>,
) {
  const resource = await ResourceModel.findOne(query)
  if (!resource) {
    throw new ApiError(404, 'Resource not found')
  }
  if (resource.status === 'completed') {
    throw new ApiError(
      400,
      'Completed resources cannot be updated through module PATCH endpoints. Use PUT /api/resources/{id}.',
    )
  }
  if (!isBasicInfoComplete(resource.basicInfo)) {
    throw new ApiError(
      400,
      'Project Details can be updated only after Basic Info is completed.',
    )
  }

  validateProjectDetailsPayload(data)

  resource.projectDetails.projectName = data.projectName.trim()
  resource.projectDetails.budget = data.budget.trim()
  resource.projectDetails.category = data.category
  resource.projectDetails.options = data.options
  await resource.save()
  return resource.toJSON()
}

export async function provisionResource(query: ResourceQuery) {
  const resource = await ResourceModel.findOne(query)
  if (!resource) {
    throw new ApiError(404, 'Resource not found')
  }

  if (resource.status === 'completed') {
    throw new ApiError(400, 'Completed resource cannot be reprovisioned.')
  }

  const modulesCompleted =
    isBasicInfoComplete(resource.basicInfo) &&
    isProjectDetailsComplete(resource.projectDetails)
  if (!modulesCompleted) {
    throw new ApiError(
      400,
      'Provisioning is allowed only after Basic Info and Project Details are completed.',
    )
  }

  resource.status = 'completed'
  await resource.save()

  return {
    alreadyCompleted: false,
    resource: resource.toJSON(),
  }
}

export async function replaceResource(
  query: ResourceQuery,
  data: ResourcePayload,
) {
  const resource = await ResourceModel.findOne(query)
  if (!resource) {
    throw new ApiError(404, 'Resource not found')
  }
  if (resource.status !== 'completed') {
    throw new ApiError(
      400,
      'PUT /api/resources/{id} is allowed only for completed resources.',
    )
  }

  validateResourceName(data.name)
  validateBasicInfoPayload(data.basicInfo)
  validateProjectDetailsPayload(data.projectDetails)
  ensureResourceNameUnchanged(resource, data.name)
  ensureResourceNameUnchanged(resource, data.basicInfo.resourceName)

  resource.name = resource.basicInfo.resourceName.trim()
  resource.basicInfo.resourceName = resource.basicInfo.resourceName.trim()
  resource.basicInfo.owner = data.basicInfo.owner.trim()
  resource.basicInfo.email = data.basicInfo.email.trim()
  resource.basicInfo.description = data.basicInfo.description.trim()
  resource.basicInfo.priority = data.basicInfo.priority
  resource.projectDetails.projectName = data.projectDetails.projectName.trim()
  resource.projectDetails.budget = data.projectDetails.budget.trim()
  resource.projectDetails.category = data.projectDetails.category
  resource.projectDetails.options = data.projectDetails.options

  await resource.save()
  return resource.toJSON()
}

export async function deleteResource(query: ResourceQuery) {
  const resource = await ResourceModel.findOneAndDelete(query).lean()
  if (!resource) {
    throw new ApiError(404, 'Resource not found')
  }
  return resource
}

export async function clearDatabase() {
  await ResourceModel.deleteMany({})
}
