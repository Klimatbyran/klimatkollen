import styled from 'styled-components'
import { colorTheme } from '../Theme'
import { devices } from '../utils/devices'

export const mapColors = [
  colorTheme.red,
  colorTheme.orange,
  colorTheme.darkYellow,
  colorTheme.lightYellow,
  colorTheme.beige,
  colorTheme.lightBlue,
]

export const IconButton = styled.button`
  border: none;
  background-color: none;
  cursor: pointer;
  background-color: inherit;
  color: ${({ theme }) => theme.offWhite};
  font-family: 'Borna';
  font-weight: 300;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 1rem;
`

export const Square = styled.div<{ color: string }>`
  background-color: ${(props) => props.color};
  border-radius: 4px;
  width: 20px;
  height: 20px;
  position: relative;
  margin-bottom: 1px;
`

export const UnorderedList = styled.ul`
  list-style-position: inside;
  margin: 16px;
`

export const OrderedList = styled.ol`
  list-style-position: inside;
  margin: 16px;
`

export const ListItem = styled.li`
  font-family: 'Anonymous Pro';
  font-size: 15px;
  margin: 8px;
`

export const LoadingContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: grey;
  font-size: 10px;
`

// For radio and checkbox menus

export const MenuContainer = styled.div`
  gap: 8px;
  display: flex;
  font-weight: bolder;
  flex-wrap: wrap;
  justify-content: center;

  @media only screen and (${devices.tablet}) {
    gap: 16px;
  }
`

export const MenuLabel = styled.label<{$borderColor: string, $backgroundColor: string}>`
  padding: 0.5rem 1rem;
  font-family: 'Anonymous Pro';
  font-size: 14px;
  line-height: 24px;
  text-decoration: none;
  color: ${({ theme }) => theme.offWhite};
  border: 1px solid ${(props) => props.$borderColor};
  border-radius: 8px;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background: ${(props) => props.$backgroundColor};
  }
`

export const MenuInput = styled.input<{$backgroundColor: string, $hoverColor: string}>`
  display: none;
  &:checked + ${MenuLabel} {
    color: ${({ theme }) => theme.black};
    background: ${(props) => props.$backgroundColor};

    &:hover {
      background: ${(props) => props.$hoverColor};
    }
  }
`
