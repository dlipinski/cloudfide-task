import type { ReactNode } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

interface PageLayoutProps {
  title: string
  backTo?: string
  backLabel?: string
  actions?: ReactNode
  children: ReactNode
}

const Page = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`

const BackLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.9rem;
  text-decoration: none;
  width: fit-content;

  &:hover {
    text-decoration: underline;
  }
`

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`

const Title = styled.h1`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.heading};
  color: ${({ theme }) => theme.colors.inkStrong};
  font-size: 1.6rem;
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`

/** Shared page shell with optional back link and action slot. */
export function PageLayout({
  title,
  backTo,
  backLabel = 'Back',
  actions,
  children,
}: PageLayoutProps) {
  return (
    <Page>
      {backTo ? <BackLink to={backTo}>← {backLabel}</BackLink> : null}
      <Header>
        <Title>{title}</Title>
        {actions ? <Actions>{actions}</Actions> : null}
      </Header>
      {children}
    </Page>
  )
}
