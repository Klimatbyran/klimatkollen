import styled from 'styled-components'

import { H1 } from './Typography'
import VisuallyHidden from './VisuallyHidden'
import Header from './Header'

const Main = styled.main`
  display: flex;
  flex-direction: column;
  margin: 32px auto;

  @media only screen and (max-width: 600px) {
    margin: 16px auto;
  }
`

export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <>
      <Header />
      <Main>
        <VisuallyHidden>
          <H1>Klimatkollen</H1>
        </VisuallyHidden>
        {children}
      </Main>
    </>
  )
}
