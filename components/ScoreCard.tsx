import styled from 'styled-components'
import { Paragraph, ParagraphBold } from './Typography'
import Icon from '../public/icons/info.svg'
import { Municipality } from '../utils/types'

const StyledDiv = styled.div`
  min-width: 290px;
  max-width: 330px;
  background: ${({ theme }) => theme.dark};
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 15px 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  & div.row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0.8rem 0;
  }

  & section.left {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  & section.right {
    text-align: right;
  }
`

const StyledIcon = styled.div`
  margin-left: 12px;

  &:hover {
    cursor: pointer;
  }
`

type Props = {
  population?: number
}

const ScoreCard = ({ population }: Props) => {
  return (
    <StyledDiv>
        {population && 
      <div className="row">
        <section className="left">
          <Paragraph>Antal invånare</Paragraph>
          <ParagraphBold>{population}</ParagraphBold>
        </section>
        <section className="right">
          <StyledIcon>
            <Icon />
          </StyledIcon>
        </section>
      </div>
        }

      <div className="row">
        <section className="left">
          <Paragraph>Här styr</Paragraph>
          <ParagraphBold>Moderaterna</ParagraphBold>
        </section>
        <section className="right">
          <StyledIcon>
            <Icon />
          </StyledIcon>
        </section>
      </div>

      <div className="row">
        <section className="left">
          <Paragraph>Koldioxidbudget</Paragraph>
          <ParagraphBold>24 000 ton co2</ParagraphBold>
        </section>
        <section className="right">
          <StyledIcon>
            <Icon />
          </StyledIcon>
        </section>
      </div>

      <div className="row">
        <section className="left">
          <Paragraph>Klimatutsläpp per invånare</Paragraph>
          <ParagraphBold>5 ton co2/år</ParagraphBold>
        </section>
        <section className="right">
          <StyledIcon>
            <Icon />
          </StyledIcon>
        </section>
      </div>
    </StyledDiv>
  )
}

export default ScoreCard
