import styled from 'styled-components'

/** Full-screen overlay shown behind the drawer panel. */
export const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(9, 12, 16, 0.4);
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  transition: opacity 0.2s ease;
  z-index: 30;
`

/** Sliding side panel for drawer content. */
export const Panel = styled.aside<{ $isOpen: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: min(420px, 90vw);
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.raised};
  transform: translateX(${({ $isOpen }) => ($isOpen ? '0%' : '100%')});
  transition: transform 0.25s ease;
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`

/** Header row with title and close action. */
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.05rem;
`

/** Main content container rendered inside the drawer panel. */
export const Content = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.ink};
`
