import styled from 'styled-components'
import { useState } from 'react'

import { H3, Paragraph, ParagraphBold } from './Typography'
import Icon from '../public/icons/info.svg'
import IconGreen from '../public/icons/info-green.svg'
import ScoreCard from './ScoreCard'


const InfoSection = styled.div`
  background: ${({ theme }) => theme.main};
  color: ${({ theme }) => theme.black};
  padding: 15px 10px;
  border-radius: 4px;
  margin-bottom: 10px;

  & a {
    text-decoration: underline;
    cursor: pointer;
  }
`

const InfoHeading = styled(H3)`
  font-weight: 200;
  font-size: inherit;
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

const ScoreCardSection = ({ heading, data, info }: Props) => {
  const [toggle, setToggle] = useState(false)

  return (
    <>
      <div className="row">
        <section className="left">
          <InfoHeading>{heading}</InfoHeading>
          <ParagraphBold>{data}</ParagraphBold>
        </section>
        {info && <section className="right">
          <StyledIcon onClick={() => setToggle(!toggle)}>
            {toggle ? <IconGreen /> : <Icon />}
          </StyledIcon>
        </section>}
      </div>
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

export default ScoreCardSection