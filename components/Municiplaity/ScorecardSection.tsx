import styled from 'styled-components'
import { useState } from 'react'

import Icon from '../../public/icons/add_light_green.svg'
import IconGreen from '../../public/icons/remove_light_green.svg'
import { H3, Paragraph, ParagraphBold } from '../Typography'

const BorderContainer = styled.div`
padding: 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.midGreen};
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const SectionLeft = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 90%;
`

const SectionRight = styled.section`
  text-align: right; 
`

const InfoHeading = styled(H3)`
  font-weight: 200;
  font-size: inherit;
`

const InfoParagraph = styled(Paragraph)`
  margin: 16px 0 0 0;
  font-size: 13px;
`

const StyledIcon = styled.div`
  margin-left: 12px;

  &:hover {
    cursor: pointer;
  }
`

type Props = {
  heading: string
  data: string
  info?: JSX.Element | string
}

function ScorecardSection({ heading, data, info }: Props) {
  const [toggle, setToggle] = useState(false)

  return (
    <BorderContainer>
      <Row>
        <SectionLeft>
          <InfoHeading>{heading}</InfoHeading>
          <ParagraphBold>{data}</ParagraphBold>
        </SectionLeft>
        {info && (
        <SectionRight>
          <StyledIcon onClick={() => setToggle(!toggle)}>
            {toggle ? <IconGreen /> : <Icon />}
          </StyledIcon>
        </SectionRight>
        )}
      </Row>
      <section>
        {toggle ? (
          <InfoParagraph>
            {info}
          </InfoParagraph>
        ) : null}
      </section>
    </BorderContainer>
  )
}

export default ScorecardSection
