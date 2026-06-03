import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { StatusBadge } from './StatusBadge'

const meta: Meta<typeof StatusBadge> = {
  title: 'Resources/StatusBadge',
  component: StatusBadge,
}

export default meta

type Story = StoryObj<typeof StatusBadge>

export const Draft: Story = {
  args: { status: 'draft' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Draft')).toBeInTheDocument()
  },
}

export const Completed: Story = {
  args: { status: 'completed' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Completed')).toBeInTheDocument()
  },
}
