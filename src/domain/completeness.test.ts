import { describe, expect, it } from 'vitest'
import type { BasicInfo, ProjectDetails, Resource } from '../api/types'
import {
  canProvision,
  isBasicInfoComplete,
  isProjectDetailsComplete,
} from './completeness'

const completeBasicInfo: BasicInfo = {
  resourceName: 'Resource One',
  owner: 'Ada Lovelace',
  email: 'ada@example.com',
  description: 'A useful resource',
  priority: 'high',
}

const completeProjectDetails: ProjectDetails = {
  projectName: 'Project One',
  budget: '1000',
  category: 'internal',
  options: ['FE devs'],
}

describe('isBasicInfoComplete', () => {
  it('is true when every field is present', () => {
    expect(isBasicInfoComplete(completeBasicInfo)).toBe(true)
  })

  const fields: (keyof BasicInfo)[] = [
    'resourceName',
    'owner',
    'email',
    'description',
    'priority',
  ]

  it.each(fields)('is false when %s is empty', (field) => {
    expect(isBasicInfoComplete({ ...completeBasicInfo, [field]: '' })).toBe(false)
  })
})

describe('isProjectDetailsComplete', () => {
  it('is true when every field is present and options is non-empty', () => {
    expect(isProjectDetailsComplete(completeProjectDetails)).toBe(true)
  })

  const fields: (keyof Omit<ProjectDetails, 'options'>)[] = [
    'projectName',
    'budget',
    'category',
  ]

  it.each(fields)('is false when %s is empty', (field) => {
    expect(isProjectDetailsComplete({ ...completeProjectDetails, [field]: '' })).toBe(
      false,
    )
  })

  it('is false when options is empty', () => {
    expect(isProjectDetailsComplete({ ...completeProjectDetails, options: [] })).toBe(
      false,
    )
  })
})

describe('canProvision', () => {
  const resource = (
    basicInfo: BasicInfo,
    projectDetails: ProjectDetails,
  ): Resource => ({
    _id: 'abc',
    resourceId: 1,
    name: 'Resource One',
    status: 'draft',
    basicInfo,
    projectDetails,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  })

  it('is true when both modules are complete', () => {
    expect(canProvision(resource(completeBasicInfo, completeProjectDetails))).toBe(true)
  })

  it('is false when basic info is incomplete', () => {
    expect(
      canProvision(
        resource({ ...completeBasicInfo, owner: '' }, completeProjectDetails),
      ),
    ).toBe(false)
  })

  it('is false when project details is incomplete', () => {
    expect(
      canProvision(resource(completeBasicInfo, { ...completeProjectDetails, options: [] })),
    ).toBe(false)
  })
})
