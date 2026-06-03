import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import type { Resource } from '../../../api/types'
import { ModuleProgress } from './ModuleProgress'

function makeResource(overrides: Partial<Resource> = {}): Resource {
  return {
    _id: 'abc',
    resourceId: 1,
    name: 'Resource One',
    status: 'draft',
    basicInfo: {
      resourceName: 'Resource One',
      owner: 'Ada Lovelace',
      email: 'ada@example.com',
      description: 'A useful resource',
      priority: 'high',
    },
    projectDetails: {
      projectName: 'Project One',
      budget: '1000',
      category: 'internal',
      options: ['FE devs'],
    },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

const meta: Meta<typeof ModuleProgress> = {
  title: 'Resources/ModuleProgress',
  component: ModuleProgress,
}

export default meta

type Story = StoryObj<typeof ModuleProgress>

export const BothComplete: Story = {
  args: { resource: makeResource() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByText('Complete')).toHaveLength(2)
  },
}

export const BothIncomplete: Story = {
  args: {
    resource: makeResource({
      basicInfo: {
        resourceName: '',
        owner: '',
        email: '',
        description: '',
        priority: '',
      },
      projectDetails: { projectName: '', budget: '', category: '', options: [] },
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByText('Incomplete')).toHaveLength(2)
  },
}

export const Mixed: Story = {
  args: {
    resource: makeResource({
      projectDetails: { projectName: '', budget: '', category: '', options: [] },
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Complete')).toBeInTheDocument()
    await expect(canvas.getByText('Incomplete')).toBeInTheDocument()
  },
}
