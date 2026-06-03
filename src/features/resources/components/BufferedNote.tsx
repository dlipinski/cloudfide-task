import styled from 'styled-components'

const Note = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  background: ${({ theme }) => theme.colors.accentSoft};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.inkStrong};
  font-size: 0.9rem;
`

/** Explains the buffered-edit behaviour for completed resources. */
export function BufferedNote() {
  return (
    <Note>
      This resource is completed. Edits stay in your browser until you save, which
      persists them with a full update. Unsaved changes are lost on refresh.
    </Note>
  )
}
