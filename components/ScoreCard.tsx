import styled from 'styled-components'
import { Paragraph, ParagraphBold } from './Typography'
import Icon from '../public/icons/info.svg'

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
    width: 90%;
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
  population: number | null
  budget: number | null
  politicalRule: Array<string> | null
}

const formatter = new Intl.NumberFormat('sv-SV', { maximumSignificantDigits: 8 })

const ScoreCard = ({ population, budget, politicalRule }: Props) => {

  const politicalRuleFormatted = politicalRule?.join(', ')

  return (
    <StyledDiv>
      {population && (
        <div className="row">
          <section className="left">
            <Paragraph>Antal invånare</Paragraph>
            <ParagraphBold>{formatter.format(population)}</ParagraphBold>
          </section>
          <section className="right">
            <StyledIcon>
              <Icon />
            </StyledIcon>
          </section>
        </div>
      )}

      <div className="row">
        <section className="left">
          <Paragraph>Här styr</Paragraph>
          <ParagraphBold>{politicalRuleFormatted}</ParagraphBold>
        </section>
        <section className="right">
          <StyledIcon>
            <Icon />
          </StyledIcon>
        </section>
      </div>

      {budget && (
        <div className="row">
          <section className="left">
            <Paragraph>Koldioxidbudget</Paragraph>
            <ParagraphBold>{formatter.format(Math.round(budget))} ton co2</ParagraphBold>
          </section>
          <section className="right">
            <StyledIcon>
              <Icon />
            </StyledIcon>
          </section>
        </div>
      )}

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
