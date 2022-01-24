import styled from 'styled-components'

export const maxWidth = '75em'

const Layout = styled.main`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
  max-width: ${maxWidth};
  margin: 0 auto;
`

export default Layout
