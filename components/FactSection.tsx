import styled from 'styled-components'
import { useState } from 'react'

import { H3, ParagraphBold } from './Typography'
import Icon from '../public/icons/add_light_white.svg'
import IconGreen from '../public/icons/remove_light_white.svg'

const Row = styled.summary`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0.8rem 0;
  cursor: pointer;
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

const InfoSection = styled.div`
  background: ${({ theme }) => theme.midGreen};
  color: ${({ theme }) => theme.black};
  padding: 15px 10px;
  border-radius: 4px;
  margin-bottom: 10px;

  & a {
    text-decoration: underline;
    cursor: pointer;
  }
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

function FactSection({ heading, data, info }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <details onToggle={(event) => setOpen((event.target as HTMLDetailsElement).open)}>
      <Row>
        <SectionLeft>
          <InfoHeading>{heading}</InfoHeading>
          <ParagraphBold>{data}</ParagraphBold>
        </SectionLeft>
        {info && (
        <SectionRight>
          <StyledIcon>
            {open ? <IconGreen /> : <Icon />}
          </StyledIcon>
        </SectionRight>
        )}
      </Row>
      <InfoSection>
        {info}
      </InfoSection>
    </details>
  )
}

export default FactSection
