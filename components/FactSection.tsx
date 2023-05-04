import styled from 'styled-components'
import { useState } from 'react'

import { H3, Paragraph, ParagraphBold } from './Typography'
import Icon from '../public/icons/info.svg'
import IconGreen from '../public/icons/info-green.svg'
import { InfoHeading, Row, SectionLeft, SectionRight } from './shared'

const InfoSection = styled.div`
  background: ${({ theme }) => theme.main};
  color: ${({ theme }) => theme.darkestGrey};
  padding: 15px 10px;
  border-radius: 4px;
  margin-bottom: 10px;

  & a {
    text-decoration: underline;
    cursor: pointer;
  }
`

const InfoParagraph = styled(Paragraph)`
  margin: 0;
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
  info?: JSX.Element
}

const FactSection = ({ heading, data, info }: Props) => {
  const [toggle, setToggle] = useState(false)

  return (
    <>
      <Row>
        <SectionLeft>
          <InfoHeading>{heading}</InfoHeading>
          <ParagraphBold>{data}</ParagraphBold>
        </SectionLeft>
        {info && <SectionRight>
          <StyledIcon onClick={() => setToggle(!toggle)}>
            {toggle ? <IconGreen /> : <Icon />}
          </StyledIcon>
        </SectionRight>}
      </Row>
      <section>
        {toggle ? (
          <InfoSection>
            <InfoParagraph>
              {info}
            </InfoParagraph>
          </InfoSection>
        ) : null}
      </section>
    </>
  )
}

export default FactSection