import { useState } from 'react'
import styled from 'styled-components'
import Info from '../public/icons/info.svg'
import { colorTheme } from '../Theme'

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`

const Tooltip = styled.div`
  position: absolute;
  width: 200px;
  top: 10px;
  right: 10px;
  background: black;
  color: ${colorTheme.offWhite};
  padding: 10px;
  border-radius: 5px;
  font: 0.8em "Borna";
  z-index: 100;
`

const InfoIcon = styled(Info)`
  transform: scale(0.6); 
`

type TooltipProps = {
  text: string
}

function InfoTooltip({ text }: TooltipProps) {
  const [show, setShow] = useState(false)

  return (
    <Wrapper>
      <InfoIcon
        onMouseOver={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      />
      {show
        && (
        <Tooltip>
          {text}
        </Tooltip>
        )}
    </Wrapper>
  )
}

export default InfoTooltip
