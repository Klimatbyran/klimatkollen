import styled from 'styled-components'
import { H3 } from './Typography'

export const IconButton = styled.button`
  border: none;
  background-color: none;
  cursor: pointer;
  background-color: inherit;
  color: #fff;
  font-family: 'Roboto';
  font-weight: 300;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 1rem;
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

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0.8rem 0;
`

export const SectionLeft = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 90%;
`

export const SectionRight = styled.section`
  text-align: right; 
`

export const InfoHeading = styled(H3)`
  font-weight: 200;
  font-size: inherit;
`
