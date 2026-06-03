import styled from 'styled-components'
import { AppRoutes } from './routes/AppRoutes'

const AppShell = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.surfaceAlt};
`

function App() {
  return (
    <AppShell>
      <AppRoutes />
    </AppShell>
  )
}

export default App
