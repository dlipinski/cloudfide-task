import { useNavigate, useParams } from 'react-router-dom'
import { patchBasicInfo, replaceResource } from '../../../api/resources'
import type { BasicInfo } from '../../../api/types'
import { useResource } from '../hooks/useResource'
import { useAsyncAction } from '../hooks/useAsyncAction'
import { PageLayout } from '../components/PageLayout'
import { StateMessage } from '../components/StateMessage'
import { BufferedNote } from '../components/BufferedNote'
import { BasicInfoForm } from '../components/BasicInfoForm'

/** Basic Info module page. Drafts PATCH; completed resources buffer + PUT. */
export function BasicInfoPage() {
  const { resourceId } = useParams<{ resourceId: string }>()
  const navigate = useNavigate()
  const { resource, loading, error } = useResource(resourceId)
  const save = useAsyncAction(
    (values: BasicInfo) => {
      if (!resource) throw new Error('Resource not loaded')
      if (resource.status === 'completed') {
        return replaceResource(resource.resourceId, {
          name: resource.basicInfo.resourceName,
          basicInfo: values,
          projectDetails: resource.projectDetails,
        })
      }
      return patchBasicInfo(resource.resourceId, values)
    },
  )

  const backTo = resourceId ? `/resources/${resourceId}` : '/resources'

  if (loading) {
    return (
      <PageLayout title="Basic Info" backTo={backTo} backLabel="Overview">
        <StateMessage title="Loading…" />
      </PageLayout>
    )
  }

  if (error || !resource) {
    return (
      <PageLayout title="Basic Info" backTo={backTo} backLabel="Overview">
        <StateMessage
          tone="error"
          title="Resource unavailable"
          description={error ?? 'Resource not found'}
        />
      </PageLayout>
    )
  }

  const isCompleted = resource.status === 'completed'

  const handleSubmit = async (values: BasicInfo) => {
    try {
      await save.run(values)
      navigate(backTo)
    } catch {
      // error surfaced via save.error
    }
  }

  return (
    <PageLayout title="Basic Info" backTo={backTo} backLabel="Overview">
      {isCompleted ? <BufferedNote /> : null}
      <BasicInfoForm
        initialValues={resource.basicInfo}
        onSubmit={handleSubmit}
        submitting={save.pending}
        submitLabel={isCompleted ? 'Save changes' : 'Save Basic Info'}
        serverError={save.error}
      />
    </PageLayout>
  )
}
