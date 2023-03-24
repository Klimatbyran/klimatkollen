import { useState } from 'react'
import styled from 'styled-components'

import { H5 } from './Typography'
import ArrowUp from '../public/icons/arrow-up-green.svg'
import ArrowDown from '../public/icons/arrow-down-round.svg'


const TextSection = styled.div`
  display: flex;
  flex-direction: column;

  gap: 15px;
  margin-bottom: 40px;
`

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;

  & .arrow {
    display: block;
  }

  :hover {
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

const ToggleSection = ({ header, text }: Props) => {
  const [toggle, setToggle] = useState(false)

  return (
    <>
      <TextSection>
        <HeaderSection onClick={() => setToggle(!toggle)}>
          <H5>{header}</H5>
          {toggle ? (
            <ArrowUp className="arrow" onClick={() => setToggle(!toggle)} />
          ) : (
            <ArrowDown
              className="arrow"
              onClick={() => setToggle(!toggle)}
            />
          )}
        </HeaderSection>
        {toggle && (
          <InfoSection>
            {text}
          </InfoSection>
        )}
      </TextSection>
    </>
  )
}

export default ToggleSection
