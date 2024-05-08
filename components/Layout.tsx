import styled from 'styled-components'

import { H1 } from './Typography'
import Header from './Header'
import { devices } from '../utils/devices'

const Main = styled.main`
  display: flex;
  flex-direction: column;
  margin: 80px auto 32px auto;

  @media only screen and (${devices.tablet}) {
    margin: 96px auto 32px auto;
  }
`

export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <>
      <Header />
      <Main>
        <H1 className="sr-only">Klimatkollen</H1>
        {children}
      </Main>
    </>
  )
}
