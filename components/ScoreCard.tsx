import styled from 'styled-components'
import { devices } from '../utils/devices'
import Link from 'next/link'
import ScoreCardSection from './ScoreCardSection'

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

type Props = {
  rank: number | null
  budget: number | null
  budgetRunsOut: string
  emissionChangePercent: number
  emissionLastYear: number | undefined
  population: number | null
  politicalRule: Array<string> | null
}

const formatter = new Intl.NumberFormat('sv-SV', { maximumSignificantDigits: 8 })

const ScoreCard = ({
  rank,
  budget,
  budgetRunsOut,
  emissionChangePercent,
  emissionLastYear,
  population,
  politicalRule
}: Props) => {
  const rankFormatted = rank + ' av 290 kommuner'
  const politicalRuleFormatted = politicalRule ? politicalRule.join(', ') : 'Data saknas'

  return (
    <StyledDiv>
      {rank && <ScoreCardSection
        heading='Kommunens utsläppsrankning'
        data={rankFormatted}
        info={
          <>
            Genomsnittlig årlig procentuell förändring av koldioxidutsläppen sedan Parisavtalet 2015
          </>
        }
      />}
      {budget && <ScoreCardSection
        heading='Koldioxidbudget'
        data={formatter.format(Math.round(budget)) + ' ton'}
        info={
          <>
            Mängden koldioxid kvar att släppa ut för att klara Parisavtalets 1,5-gradersmål, läs mer om koldioxidbudgetar{' '}
            <Link href="https://klimatkollen.se/Paris_compliant_Swedish_CO2_budgets-March_2022-Stoddard&Anderson.pdf">här</Link>.
          </>
        }
      />}
      {budgetRunsOut && <ScoreCardSection
        heading='Koldioxidbudgeten tar slut'
        data={budgetRunsOut === 'Aldrig' ? 'Med nuvarande trend håller kommunen sin budget' : budgetRunsOut}
        info={
          <>
            Datum då kommunens koldioxidbudget tar slut om utsläppen fortsätter enligt nuvarande trend.
          </>
        }
      />}
      {<ScoreCardSection
        heading='Utsläppsminskning för att klara Parisavtalet'
        data={'-' + emissionChangePercent.toFixed(1) + '% per år'}
        info={
          <>
            Årlig procentuell utsläppsminskning som krävs för att kommunen inte ska överskrida sin koldioxidbudget.
          </>
        }
      />}
      {/* Hide until we've found a better way to weight the values  
      {emissionLastYear && population && <ScoreCardSection
        heading='Koldioxidutsläpp per invånare'
        data={(emissionLastYear / population).toFixed(1) + ' ton koldioxid per år'}
        info={
          <>
            Kommunens utsläpp utslaget på dess {formatter.format(population)} invånare.
            Invånarantal hämtat från{' '}
            <a href="https://www.wikidata.org/wiki/Wikidata:Country_subdivision_task_force/Sweden/Municipalities"
              target="_blank"
              rel="noreferrer">
              Wikidata
            </a>,
            utsläpp från{' '}
            <a
              href="https://nationellaemissionsdatabasen.smhi.se/"
              target="_blank"
              rel="noreferrer">
              nationella emissionsdatabasen
            </a>.
          </>
        }
      />} */}
      {politicalRule && <ScoreCardSection
        heading='Här styr'
        data={politicalRuleFormatted}
        info={
          <>Uppgift om politiskt styre är hämtad från{' '}
            <a
              href="https://skr.se/skr/demokratiledningstyrning/valmaktfordelning/valresultatstyren/styreikommunereftervalet2018.26791.html"
              target="_blank"
              rel="noreferrer">
              Sveriges Kommuner och Regioner (SKR)
            </a>
            . Informationen gäller föregående mandatperiod, vi väntar på ny data från SKR i mars 2023.
          </>}
      />}
    </StyledDiv>
  )
}

export default ScoreCard
