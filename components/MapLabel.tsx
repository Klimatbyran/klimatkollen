import styled from 'styled-components'
import { devices } from '../utils/devices'

import Icon from './../public/icons/arrow.svg'
import { Paragraph } from './Typography'


const Label = styled.div`
  flex-shrink: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &:first-child div {
    border-top-left-radius: 10%;
    border-top-right-radius: 10%;
  }
  &:last-child div {
    border-bottom-left-radius: 10%;
    border-bottom-right-radius: 10%;
  }
`

const Square = styled.div<{ color: string }>`
  background-color: ${(props) => props.color};
  width: 20px;
  height: 20px;
  position: relative;
`

const ArrowIcon = styled(Icon) <{ rotateUp?: boolean }>`
  position: absolute;
  z-index: 1;
  margin: auto;
  left: 0;
  ${(props) => props.rotateUp && 'transform: rotate(-90deg)'};
  right: 0;
  top: 0;
  bottom: 0;
`


const StyledParagraph = styled(Paragraph)`
  z-index: 1;
  width: 5em;
  font-size: 0.7em;
  margin: 0;
  line-height: 0;

  @media only screen and (${devices.tablet}) {
    font-size: 0.9em;
  }
`

type Props = {
  color: string
  label: string
  rotateUp?: boolean
}

const MapLabel = ({ color, label, rotateUp = false}: Props) => {
  return (
    <Label>
      <Square color={color}>
        {/* FIXME needed? <ArrowIcon rotateUp={rotateUp} />*/}
      </Square>
      <StyledParagraph>{label}</StyledParagraph>
    </Label>
  )
}

export default MapLabel
