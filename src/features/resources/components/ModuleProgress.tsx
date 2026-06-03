import styled from 'styled-components'
import { Badge } from '../../../design-system'
import type { Resource } from '../../../api/types'
import {
  isBasicInfoComplete,
  isProjectDetailsComplete,
} from '../../../domain/completeness'

interface ModuleProgressProps {
  resource: Resource
}

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

const Row = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`

const ModuleName = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ink};
`

/** Shows completion status of both modules for a resource. */
export function ModuleProgress({ resource }: ModuleProgressProps) {
  const basicComplete = isBasicInfoComplete(resource.basicInfo)
  const detailsComplete = isProjectDetailsComplete(resource.projectDetails)

  return (
    <List>
      <Row>
        <ModuleName>Basic Info</ModuleName>
        <Badge variant={basicComplete ? 'success' : 'warning'}>
          {basicComplete ? 'Complete' : 'Incomplete'}
        </Badge>
      </Row>
      <Row>
        <ModuleName>Project Details</ModuleName>
        <Badge variant={detailsComplete ? 'success' : 'warning'}>
          {detailsComplete ? 'Complete' : 'Incomplete'}
        </Badge>
      </Row>
    </List>
  )
}
