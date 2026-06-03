import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Card } from '../../../design-system'
import type { Resource } from '../../../api/types'
import { useResource } from '../hooks/useResource'
import { PageLayout } from '../components/PageLayout'
import { StatusBadge } from '../components/StatusBadge'
import { StateMessage } from '../components/StateMessage'

const Section = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.inkStrong};
`

const DefinitionList = styled.dl`
  margin: 0;
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};

  dt {
    color: ${({ theme }) => theme.colors.inkMuted};
    font-size: 0.9rem;
  }

  dd {
    margin: 0;
    color: ${({ theme }) => theme.colors.ink};
    word-break: break-word;
  }

  @media (max-width: 540px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.xs};

    dd {
      margin-bottom: ${({ theme }) => theme.spacing.sm};
    }
  }
`

const EMPTY = '—'

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{value || EMPTY}</dd>
    </>
  )
}

function DetailsContent({ resource }: { resource: Resource }) {
  return (
    <>
      <Section>
        <SectionTitle>Basic Info</SectionTitle>
        <DefinitionList>
          <Row label="Resource name" value={resource.basicInfo.resourceName} />
          <Row label="Owner" value={resource.basicInfo.owner} />
          <Row label="Email" value={resource.basicInfo.email} />
          <Row label="Description" value={resource.basicInfo.description} />
          <Row label="Priority" value={resource.basicInfo.priority} />
        </DefinitionList>
      </Section>
      <Section>
        <SectionTitle>Project Details</SectionTitle>
        <DefinitionList>
          <Row label="Project name" value={resource.projectDetails.projectName} />
          <Row label="Budget" value={resource.projectDetails.budget} />
          <Row label="Category" value={resource.projectDetails.category} />
          <Row
            label="Team members"
            value={resource.projectDetails.options.join(', ')}
          />
        </DefinitionList>
      </Section>
    </>
  )
}

/** Read-only summary of both modules and status. */
export function DetailsPage() {
  const { resourceId } = useParams<{ resourceId: string }>()
  const { resource, loading, error } = useResource(resourceId)

  const backTo = resourceId ? `/resources/${resourceId}` : '/resources'

  return (
    <PageLayout
      title="Resource details"
      backTo={backTo}
      backLabel="Overview"
      actions={resource ? <StatusBadge status={resource.status} /> : undefined}
    >
      {loading ? (
        <StateMessage title="Loading details…" />
      ) : error || !resource ? (
        <StateMessage
          tone="error"
          title="Resource unavailable"
          description={error ?? 'Resource not found'}
        />
      ) : (
        <DetailsContent resource={resource} />
      )}
    </PageLayout>
  )
}
