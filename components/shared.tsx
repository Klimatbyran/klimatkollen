import styled from 'styled-components'
import Image from 'next/image'
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
  font-size: 16px;
  font-family: 'DM Sans Variable', sans-serif;
  line-height: 20px;
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
  font-size: 15px;
  margin: 8px;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 32px;
  margin: 32px 0;
`

export const GridItem = styled.div`
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;

  & > img {
    flex-shrink: 0;
  }

  & > b {
    clear: both;
    margin: 8px 0;
    font-weight: 700;
  }
`

export const GridImage = styled(Image)`
  border-radius: 50%;
`
