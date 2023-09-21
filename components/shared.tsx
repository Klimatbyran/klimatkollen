import styled from 'styled-components'
import { colorTheme } from '../Theme'

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
  width: 20px;
  height: 20px;
  position: relative;
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
  margin: 8px;
`
