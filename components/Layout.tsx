import styled from 'styled-components'
import { devices } from '../utils/devices'

export const maxWidth = '55em'

const Layout = styled.main`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
  max-width: ${maxWidth};
  margin: 0 auto;

  @media only screen and (${devices.tablet}) {
    margin-top: 64px;
    gap: 2rem;
  }
`

export default Layout
