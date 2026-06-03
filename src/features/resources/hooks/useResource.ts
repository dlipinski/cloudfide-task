import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../../../api/client'
import { getResource } from '../../../api/resources'
import type { Resource } from '../../../api/types'

interface UseResourceResult {
  resource: Resource | undefined
  loading: boolean
  error: string | undefined
  refetch: () => void
}

/** Loads a single resource by id, with loading/error state and refetch. */
export function useResource(id: string | undefined): UseResourceResult {
  const [resource, setResource] = useState<Resource | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | undefined>(undefined)
  const [reloadToken, setReloadToken] = useState(0)

  const refetch = useCallback(() => setReloadToken((token) => token + 1), [])

  useEffect(() => {
    const controller = new AbortController()

    const load = async () => {
      if (!id) {
        setResource(undefined)
        setError('Resource id is missing')
        setLoading(false)
        return
      }
      setLoading(true)
      setError(undefined)
      try {
        const data = await getResource(id, controller.signal)
        setResource(data)
        setLoading(false)
      } catch (err: unknown) {
        if (controller.signal.aborted) return
        setResource(undefined)
        setError(err instanceof ApiError ? err.message : 'Failed to load resource')
        setLoading(false)
      }
    }

    void load()
    return () => controller.abort()
  }, [id, reloadToken])

  return { resource, loading, error, refetch }
}
