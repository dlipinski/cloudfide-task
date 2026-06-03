import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../../design-system'
import { patchProjectDetails, replaceResource } from '../../../api/resources'
import type { ProjectDetails } from '../../../api/types'
import { isBasicInfoComplete } from '../../../domain/completeness'
import { useResource } from '../hooks/useResource'
import { useAsyncAction } from '../hooks/useAsyncAction'
import { PageLayout } from '../components/PageLayout'
import { StateMessage } from '../components/StateMessage'
import { BufferedNote } from '../components/BufferedNote'
import { ProjectDetailsForm } from '../components/ProjectDetailsForm'

/** Project Details module page. Gated for drafts; completed resources buffer + PUT. */
export function ProjectDetailsPage() {
  const { resourceId } = useParams<{ resourceId: string }>()
  const navigate = useNavigate()
  const { resource, loading, error } = useResource(resourceId)
  const save = useAsyncAction(
    (values: ProjectDetails) => {
      if (!resource) throw new Error('Resource not loaded')
      if (resource.status === 'completed') {
        return replaceResource(resource.resourceId, {
          name: resource.basicInfo.resourceName,
          basicInfo: resource.basicInfo,
          projectDetails: values,
        })
      }
      return patchProjectDetails(resource.resourceId, values)
    },
  )

  const backTo = resourceId ? `/resources/${resourceId}` : '/resources'

  if (loading) {
    return (
      <PageLayout title="Project Details" backTo={backTo} backLabel="Overview">
        <StateMessage title="Loading…" />
      </PageLayout>
    )
  }

  if (error || !resource) {
    return (
      <PageLayout title="Project Details" backTo={backTo} backLabel="Overview">
        <StateMessage
          tone="error"
          title="Resource unavailable"
          description={error ?? 'Resource not found'}
        />
      </PageLayout>
    )
  }

  const isCompleted = resource.status === 'completed'
  const isGated = !isCompleted && !isBasicInfoComplete(resource.basicInfo)

  if (isGated) {
    return (
      <PageLayout title="Project Details" backTo={backTo} backLabel="Overview">
        <StateMessage
          title="Complete Basic Info first"
          description="Project Details can be edited only after Basic Info is complete."
        >
          <Button
            onClick={() => navigate(`/resources/${resource.resourceId}/basic-info`)}
          >
            Go to Basic Info
          </Button>
        </StateMessage>
      </PageLayout>
    )
  }

  const handleSubmit = async (values: ProjectDetails) => {
    try {
      await save.run(values)
      navigate(backTo)
    } catch {
      // error surfaced via save.error
    }
  }

  return (
    <PageLayout title="Project Details" backTo={backTo} backLabel="Overview">
      {isCompleted ? <BufferedNote /> : null}
      <ProjectDetailsForm
        initialValues={resource.projectDetails}
        onSubmit={handleSubmit}
        submitting={save.pending}
        submitLabel={isCompleted ? 'Save changes' : 'Save Project Details'}
        serverError={save.error}
      />
    </PageLayout>
  )
}
