import Link from 'next/link'
import styled from 'styled-components'
import ArrowRightWhite from '../public/icons/arrow-right-white.svg'

const Nav = styled.nav`
  margin-top: 28px;
  margin-bottom: 42px;
`

const NavList = styled.ul`
  list-style-type: none;
  display: flex;
  align-items: left;
  flex-wrap: wrap;
  border-top: 1px solid white;
  border-bottom: 1px solid white;
  flex-direction: column;
  justify-content: center;
`

const NavItem = styled.li`
  padding-top: 16px;
  padding-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:not(:first-child) {
    border-top: 1px solid white;
  }
`

const StyledLinkWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;
`

const StyledLink = styled.a`
  text-decoration: none;
  font-weight: bold;
`

const menuItems = [
  { path: '/kallor-och-metod', label: 'Källor och metod' },
  { path: '/om-oss', label: 'Om oss' },
]

function Navigation() {
  return (
    <Nav>
      <NavList>
        {menuItems.map((item) => (
          <NavItem key={item.path}>
            <Link href={item.path} passHref legacyBehavior>
              <StyledLinkWrapper>
                <StyledLink>{item.label}</StyledLink>
                <ArrowRightWhite />
              </StyledLinkWrapper>
            </Link>
          </NavItem>
        ))}
      </NavList>
    </Nav>
  )
}

export default Navigation
