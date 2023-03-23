import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import styled from 'styled-components'

import { devices } from '../utils/devices'
import { H1, Paragraph } from './Typography'
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

const Tagline = styled(Paragraph)`
  margin: 0;
  font-size: 14px;
  line-height: 20px;
`

type NavProps = {
  path: string
}

const Nav = styled.nav<NavProps>`
  margin-top: 30px;
  @media only screen and (${devices.tablet}) {
    margin: 0 0 0 60px;
    display: flex;
    align-items: center;
  }
  & ul {
    list-style-type: none;
    display: flex;
    align-items: left;
    flex-wrap: wrap;
    gap: 10px;
    @media only screen and (${devices.tablet}) {
      flex-direction: column;
      justify-content: center;
      gap: 25px;
    }
    & li {
      position: relative;
      width: max-content;
      margin-bottom: 10px;
      @media only screen and (${devices.tablet}) {
        margin: 0;
      }
      & a {
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-size: 14px;
        line-height: 20px;
        font-weight: 700;
        text-decoration: none;
        color: ${({ theme }) => theme.darkestGrey};
        white-space: nowrap;
      }
      & .active {
        background-color: ${({ theme }) => theme.main};
        & :hover {
          background-color: ${({ theme }) => theme.greenGraphOne};
        }
      }
      & .inactive {
        background-color: ${({ theme }) => theme.white};
        & :hover {
          background-color: ${({ theme }) => theme.greenGraphThree};
        }
      }
    }
  }
`

export default function Layout({ children }: { children: JSX.Element }) {
  const [visibleNotification, setVisibleNotification] = useState(true)
  const router = useRouter()
  const path = router.pathname

  return (
    <>
      <Header>
        <div>
          <Link href="/">
            <a href="/">
              <Image
                src="/logo_beta.svg"
                width="485"
                height="86"
                alt="Klimatkollen logotyp"
              />
            </a>
          </Link>
          <Tagline>Få koll på Sveriges klimatomställning</Tagline>
        </div>
        <Nav path={path}>
          <ul>
            <li>
              <Link href="/">
                <a href="/" className={path == "/" ? "active" : "inactive"}>
                  Kommuner
                </a>
              </Link>
            </li>
            <li>
              <Link href="/kallor-och-metod">
                <a href="/kallor-och-metod" className={path == "/kallor-och-metod" ? "active" : "inactive"}>
                  Källor och metod
                </a>
              </Link>
            </li>
            <li>
              <Link href="/om-oss">
                <a href="/om-oss" className={path == "/om-oss" ? "active" : "inactive"}>
                  Om oss
                </a>
              </Link>
            </li>
          </ul>
        </Nav>
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
