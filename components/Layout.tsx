import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'

import { devices } from '../utils/devices'
import { H1 } from './Typography'
import VisuallyHidden from './VisuallyHidden'

const Header = styled.header`
  max-width: 840px;
  padding: 20px;
  @media only screen and (${devices.tablet}) {
    padding: 30px 20px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
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
        <div>
          <Link href="/">
            <a href="/">
              <Image
                src="/klimatkollen_logo.svg"
                width="485"
                height="86"
                alt="Klimatkollen logotyp"
              />
            </a>
          </Link>
        </div>
      </Header>
      <Main>
        <>
          <VisuallyHidden>
            <H1>Klimatkollen</H1>
          </VisuallyHidden>
          {children}
        </>
      </Main>
    </>
  )
}
