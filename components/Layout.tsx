import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'

import { devices } from '../utils/devices'
import { Paragraph } from './Typography'

const Header = styled.header`
  max-width: 840px;
  padding: 40px 20px;

  @media only screen and (${devices.tablet}) {
    padding: 30px 20px;
    margin: 0 auto;
  }
`

const Main = styled.main`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`

const Tagline = styled(Paragraph)`
  margin: 0;
`

export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <>
      <Header>
        <Link href="/">
          <a href="/">
            <Image src="/logo_beta.svg" width="485" height="86" alt="Klimatkollen" />
          </a>
        </Link>
        <Tagline>Få koll på Sveriges klimatomställning</Tagline>
      </Header>
      <Main>{children}</Main>
    </>
  )
}
