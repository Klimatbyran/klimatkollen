import styled from 'styled-components'
import { devices } from '../../utils/devices'

import Icon from '../../public/icons/arrow.svg'
import { Paragraph } from '../Typography'
import { colorTheme } from '../../Theme'
import { mapColors } from '../shared'

const Container = styled.div`
  padding-left: 0.87rem;
  padding-top: 1.2rem;
  padding-bottom: 0.5rem;
  @media only screen and (${devices.tablet}) {
    position: absolute;
    left: 0;
    top: 0;
  }
`

const LabelBox = styled.div`
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

const ArrowIcon = styled(Icon)<{ rotateup?: boolean }>`
  color: black;
  position: absolute;
  z-index: 1;
  margin: auto;
  left: 0;
  ${(props) => props.rotateup && 'transform: rotate(-90deg)'};
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

type LabelProps = {
  color: string
  text: string
  rotateup?: boolean
}

function Label({ color, text, rotateup }: LabelProps) {
  return (
    <LabelBox>
      <Square color={color}>
        {rotateup !== undefined && <ArrowIcon rotateup={rotateup} />}
      </Square>
      <StyledParagraph>{text}</StyledParagraph>
    </LabelBox>
  )
}

type MapLabelsProps = {
  labels: string[]
  rotations: boolean[]
}

const MapLabels = ({ labels, rotations }: MapLabelsProps) => {
  const labelColors = labels.length === 2 ? [mapColors[0], mapColors[mapColors.length-1]] : mapColors

  return (
    <Container>
      {labels.map((label, i) => (
        <Label color={labelColors[i]} text={label} rotateup={rotations[i]} />
      ))}
    </Container>
  )
}

export default MapLabels
