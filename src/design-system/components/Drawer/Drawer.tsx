import { useEffect } from 'react'
import { IconButton } from '../IconButton'
import type { DrawerProps } from './Drawer.types'
import { Content, Header, Overlay, Panel } from './Drawer.styles'

/**
 * Side drawer panel that overlays the page and closes on backdrop click or Escape.
 */
export function Drawer({ title, isOpen, onClose, children }: DrawerProps) {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <Overlay $isOpen={isOpen} onClick={onClose} aria-hidden={!isOpen}>
      <Panel
        $isOpen={isOpen}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <Header>
          <strong>{title}</strong>
          <IconButton type="button" variant="ghost" onClick={onClose}>
            ✕
          </IconButton>
        </Header>
        <Content>{children}</Content>
      </Panel>
    </Overlay>
  )
}
