import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, request } from './client'

interface FakeResponseInit {
  ok?: boolean
  status?: number
  body?: string
}

function fakeResponse({ ok = true, status = 200, body = '' }: FakeResponseInit) {
  return { ok, status, text: () => Promise.resolve(body) }
}

function stubFetch(response: ReturnType<typeof fakeResponse>) {
  const fetchMock = vi.fn().mockResolvedValue(response)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('request', () => {
  it('parses a JSON body on success', async () => {
    stubFetch(fakeResponse({ body: JSON.stringify({ id: 1 }) }))
    await expect(request('/api/resources/1')).resolves.toEqual({ id: 1 })
  })

  it('returns undefined for an empty body', async () => {
    stubFetch(fakeResponse({ body: '' }))
    await expect(request('/api/resources/1')).resolves.toBeUndefined()
  })

  it('prefixes the base URL and forwards the signal', async () => {
    const fetchMock = stubFetch(fakeResponse({ body: '{}' }))
    const controller = new AbortController()
    await request('/api/resources', { signal: controller.signal })

    const [url, init] = fetchMock.mock.calls[0]
    expect(String(url)).toMatch(/\/api\/resources$/)
    expect(String(url)).toMatch(/^https?:\/\//)
    expect(init.signal).toBe(controller.signal)
  })

  it('omits a body and content-type header on GET', async () => {
    const fetchMock = stubFetch(fakeResponse({ body: '{}' }))
    await request('/api/resources')

    const [, init] = fetchMock.mock.calls[0]
    expect(init.body).toBeUndefined()
    expect(init.headers).toBeUndefined()
  })

  it('serializes the body and sets the content-type header when a body is present', async () => {
    const fetchMock = stubFetch(fakeResponse({ body: '{}' }))
    await request('/api/resources', { method: 'POST', body: { resourceName: 'Demo' } })

    const [, init] = fetchMock.mock.calls[0]
    expect(init.method).toBe('POST')
    expect(init.headers).toEqual({ 'Content-Type': 'application/json' })
    expect(init.body).toBe(JSON.stringify({ resourceName: 'Demo' }))
  })

  it('throws an ApiError carrying the backend message and details', async () => {
    stubFetch(
      fakeResponse({
        ok: false,
        status: 400,
        body: JSON.stringify({ message: 'Invalid', details: { field: 'owner' } }),
      }),
    )

    await expect(request('/api/resources')).rejects.toMatchObject({
      name: 'ApiError',
      status: 400,
      message: 'Invalid',
      details: { field: 'owner' },
    })
  })

  it('is an instance of ApiError on failure', async () => {
    stubFetch(fakeResponse({ ok: false, status: 500, body: '' }))
    await expect(request('/api/resources')).rejects.toBeInstanceOf(ApiError)
  })

  it('falls back to a status message when none is provided', async () => {
    stubFetch(fakeResponse({ ok: false, status: 503, body: '' }))
    await expect(request('/api/resources')).rejects.toMatchObject({
      message: 'Request failed with status 503',
      details: undefined,
    })
  })
})
