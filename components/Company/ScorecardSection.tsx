import styled from 'styled-components'
import { useState } from 'react'

import Markdown from '../Markdown'
import IconAdd from '../../public/icons/add_light.svg'
import IconRemove from '../../public/icons/remove_light.svg'
import { Paragraph } from '../Typography'
import { devices } from '../../utils/devices'

const BorderContainer = styled.details`
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.newColors.blue3};
`

const Row = styled.summary`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  list-style: none; /* remove default arrow in Firefox */
  &::-webkit-details-marker {
    display: none; /* remove default arrow in Chrome */
  }
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
  color: ${({ theme }) => theme.newColors.blue3};

  &:hover {
    cursor: pointer;
  }
`

type Props = {
  heading: string
  data: string
  info?: string
}

// TODO: Maybe use similar component for both municipalities and companies

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
            {toggle ? <IconRemove /> : <IconAdd />}
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
