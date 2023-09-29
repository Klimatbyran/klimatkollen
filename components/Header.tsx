import React, { useState } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import Link from 'next/link'
import { devices } from '../utils/devices'

const HeaderContainer = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: ${({ theme }) => theme.midGreen};

  @media only screen and (${devices.mobile}) {
    padding: 8px;
  }
`

const LogoContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
`

const NavigationList = styled.ul`
  display: none;

  @media only screen and (${devices.laptop}) {
    list-style: none;
    display: flex;
    gap: 2rem;
    margin-left: auto;
  }
`

const NavigationItem = styled.li`
  font-size: 1rem;
`

const NavigationLink = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.black};
  font-family: 'Anonymous Pro';

  &:hover {
    text-decoration: underline;
  }
`

const HamburgerMenu = styled.div`
display: block;
  margin-left: auto;

  @media only screen and (${devices.laptop}) {
    display: none;
  }
`

const HamburgerButton = styled.button`
  border: none;
  background: transparent;
`

const FullScreenMenu = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.midGreen};
  display: flex;
  flex-direction: column;
  z-index: 1000;
  padding: 5rem 1rem 1rem 1rem;
`

const CloseButtonContainer = styled.div`
  position: absolute;
  top: 2rem;
  right: 1rem;
`

const Separator = styled.hr`
  width: 100%;
  border: 0.5px solid black;
`

const HamburgerNavigationItem = styled.li`
  padding: 1rem 0;
  font-size: 1.5rem;
  list-style-type: none;
`

const HamburgerNavigationLink = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.black};
  font-family: 'Anonymous Pro';

  &:hover {
    text-decoration: underline;
  }
`

// Header Component
function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <HeaderContainer>
      <Link href="/">
        <a href="/">
          <LogoContainer>
            <Image
              src="/logos/klimatkollen_logo_black.svg"
              width="150"
              height="30"
              alt="Klimatkollen logotyp"
            />
          </LogoContainer>
        </a>
      </Link>
      <NavigationList>
        <NavigationItem>
          <NavigationLink href="/kallor-och-metod">Källor och metod</NavigationLink>
        </NavigationItem>
        <NavigationItem>
          <NavigationLink href="/om-oss">Om oss</NavigationLink>
        </NavigationItem>
      </NavigationList>
      <HamburgerMenu>
        <HamburgerButton type="button" onClick={() => setMenuOpen(!menuOpen)}>
          <Image src="/icons/menu.svg" width="30" height="30" alt="Menu" />
        </HamburgerButton>
        {menuOpen && (
          <FullScreenMenu>
            <CloseButtonContainer>
              <HamburgerButton type="button" onClick={() => setMenuOpen(false)}>
                <Image src="/icons/close_round.svg" width="20" height="20" alt="Stäng" />
              </HamburgerButton>
            </CloseButtonContainer>
            <Separator />
            <HamburgerNavigationItem>
              <HamburgerNavigationLink href="/">
                Hem
              </HamburgerNavigationLink>
            </HamburgerNavigationItem>
            <Separator />
            <HamburgerNavigationItem>
              <HamburgerNavigationLink href="/kallor-och-metod">
                Källor och metod
              </HamburgerNavigationLink>
            </HamburgerNavigationItem>
            <Separator />
            <HamburgerNavigationItem>
              <HamburgerNavigationLink href="/om-oss">
                Om oss
              </HamburgerNavigationLink>
            </HamburgerNavigationItem>
          </FullScreenMenu>
        )}
      </HamburgerMenu>
    </HeaderContainer>
  )
}

export default Header
