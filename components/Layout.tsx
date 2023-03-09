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
        color: ${({ theme }) => theme.black};
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


const Notification = styled.div`
  position: absolute;
  top: -24px;
  right: -20px;
  padding: 3px 8px;
  background-color: ${({ theme }) => theme.yellow};
  color: ${({ theme }) => theme.black};
  border: 1px solid ${({ theme }) => theme.darkYellow};
  border-radius: 20px;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
  @media only screen and (${devices.tablet}) {
    right: -10px;
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
              <Link href="/kommuner">
                <a className={path == "/kommuner" ? "active" : "inactive"}>
                  Kommuner
                </a>
              </Link>
            </li>
            <li>
              <Link href="/fakta">
                <a className={path == "/fakta" ? "active" : "inactive"}>
                  Vår klimatfakta
                </a>
              </Link>
            </li>
            <li>
              <Link href="/om-oss">
                <a className={path == "/om-oss" ? "active" : "inactive"}>
                  Om oss
                </a>
              </Link>
            </li>
            {/* <li>
              <Link href="/partier">
                <a
                  className={path == "/partier" ? "active" : "inactive"}
                  aria-label="Nyhet! Partiernas klimatmål"
                  href="/partier">
                  Partiernas klimatmål
                </a>
              </Link>
            </li>
            <li>
              <Link href="/utslappsberakningar">
                <a
                  className={path == "/utslappsberakningar" ? "active" : "inactive"}
                  aria-label="Nyhet! Partiernas utsläppsberäkningar"
                  href="/utslappsberakningar"
                  onClick={() => setVisibleNotification(false)}>
                  Utsläppsberäkningar
                </a>
              </Link>
              {visibleNotification && (
                <Notification aria-hidden="true">Nyhet!</Notification>
              )}
            </li> */}
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
