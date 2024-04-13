import styled from 'styled-components'
import { useState } from 'react'

import Markdown from '../Markdown'
import Icon from '../../public/icons/add_light_green.svg'
import IconGreen from '../../public/icons/remove_light_green.svg'
import { Paragraph } from '../Typography'
import { devices } from '../../utils/devices'

const BorderContainer = styled.details`
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.midGreen};
`

const Row = styled.summary`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  cursor: pointer;
`

const InfoParagraph = styled(Paragraph)`
  margin: 16px 0 0 0;
  font-size: 12px;

  @media only screen and (${devices.tablet}) {
    font-size: 13px;
  }
`

const StyledParagraph = styled(Paragraph)`
  font-size: 14px;
  flex: 1;

  @media only screen and (${devices.tablet}) {
    font-size: 16px;
  }
`

const SectionRight = styled.div`
  text-align: right; 
`

const StyledIcon = styled.div`
  margin-left: 16px;

  &:hover {
    cursor: pointer;
  }
`

type Props = {
  heading: string
  data: string
  info?: string
}

function ScorecardSection({ heading, data, info }: Props) {
  const [toggle, setToggle] = useState(false)

  const onToggle = () => setToggle(!toggle)

  return (
    <BorderContainer onToggle={onToggle}>
      <Row>
        <StyledParagraph>{heading}</StyledParagraph>
        <StyledParagraph>{data}</StyledParagraph>
        {info && (
        <SectionRight>
          <StyledIcon>
            {toggle ? <IconGreen /> : <Icon />}
          </StyledIcon>
        </SectionRight>
        )}
      </Row>
      {toggle ? (
        <Markdown components={{ p: InfoParagraph }}>
          {info}
        </Markdown>
      ) : null}
    </BorderContainer>
  )
}

export default ScorecardSection
