import type { BasicInfo, ProjectDetails, Resource } from '../api/types'

/** Mirrors the backend `isBasicInfoComplete` check (UX gating only). */
export function isBasicInfoComplete(basicInfo: BasicInfo): boolean {
  return Boolean(
    basicInfo.resourceName &&
      basicInfo.owner &&
      basicInfo.email &&
      basicInfo.description &&
      basicInfo.priority,
  )
}

/** Mirrors the backend `isProjectDetailsComplete` check (UX gating only). */
export function isProjectDetailsComplete(projectDetails: ProjectDetails): boolean {
  return Boolean(
    projectDetails.projectName &&
      projectDetails.budget &&
      projectDetails.category &&
      projectDetails.options.length > 0,
  )
}

/** True when both modules are complete and the resource can be provisioned. */
export function canProvision(resource: Resource): boolean {
  return (
    isBasicInfoComplete(resource.basicInfo) &&
    isProjectDetailsComplete(resource.projectDetails)
  )
}
