import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=Source+Sans+3:wght@400;500;600&display=swap');

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-height: 100vh;
    font-family: ${({ theme }) => theme.typography.body};
    color: ${({ theme }) => theme.colors.ink};
    background:
      radial-gradient(circle at 10% 10%, rgba(31, 122, 140, 0.12), transparent 45%),
      radial-gradient(circle at 90% 20%, rgba(227, 139, 44, 0.12), transparent 40%),
      linear-gradient(180deg, #fefcf8 0%, #f4f3ef 100%);
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    font-family: ${({ theme }) => theme.typography.heading};
    color: ${({ theme }) => theme.colors.inkStrong};
    margin: 0;
  }

  p {
    margin: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font-family: ${({ theme }) => theme.typography.body};
  }
`
