import type { ReactNode } from 'react'
import styled from 'styled-components'

interface StateMessageProps {
  title: string
  description?: string
  tone?: 'neutral' | 'error'
  children?: ReactNode
}

const Wrapper = styled.div<{ $tone: 'neutral' | 'error' }>`
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;

  h2 {
    margin: 0;
    font-size: 1.1rem;
    color: ${({ $tone, theme }) =>
      $tone === 'error' ? theme.colors.warning : theme.colors.inkStrong};
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.inkMuted};
  }
`

/** Centered message block for loading / empty / error page states. */
export function StateMessage({
  title,
  description,
  tone = 'neutral',
  children,
}: StateMessageProps) {
  return (
    <Wrapper $tone={tone}>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
      {children}
    </Wrapper>
  )
}
