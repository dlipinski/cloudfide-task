import { useCallback, useState } from 'react'
import { ApiError } from '../../../api/client'

interface AsyncActionState {
  pending: boolean
  error: string | undefined
}

/** Wraps an async mutation, tracking pending/error state and surfacing messages. */
export function useAsyncAction<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
) {
  const [state, setState] = useState<AsyncActionState>({
    pending: false,
    error: undefined,
  })

  const run = useCallback(
    async (...args: TArgs): Promise<TResult> => {
      setState({ pending: true, error: undefined })
      try {
        const result = await fn(...args)
        setState({ pending: false, error: undefined })
        return result
      } catch (error) {
        const message =
          error instanceof ApiError ? error.message : 'Something went wrong'
        setState({ pending: false, error: message })
        throw error
      }
    },
    [fn],
  )

  const reset = useCallback(() => {
    setState({ pending: false, error: undefined })
  }, [])

  return { run, pending: state.pending, error: state.error, reset }
}
