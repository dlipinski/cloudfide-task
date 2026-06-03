const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5001'

/** Error thrown for non-2xx responses, carrying the backend error shape. */
export class ApiError extends Error {
  readonly status: number
  readonly details: unknown

  constructor(status: number, message: string, details: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

interface RequestOptions {
  method?: string
  body?: unknown
  signal?: AbortSignal
}

/** Performs a JSON request against the backend and returns the parsed body. */
export async function request<T>(
  path: string,
  { method = 'GET', body, signal }: RequestOptions = {},
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    signal,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : undefined

  if (!response.ok) {
    const message =
      (data && typeof data === 'object' && 'message' in data
        ? String((data as { message: unknown }).message)
        : undefined) ?? `Request failed with status ${response.status}`
    const details =
      data && typeof data === 'object' && 'details' in data
        ? (data as { details: unknown }).details
        : undefined
    throw new ApiError(response.status, message, details)
  }

  return data as T
}
