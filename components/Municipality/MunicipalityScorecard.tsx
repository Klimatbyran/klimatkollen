import styled, { css } from 'styled-components'
import Link from 'next/link'
import ScorecardSection from './ScorecardSection'
import { ClimatePlan } from '../../utils/types'
import { H4, H5, ParagraphItalic } from '../Typography'
import Icon from '../../public/icons/boxedArrow.svg'
import PlanIcon from '../../public/icons/climatePlan.svg'
import FactSection from '../FactSection'

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 64px;
`

const StyledH4 = styled(H4)`
  margin-top: 32px;
  margin-bottom: 32px;
  width: 100%;
`

const GreyContainer = styled.div`
  background: ${({ theme }) => theme.lightBlack};
  border-radius: 8px;
  padding: 16px 16px 0 16px;
  margin-bottom: 8px;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const SectionLeft = styled.section`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 90%;
`

const SectionRight = styled.section`
  text-align: right;
`

const ArrowIcon = styled(Icon)`
  width: 32px;
  height: 32px;
  position: absolute;
  z-index: 1;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  fill: black;
`

const LinkButton = styled.button`
  height: 36px;
  color: black;
  background: ${({ theme }) => theme.lightGreen};
  border-radius: 4px;
  border: 1px solid transparent;
  padding: 0.8rem 1rem 0.8rem 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: ${({ theme }) => theme.lightGreen};
  }
  & a {
    text-decoration: none;
  }
  ${({ disabled }) => disabled
    && css`
      color: ${({ theme }) => theme.lightBlack};
      background: ${({ theme }) => theme.darkGreenOne};
      cursor: not-allowed;

      /* Remove hover effect */
      &:hover {
        background: ${({ theme }) => theme.darkGreenOne};
      }

      /* Set color of ArrowIcon to lightBlack */
      & ${ArrowIcon} {
        fill: ${({ theme }) => theme.lightBlack};
      }
    `}
`

const Square = styled.div`
  width: 16px;
  height: 16px;
  position: relative;
  border-radius: 4px;
`

const CommentContainer = styled.div`
  margin-top: 8px;
`

const Comment = styled.span`
  font-weight: bold;
`

type Props = {
  name: string
  rank: number | null
  budget: number | null
  budgetRunsOut: string
  emissionChangePercent: number
  politicalRule: Array<string> | null
  climatePlan: ClimatePlan
}

const formatter = new Intl.NumberFormat('sv-SV', { maximumSignificantDigits: 8 })

function Scorecard({
  name,
  rank,
  budget,
  budgetRunsOut,
  emissionChangePercent,
  politicalRule,
  climatePlan,
}: Props) {
  const climatePlanYearFormatted = climatePlan.YearAdapted !== 'Saknas'
    ? `Antagen ${climatePlan.YearAdapted}`
    : climatePlan.YearAdapted
  const rankFormatted = `${rank} av 290`
  const politicalRuleFormatted = politicalRule ? politicalRule.join(', ') : 'Data saknas'

  const handleButtonClick = () => {
    if (climatePlan.Link !== 'Saknas') {
      window.open(climatePlan.Link, '_blank')
    }
  }

  return (
    <StyledDiv>
      <StyledH4>
        Fakta om
        {' '}
        {name}
      </StyledH4>
      <GreyContainer>
        <Row>
          <SectionLeft>
            <PlanIcon />
            <H5>Klimatplan</H5>
          </SectionLeft>
          <SectionRight>
            <LinkButton
              onClick={handleButtonClick}
              disabled={climatePlan.Link === 'Saknas'}
            >
              Öppna
              <Square>
                <ArrowIcon />
              </Square>
            </LinkButton>
          </SectionRight>
        </Row>
        <FactSection
          heading={climatePlanYearFormatted}
          data=""
          info={(
            <>
              Avser nu gällande klimathandlingsplan eller motsvarande. Inte
              klimatanpassningsplaner, utsläppsbudgetar, klimatlöften, miljöpolicies eller
              liknande. Klicka
              {' '}
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSfCYZno3qnvY2En0OgRmGPxsrovXyAq7li52BuLalavMBbghA/viewform?usp=sf_link"
                target="_blank"
                rel="noreferrer"
              >
                här
              </a>
              {' '}
              för att redigera informationen.
              <CommentContainer>
                <Comment>Kommentar:</Comment>
                {' '}
                {climatePlan.Comment}
              </CommentContainer>
            </>
          )}
        />
      </GreyContainer>
      {rank && (
        <ScorecardSection
          heading="Kommunens plats i utsläppsrankning"
          data={rankFormatted}
          info={(
            <>
              Rankning av Sveriges 290 kommuner baserat på genomsnittlig årlig procentuell
              förändring av koldioxidutsläppen sedan Parisavtalet 2015.
            </>
          )}
        />
      )}
      {['Gotland', 'Skövde', 'Mörbylånga'].includes(name) && (
        <ParagraphItalic>
          Utsläpp från cementproduktion exkluderad, i enlighet med IPCC:s koldioxidbudget,
          läs mer
          {' '}
          <a href="/kallor-och-metod">här</a>
        </ParagraphItalic>
      )}
      {budget && (
        <ScorecardSection
          heading="Koldioxidbudget"
          data={`${formatter.format(Math.round(budget))} ton`}
          info={(
            <>
              Mängden koldioxid kvar att släppa ut för att klara Parisavtalets
              1,5-gradersmål, läs mer om koldioxidbudgetar
              {' '}
              <Link href="https://klimatkollen.se/Paris_compliant_Swedish_CO2_budgets-March_2022-Stoddard&Anderson.pdf">
                här
              </Link>
              .
            </>
          )}
        />
      )}
      {budgetRunsOut && (
        <ScorecardSection
          heading="Koldioxidbudgeten tar slut"
          data={
            budgetRunsOut === 'Aldrig'
              ? 'Med nuvarande trend håller kommunen sin budget'
              : budgetRunsOut
          }
          info={(
            <>
              Datum då kommunens koldioxidbudget tar slut om utsläppen fortsätter enligt
              nuvarande trend.
            </>
          )}
        />
      )}
      <ScorecardSection
        heading="Utsläppsminskning för att klara Parisavtalet"
        data={`-${emissionChangePercent.toFixed(1)}% per år`}
        info={(
          <>
            Årlig procentuell utsläppsminskning som krävs för att kommunen inte ska
            överskrida sin koldioxidbudget.
          </>
        )}
      />
      {politicalRule && (
        <ScorecardSection
          heading="Här styr"
          data={politicalRuleFormatted}
          info={(
            <>
              Uppgift om politiskt styre är hämtad från
              {' '}
              <a
                href="https://skr.se/skr/demokratiledningstyrning/valmaktfordelning/valresultatstyren/styrekommunereftervalet2022.69547.html"
                target="_blank"
                rel="noreferrer"
              >
                Sveriges Kommuner och Regioner (SKR)
              </a>
              . Data uppdaterad mars 2023.
            </>
          )}
        />
      )}
    </StyledDiv>
  )
}

export default Scorecard
