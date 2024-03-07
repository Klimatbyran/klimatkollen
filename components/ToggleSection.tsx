import { useState } from 'react'
import styled from 'styled-components'

import { H5 } from './Typography'
import ArrowSvg from '../public/icons/arrow-down-round.svg'

const TextSection = styled.details`
  display: flex;
  flex-direction: column;

  gap: 15px;
  margin-bottom: 40px;
`

const Arrow = styled(ArrowSvg)<{ open: boolean }>`
  transform: rotate(${props => props.open ? '180deg' : '0'});

  & path {
    fill: ${props => props.open ? '#91DFC8' : '#F2F2F2'};
  }
`

const HeaderSection = styled.summary`
  display: flex;
  justify-content: space-between;

  & .arrow {
    display: block;
  }

  &:hover {
    cursor: pointer;
  }
`

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;

  .mobile {
    background: black;
  }

  .desktop {
    background: yellow;
  }
`

type Props = {
  header: string
  text: JSX.Element
}

function ToggleSection({ header, text }: Props) {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <TextSection onToggle={(event) => setOpen((event.target as HTMLDetailsElement).open)}>
      <HeaderSection>
        <H5>{header}</H5>
        <Arrow open={open} className="arrow" />
      </HeaderSection>
      <InfoSection>
        {text}
      </InfoSection>
    </TextSection>
  )
}

export default ToggleSection
