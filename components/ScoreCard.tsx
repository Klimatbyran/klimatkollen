import styled from 'styled-components'
import { Paragraph, ParagraphBold } from './Typography'
import Icon from '../public/icons/info.svg'
import IconGreen from '../public/icons/info-green.svg'
import { useState } from 'react'
import { devices } from '../utils/devices'

const StyledDiv = styled.div`
  background: ${({ theme }) => theme.black};

  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 15px 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 450px;

  @media only screen and (${devices.tablet}) {
    background: ${(props) => props.theme.black};
  }

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

type Props = {
  population: number | null
  budget: number | null
  municipality: string
  politicalRule: Array<string> | null
}

const formatter = new Intl.NumberFormat('sv-SV', { maximumSignificantDigits: 8 })

const ScoreCard = ({ population, budget, municipality, politicalRule }: Props) => {
  const [togglePopulation, setTogglePopulation] = useState(false)
  const [togglePoliticalRule, setTogglePoliticalRule] = useState(false)
  const [toggleBudget, setToggleBudget] = useState(false)
  const [toggleEmissionsPerCapita, setToggleEmissionsPerCapita] = useState(false)

  const politicalRuleFormatted = politicalRule?.join(', ')

  return (
    <StyledDiv>
      {population && (
        <>
          <div className="row">
            <section className="left">
              <Paragraph>Antal invånare</Paragraph>
              <ParagraphBold>{formatter.format(population)}</ParagraphBold>
            </section>
            <section className="right">
              <StyledIcon onClick={() => setTogglePopulation(!togglePopulation)}>
                {togglePopulation ? <IconGreen /> : <Icon />}
              </StyledIcon>
            </section>
          </div>
          <section>
            {togglePopulation ? (
              <InfoSection>
                <Paragraph>Uppgift hämtad från Wikimedia.</Paragraph>
              </InfoSection>
            ) : null}
          </section>
        </>
      )}

      <div className="row">
        <section className="left">
          <Paragraph>Här styr</Paragraph>
          <ParagraphBold>{politicalRuleFormatted}</ParagraphBold>
        </section>
        <section className="right">
          <StyledIcon onClick={() => setTogglePoliticalRule(!togglePoliticalRule)}>
            {togglePoliticalRule ? <IconGreen /> : <Icon />}
          </StyledIcon>
        </section>
      </div>
      <section>
        {togglePoliticalRule ? (
          <InfoSection>
            <Paragraph>
              Uppgift hämtad från{' '}
              <a
                href="https://skr.se/skr/demokratiledningstyrning/valmaktfordelning/valresultatstyren/styreikommunereftervalet2018.26791.html"
                target="_blank"
                rel="noreferrer">
                Sveriges Kommuner och Regioner
              </a>
              .
            </Paragraph>
          </InfoSection>
        ) : null}
      </section>

      {budget && (
        <>
          <div className="row">
            <section className="left">
              <Paragraph>Koldioxidbudget</Paragraph>
              <ParagraphBold>
                {formatter.format(Math.round(budget))} ton co2
              </ParagraphBold>
            </section>
            <section className="right">
              <StyledIcon onClick={() => setToggleBudget(!toggleBudget)}>
                {toggleBudget ? <IconGreen /> : <Icon />}
              </StyledIcon>
            </section>
          </div>
          <section>
            {toggleBudget ? (
              <InfoSection>
                <Paragraph>
                  Mängden koldioxid kvar att släppa ut för att klara Parisavtalets
                  1,5-gradersmål, läs mer om beräkningen{' '}
                  <a
                    href="https://www.climateview.global/"
                    target="_blank"
                    rel="noreferrer">
                    här
                  </a>
                  .
                </Paragraph>
              </InfoSection>
            ) : null}
          </section>
        </>
      )}

      <div className="row">
        <section className="left">
          <Paragraph>Klimatutsläpp per invånare</Paragraph>
          <ParagraphBold>5 ton co2/år</ParagraphBold>
        </section>
        <section className="right">
          <StyledIcon
            onClick={() => setToggleEmissionsPerCapita(!toggleEmissionsPerCapita)}>
            {toggleEmissionsPerCapita ? <IconGreen /> : <Icon />}
          </StyledIcon>
        </section>
      </div>
      <section>
        {toggleEmissionsPerCapita ? (
          <InfoSection>
            <Paragraph>
              Sammanslagning av klimatutsläpp i {municipality} per invånare och
              konsumtionsbaserade utsläpp i Sverige per invånare.
            </Paragraph>
          </InfoSection>
        ) : null}
      </section>
    </StyledDiv>
  )
}

export default ScoreCard
