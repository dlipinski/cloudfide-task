import { afterEach, describe, expect, it, vi } from 'vitest'
import type { BasicInfo, ProjectDetails, ResourcePayload } from './types'
import {
  createResource,
  deleteResource,
  getResource,
  listResources,
  patchBasicInfo,
  patchProjectDetails,
  provisionResource,
  replaceResource,
} from './resources'

function stubFetch() {
  const fetchMock = vi
    .fn()
    .mockResolvedValue({ ok: true, status: 200, text: () => Promise.resolve('{}') })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

/** Returns the path + query portion of the URL the mock was called with. */
function calledPath(fetchMock: ReturnType<typeof stubFetch>): string {
  const url = String(fetchMock.mock.calls[0][0])
  return url.replace(/^https?:\/\/[^/]+/, '')
}

function calledInit(fetchMock: ReturnType<typeof stubFetch>) {
  return fetchMock.mock.calls[0][1]
}

afterEach(() => {
  vi.unstubAllGlobals()
})

const basicInfo: BasicInfo = {
  resourceName: 'Resource One',
  owner: 'Ada Lovelace',
  email: 'ada@example.com',
  description: 'A useful resource',
  priority: 'high',
}

const projectDetails: ProjectDetails = {
  projectName: 'Project One',
  budget: '1000',
  category: 'internal',
  options: ['FE devs'],
}

describe('listResources query building', () => {
  it('requests the bare collection when no params are given', async () => {
    const fetchMock = stubFetch()
    await listResources()
    expect(calledPath(fetchMock)).toBe('/api/resources')
  })

  it('omits empty params and trims the name', async () => {
    const fetchMock = stubFetch()
    await listResources({ page: 2, pageSize: 10, name: '  alpha  ' })
    expect(calledPath(fetchMock)).toBe('/api/resources?page=2&pageSize=10&name=alpha')
  })

  it('includes status and sort order', async () => {
    const fetchMock = stubFetch()
    await listResources({ status: 'draft', sortOrder: 'desc' })
    expect(calledPath(fetchMock)).toBe('/api/resources?status=draft&sortOrder=desc')
  })

  it('drops a name that is only whitespace', async () => {
    const fetchMock = stubFetch()
    await listResources({ name: '   ' })
    expect(calledPath(fetchMock)).toBe('/api/resources')
  })
})

describe('resource endpoints', () => {
  it('gets a single resource', async () => {
    const fetchMock = stubFetch()
    await getResource(1)
    expect(calledPath(fetchMock)).toBe('/api/resources/1')
    expect(calledInit(fetchMock).method).toBe('GET')
  })

  it('creates a resource with the name in the body', async () => {
    const fetchMock = stubFetch()
    await createResource('Resource One')
    expect(calledPath(fetchMock)).toBe('/api/resources')
    const init = calledInit(fetchMock)
    expect(init.method).toBe('POST')
    expect(init.body).toBe(JSON.stringify({ resourceName: 'Resource One' }))
  })

  it('patches basic info', async () => {
    const fetchMock = stubFetch()
    await patchBasicInfo(1, basicInfo)
    expect(calledPath(fetchMock)).toBe('/api/resources/1/basic-info')
    const init = calledInit(fetchMock)
    expect(init.method).toBe('PATCH')
    expect(init.body).toBe(JSON.stringify(basicInfo))
  })

  it('patches project details', async () => {
    const fetchMock = stubFetch()
    await patchProjectDetails(1, projectDetails)
    expect(calledPath(fetchMock)).toBe('/api/resources/1/project-details')
    const init = calledInit(fetchMock)
    expect(init.method).toBe('PATCH')
    expect(init.body).toBe(JSON.stringify(projectDetails))
  })

  it('provisions a resource without a body', async () => {
    const fetchMock = stubFetch()
    await provisionResource(1)
    expect(calledPath(fetchMock)).toBe('/api/resources/1/provisioning')
    const init = calledInit(fetchMock)
    expect(init.method).toBe('PATCH')
    expect(init.body).toBeUndefined()
  })

  it('replaces a resource with PUT', async () => {
    const fetchMock = stubFetch()
    const payload: ResourcePayload = { name: 'Resource One', basicInfo, projectDetails }
    await replaceResource(1, payload)
    expect(calledPath(fetchMock)).toBe('/api/resources/1')
    const init = calledInit(fetchMock)
    expect(init.method).toBe('PUT')
    expect(init.body).toBe(JSON.stringify(payload))
  })

  it('deletes a resource', async () => {
    const fetchMock = stubFetch()
    await deleteResource(1)
    expect(calledPath(fetchMock)).toBe('/api/resources/1')
    expect(calledInit(fetchMock).method).toBe('DELETE')
  })

  it('accepts a Mongo ObjectId string as the id', async () => {
    const fetchMock = stubFetch()
    await getResource('64b2f0c2a1b2c3d4e5f6a7b8')
    expect(calledPath(fetchMock)).toBe('/api/resources/64b2f0c2a1b2c3d4e5f6a7b8')
  })
})
