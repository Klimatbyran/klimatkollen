import { useState } from 'react'
import styled from 'styled-components'

import { H5 } from './Typography'
import ArrowSvg from '../public/icons/arrow-down-round.svg'
import { colorTheme } from '../Theme'
import Markdown from './Markdown'

const TextSection = styled.details`
  display: flex;
  flex-direction: column;

  gap: 15px;
  margin-bottom: 2rem;
`

const Arrow = styled(ArrowSvg)<{ open: boolean }>`
  transform: rotate(${(props) => (props.open ? '180deg' : '0')});

  & path {
    fill: ${(props) => (props.open ? colorTheme.newColors.blue3 : colorTheme.newColors.white)};
  }
`

const HeaderSection = styled.summary`
  display: flex;
  justify-content: space-between;
  width: 100%;
  list-style: none; /* remove default arrow in Firefox */
  padding: 0.5rem 0;

  &::-webkit-details-marker {
    display: none; /* remove default arrow in Chrome */
  }

  &:hover {
    cursor: pointer;
  }
`

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
`

type Props = {
  header: string
  text: JSX.Element | string
}

function ToggleSection({ header, text }: Props) {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <TextSection onToggle={(event) => setOpen((event.target as HTMLDetailsElement).open)}>
      <HeaderSection>
        <H5>{header}</H5>
        <Arrow open={open} />
      </HeaderSection>
      <InfoSection>
        {typeof text === 'string' ? <Markdown>{text}</Markdown> : text}
      </InfoSection>
    </TextSection>
  )
}

export default ToggleSection
