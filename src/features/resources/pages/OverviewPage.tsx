import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Button, Card } from '../../../design-system'
import { provisionResource } from '../../../api/resources'
import {
  canProvision,
  isBasicInfoComplete,
} from '../../../domain/completeness'
import { useResource } from '../hooks/useResource'
import { useAsyncAction } from '../hooks/useAsyncAction'
import { PageLayout } from '../components/PageLayout'
import { StatusBadge } from '../components/StatusBadge'
import { ModuleProgress } from '../components/ModuleProgress'
import { StateMessage } from '../components/StateMessage'
import { FormError } from '../components/FormLayout'

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

const ModuleLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`

const GatedNote = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkMuted};
  font-size: 0.85rem;
`

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

/** Resource overview: module progress, status, and key actions. */
export function OverviewPage() {
  const { resourceId } = useParams<{ resourceId: string }>()
  const navigate = useNavigate()
  const { resource, loading, error, refetch } = useResource(resourceId)
  const provision = useAsyncAction(provisionResource)

  if (loading) {
    return (
      <PageLayout title="Resource" backTo="/resources" backLabel="All resources">
        <StateMessage title="Loading resource…" />
      </PageLayout>
    )
  }

  if (error || !resource) {
    return (
      <PageLayout title="Resource" backTo="/resources" backLabel="All resources">
        <StateMessage
          tone="error"
          title="Resource unavailable"
          description={error ?? 'Resource not found'}
        />
      </PageLayout>
    )
  }

  const basicComplete = isBasicInfoComplete(resource.basicInfo)
  const isDraft = resource.status === 'draft'
  const detailsGated = isDraft && !basicComplete
  const readyToProvision = canProvision(resource)

  const handleProvision = async () => {
    try {
      await provision.run(resource.resourceId)
      refetch()
    } catch {
      // error surfaced via provision.error
    }
  }

  return (
    <PageLayout
      title={resource.name}
      backTo="/resources"
      backLabel="All resources"
      actions={
        <StatusRow>
          <StatusBadge status={resource.status} />
          <Button
            variant="secondary"
            onClick={() => navigate(`/resources/${resource.resourceId}/details`)}
          >
            View details
          </Button>
        </StatusRow>
      }
    >
      <Section>
        <SectionTitle>Module progress</SectionTitle>
        <ModuleProgress resource={resource} />
      </Section>

      <Section>
        <SectionTitle>Modules</SectionTitle>
        <ModuleLinks>
          <Button
            variant="secondary"
            onClick={() =>
              navigate(`/resources/${resource.resourceId}/basic-info`)
            }
          >
            {isDraft ? 'Edit Basic Info' : 'Basic Info'}
          </Button>
          {detailsGated ? (
            <Button variant="secondary" state="locked" disabled>
              Project Details
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={() =>
                navigate(`/resources/${resource.resourceId}/project-details`)
              }
            >
              {isDraft ? 'Edit Project Details' : 'Project Details'}
            </Button>
          )}
        </ModuleLinks>
        {detailsGated ? (
          <GatedNote>
            Complete Basic Info before editing Project Details.
          </GatedNote>
        ) : null}
      </Section>

      {isDraft ? (
        <Section>
          <SectionTitle>Complete resource</SectionTitle>
          <GatedNote>
            Provisioning moves this resource from draft to completed. Both modules
            must be complete first.
          </GatedNote>
          <div>
            <Button
              onClick={handleProvision}
              disabled={!readyToProvision || provision.pending}
            >
              {provision.pending ? 'Provisioning…' : 'Complete resource'}
            </Button>
          </div>
          {provision.error ? <FormError>{provision.error}</FormError> : null}
        </Section>
      ) : (
        <Section>
          <SectionTitle>Completed</SectionTitle>
          <GatedNote>
            This resource is completed. Module edits are buffered locally and saved
            through a full update.
          </GatedNote>
        </Section>
      )}
    </PageLayout>
  )
}
