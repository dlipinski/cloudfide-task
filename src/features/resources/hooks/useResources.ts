import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../../../api/client'
import { listResources } from '../../../api/resources'
import type { ListResourcesParams, Pagination, Resource } from '../../../api/types'

interface UseResourcesResult {
  items: Resource[]
  pagination: Pagination | undefined
  loading: boolean
  error: string | undefined
  refetch: () => void
}

/** Loads the resource list with backend-driven filters/sort/pagination. */
export function useResources(params: ListResourcesParams): UseResourcesResult {
  const [items, setItems] = useState<Resource[]>([])
  const [pagination, setPagination] = useState<Pagination | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | undefined>(undefined)
  const [reloadToken, setReloadToken] = useState(0)

  const refetch = useCallback(() => setReloadToken((token) => token + 1), [])

  const { page, pageSize, status, name, sortOrder } = params

  useEffect(() => {
    const controller = new AbortController()

    const load = async () => {
      setLoading(true)
      setError(undefined)
      try {
        const data = await listResources(
          { page, pageSize, status, name, sortOrder },
          controller.signal,
        )
        setItems(data.items)
        setPagination(data.pagination)
        setLoading(false)
      } catch (err: unknown) {
        if (controller.signal.aborted) return
        setError(err instanceof ApiError ? err.message : 'Failed to load resources')
        setLoading(false)
      }
    }

    void load()
    return () => controller.abort()
  }, [page, pageSize, status, name, sortOrder, reloadToken])

  return { items, pagination, loading, error, refetch }
}
