import Image from 'next/image'
import styled from 'styled-components'

import { devices } from '../utils/devices'
import Footer from './Footer'
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

export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <>
      <Header>
        <Image src="/logo_beta.svg" width="485" height="86" alt="Klimatkollen" />
        <Paragraph>Få koll på Sveriges klimatomställning</Paragraph>
      </Header>
      <Main>{children}</Main>
      <Footer />
    </>
  )
}
