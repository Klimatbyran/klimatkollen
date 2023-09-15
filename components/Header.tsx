import styled from 'styled-components'
import Image from 'next/image'
import Link from 'next/link'

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem 1rem 1rem;
  background-color: ${({ theme }) => theme.midGreen};
`

const LogoContainer = styled.div`
  display: flex;
  align-items: center; /* Center vertically */
`

const NavigationList = styled.ul`
  list-style: none;
  display: flex;
  gap: 2rem;
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

// Header Component
function Header() {
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
          <NavigationLink href="/kallor-och-metod">Källor</NavigationLink>
        </NavigationItem>
        <NavigationItem>
          <NavigationLink href="/om-oss">Om oss</NavigationLink>
        </NavigationItem>
      </NavigationList>
    </HeaderContainer>
  )
}

export default Header
