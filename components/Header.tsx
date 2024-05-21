import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { devices } from '../utils/devices'

const HeaderContainer = styled.header`
  --header-padding: 0.5rem;
  --btn-size: 2rem;

  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  align-items: center;
  padding: var(--header-padding);
  background-color: ${({ theme }) => theme.midGreen};
  z-index: 1000;
`

const LogoContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  height: var(--btn-size);
  padding-top: 4px;
`

const NavigationList = styled.ul`
  display: none;

  @media only screen and (${devices.laptop}) {
    list-style: none;
    display: flex;
    gap: 1.5rem;
    margin-left: auto;
    height: var(--btn-size);
    align-items: center;
  }
`

const NavigationItem = styled.li`
  font-size: 1rem;
`

const NavigationLink = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.black};

  &:hover {
    text-decoration: underline;
  }
`

const HamburgerMenu = styled.div`
  display: block;
  margin-left: auto;
  height: var(--btn-size);

  @media only screen and (${devices.laptop}) {
    display: none;
  }
`

const HamburgerButton = styled.button`
  border: none;
  background: transparent;
  height: var(--btn-size);
  width: var(--btn-size);
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
  padding: 3rem 1rem 1rem 1rem;

  @media only screen and (${devices.tablet}) {
    padding-top: 3rem;
  }
`

const CloseButtonContainer = styled.div`
  position: absolute;
  top: var(--header-padding);
  right: var(--header-padding);
  height: var(--btn-size);
  width: var(--btn-size);

  & ${HamburgerButton} {
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }
`

const Separator = styled.hr`
  width: 100%;
  border: 0.5px solid black;
`

const HamburgerItem = styled.li`
  padding: 1rem 0;
  font-size: 1.5rem;
  list-style-type: none;
`

const HamburgerLink = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.black};

  &:hover {
    text-decoration: underline;
  }
`

type NavItem = {
  href: string
  label: string
  target?: string;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    const closeMenuListener = (event: KeyboardEvent) => {
      if (menuOpen && event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    window.addEventListener('keydown', closeMenuListener)

    return () => window.removeEventListener('keydown', closeMenuListener)
  }, [menuOpen, setMenuOpen])

  const navigationItems: NavItem[] = [
    { href: '/kallor-och-metod', label: t('common:components.Header.method') },
    { href: '/om-oss', label: t('common:components.Header.about') },
    { href: 'https://klimatkollen.teamtailor.com/', label: t('common:components.Header.jobs'), target: '_blank' },
    { href: '/in-english', label: t('common:components.Header.english') },
  ]

  return (
    <HeaderContainer>
      <Link href="/">

        <LogoContainer>
          <Image
            src="/logos/klimatkollen_logo_black.svg"
            width="150"
            height="32"
            alt="Klimatkollen logotyp"
          />
        </LogoContainer>

      </Link>
      <NavigationList>
        {navigationItems.map((item) => (
          <NavigationItem key={item.label}>
            <NavigationLink href={item.href} target={item.target || undefined}>{item.label}</NavigationLink>
          </NavigationItem>
        ))}
      </NavigationList>
      <HamburgerMenu>
        <HamburgerButton type="button" onClick={() => setMenuOpen(!menuOpen)}>
          <Image src="/icons/menu.svg" width="32" height="32" alt={t('common:components.Header.menu')} />
        </HamburgerButton>
        {menuOpen && (
          <FullScreenMenu>
            <CloseButtonContainer>
              <HamburgerButton type="button" onClick={() => setMenuOpen(false)}>
                <Image src="/icons/close_round.svg" width="32" height="32" alt={t('common:actions.close')} />
              </HamburgerButton>
            </CloseButtonContainer>
            <Separator />
            {navigationItems.map((item) => (
              <HamburgerItem key={item.label}>
                <HamburgerLink href={item.href} target={item.target || undefined}>
                  {item.label}
                </HamburgerLink>
              </HamburgerItem>
            ))}
          </FullScreenMenu>
        )}
      </HamburgerMenu>
    </HeaderContainer>
  )
}

export default Header
