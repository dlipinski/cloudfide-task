import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ConfirmDialog } from './ConfirmDialog'

const meta: Meta<typeof ConfirmDialog> = {
  title: 'Resources/ConfirmDialog',
  component: ConfirmDialog,
  args: {
    isOpen: true,
    title: 'Delete resource',
    message: 'This permanently removes the resource. Continue?',
    confirmLabel: 'Delete',
    onConfirm: fn(),
    onClose: fn(),
  },
}

export default meta

type Story = StoryObj<typeof ConfirmDialog>

export const Confirming: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Delete' }))
    await expect(args.onConfirm).toHaveBeenCalledOnce()
    await expect(args.onClose).not.toHaveBeenCalled()
  },
}

export const Cancelling: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }))
    await expect(args.onClose).toHaveBeenCalledOnce()
    await expect(args.onConfirm).not.toHaveBeenCalled()
  },
}

export const Pending: Story = {
  args: { pending: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const confirm = canvas.getByRole('button', { name: 'Working…' })
    await expect(confirm).toBeDisabled()
    await userEvent.click(confirm)
    await expect(args.onConfirm).not.toHaveBeenCalled()
  },
}

export const WithError: Story = {
  args: { error: 'Something went wrong' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Something went wrong')).toBeInTheDocument()
  },
}
