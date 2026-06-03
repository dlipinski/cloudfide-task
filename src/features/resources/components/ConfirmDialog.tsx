import styled from 'styled-components'
import { Button, Drawer } from '../../../design-system'
import { FormActions } from './FormLayout'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  pending?: boolean
  error?: string
  onConfirm: () => void
  onClose: () => void
}

const Message = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.ink};
`

const ErrorText = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.warning};
  font-size: 0.9rem;
`

/** Confirmation dialog rendered inside a design-system Drawer. */
export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  pending = false,
  error,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Drawer title={title} isOpen={isOpen} onClose={onClose}>
      <Message>{message}</Message>
      {error ? <ErrorText>{error}</ErrorText> : null}
      <FormActions>
        <Button variant="primary" onClick={onConfirm} disabled={pending}>
          {pending ? 'Working…' : confirmLabel}
        </Button>
        <Button variant="ghost" onClick={onClose} disabled={pending}>
          Cancel
        </Button>
      </FormActions>
    </Drawer>
  )
}
