import { request } from './client'
import type {
  BasicInfo,
  ListResourcesParams,
  ProjectDetails,
  Resource,
  ResourceListResponse,
  ResourcePayload,
} from './types'

type ResourceId = string | number

const RESOURCES = '/api/resources'

function buildQuery(params: ListResourcesParams): string {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.pageSize) query.set('pageSize', String(params.pageSize))
  if (params.status) query.set('status', params.status)
  if (params.name?.trim()) query.set('name', params.name.trim())
  if (params.sortOrder) query.set('sortOrder', params.sortOrder)
  const queryString = query.toString()
  return queryString ? `?${queryString}` : ''
}

export function listResources(
  params: ListResourcesParams = {},
  signal?: AbortSignal,
): Promise<ResourceListResponse> {
  return request<ResourceListResponse>(`${RESOURCES}${buildQuery(params)}`, { signal })
}

export function getResource(id: ResourceId, signal?: AbortSignal): Promise<Resource> {
  return request<Resource>(`${RESOURCES}/${id}`, { signal })
}

export function createResource(resourceName: string): Promise<Resource> {
  return request<Resource>(RESOURCES, { method: 'POST', body: { resourceName } })
}

export function patchBasicInfo(id: ResourceId, data: BasicInfo): Promise<Resource> {
  return request<Resource>(`${RESOURCES}/${id}/basic-info`, { method: 'PATCH', body: data })
}

export function patchProjectDetails(
  id: ResourceId,
  data: ProjectDetails,
): Promise<Resource> {
  return request<Resource>(`${RESOURCES}/${id}/project-details`, {
    method: 'PATCH',
    body: data,
  })
}

export function provisionResource(id: ResourceId): Promise<Resource> {
  return request<Resource>(`${RESOURCES}/${id}/provisioning`, { method: 'PATCH' })
}

export function replaceResource(
  id: ResourceId,
  payload: ResourcePayload,
): Promise<Resource> {
  return request<Resource>(`${RESOURCES}/${id}`, { method: 'PUT', body: payload })
}

export function deleteResource(id: ResourceId): Promise<Resource> {
  return request<Resource>(`${RESOURCES}/${id}`, { method: 'DELETE' })
}
