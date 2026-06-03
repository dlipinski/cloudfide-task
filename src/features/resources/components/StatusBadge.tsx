import { Badge } from '../../../design-system'
import type { ResourceStatus } from '../../../api/types'

interface StatusBadgeProps {
  status: ResourceStatus
}

/** Renders the resource status as a coloured badge. */
export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant={status === 'completed' ? 'success' : 'info'}>
      {status === 'completed' ? 'Completed' : 'Draft'}
    </Badge>
  )
}
