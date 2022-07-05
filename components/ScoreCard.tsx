import styled from 'styled-components'
import { H3, Paragraph, ParagraphBold } from './Typography'
import Icon from '../public/icons/info.svg'
import IconGreen from '../public/icons/info-green.svg'
import { useState } from 'react'
import { devices } from '../utils/devices'
import Link from 'next/link'

const StyledDiv = styled.div`
  background: ${({ theme }) => theme.black};

  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 15px 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  // max-width: 450px;

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

const InfoHeading = styled(H3)`
  font-weight: 200;
  font-size: inherit;
`

const InfoParagraph = styled(Paragraph)`
  margin: 0;
`

type Props = {
  population: number | null
  budget: number | null
  municipality: string
  politicalRule: Array<string> | null
  rank: number | null
}

const formatter = new Intl.NumberFormat('sv-SV', { maximumSignificantDigits: 8 })

const ScoreCard = ({ population, budget, rank, politicalRule }: Props) => {
  const [togglePopulation, setTogglePopulation] = useState(false)
  const [togglePoliticalRule, setTogglePoliticalRule] = useState(false)
  const [toggleBudget, setToggleBudget] = useState(false)
  const [toggleEmissionsPerCapita, setToggleEmissionsPerCapita] = useState(false)

  const politicalRuleFormatted = politicalRule?.join(', ')

  return (
    <StyledDiv>
      {rank && (
        <div className="row">
          <section className="left">
            <InfoHeading>Rankning av utsläppsminskningstakt sedan 2015</InfoHeading>
            <ParagraphBold>{rank} av 290 kommuner</ParagraphBold>
          </section>
        </div>
      )}
      {budget && (
        <>
          <div className="row">
            <section className="left">
              <InfoHeading>Koldioxidbudget</InfoHeading>
              <ParagraphBold>{formatter.format(Math.round(budget))} ton</ParagraphBold>
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
                <InfoParagraph>
                  Mängden koldioxid kvar att släppa ut för att klara Parisavtalets
                  1,5-gradersmål, läs mer{' '}
                  <Link href="/#source-budget-expl">om beräkningen här</Link>.
                </InfoParagraph>
              </InfoSection>
            ) : null}
          </section>
        </>
      )}

      {/* <div className="row">
        <section className="left">
          <Paragraph>Klimatutsläpp per invånare</Paragraph>
          <ParagraphBold>5 ton/år</ParagraphBold>
        </section>
        <section className="right">
          <StyledIcon
            onClick={() => setToggleEmissionsPerCapita(!toggleEmissionsPerCapita)}>
            {toggleEmissionsPerCapita ? <IconGreen /> : <Icon />}
          </StyledIcon>
        </section>
      </div> */}
      <section>
        {toggleEmissionsPerCapita ? (
          <InfoSection>
            <Paragraph>
              Gäller så kallade territoriella koldioxidutsläpp i Sverige per invånare.
              Data från{' '}
              <a
                href="https://nationellaemissionsdatabasen.smhi.se/"
                target="_blank"
                rel="noreferrer">
                nationella emissionsdatabasen.
              </a>
            </Paragraph>
          </InfoSection>
        ) : null}
      </section>
      <div className="row">
        <section className="left">
          <InfoHeading>Här styr</InfoHeading>
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
            <InfoParagraph>
              Uppgift om politiskt styre är hämtad från{' '}
              <a
                href="https://skr.se/skr/demokratiledningstyrning/valmaktfordelning/valresultatstyren/styreikommunereftervalet2018.26791.html"
                target="_blank"
                rel="noreferrer">
                Sveriges Kommuner och Regioner.
              </a>{' '}
              Data uppdaterad januari 2022.
            </InfoParagraph>
          </InfoSection>
        ) : null}
      </section>
      {population && (
        <>
          <div className="row">
            <section className="left">
              <InfoHeading>Antal invånare</InfoHeading>
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
                <InfoParagraph>Uppgift hämtad från Wikimedia.</InfoParagraph>
              </InfoSection>
            ) : null}
          </section>
        </>
      )}
    </StyledDiv>
  )
}

export default ScoreCard
