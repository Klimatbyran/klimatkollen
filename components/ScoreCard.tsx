import styled from 'styled-components'
import Link from 'next/link'
import FactSection from './FactSection'
import Icon from './../public/icons/arrow.svg'
<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> c63917e (klimatplaner added)
=======
>>>>>>> 169a46f (messy merge :( but everything back to normal)

const StyledDiv = styled.div`
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 15px 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: ${(props) => props.theme.darkestGrey};
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
  // Below removed until we've found a better way to weigh emission per capita
  // emissionLastYear,
  // population,
  politicalRule,
}: Props) => {
  const rankFormatted = rank + ' av 290 kommuner'
  const politicalRuleFormatted = politicalRule ? politicalRule.join(', ') : 'Data saknas'

  return (
    <StyledDiv>
      {rank && <FactSection
        heading='Kommunens utsläppsrankning'
        data={rankFormatted}
        info={
          <>
            Genomsnittlig årlig procentuell förändring av koldioxidutsläppen sedan Parisavtalet 2015.
          </>
        }
      />}
      {budget && <FactSection
        heading='Koldioxidbudget'
        data={formatter.format(Math.round(budget)) + ' ton'}
        info={
          <>
            Mängden koldioxid kvar att släppa ut för att klara Parisavtalets 1,5-gradersmål, läs mer om koldioxidbudgetar{' '}
            <Link href="https://klimatkollen.se/Paris_compliant_Swedish_CO2_budgets-March_2022-Stoddard&Anderson.pdf">här</Link>.
          </>
        }
      />}
      {budgetRunsOut && <FactSection
        heading='Koldioxidbudgeten tar slut'
        data={budgetRunsOut === 'Aldrig' ? 'Med nuvarande trend håller kommunen sin budget' : budgetRunsOut}
        info={
          <>
            Datum då kommunens koldioxidbudget tar slut om utsläppen fortsätter enligt nuvarande trend.
          </>
        }
      />}
      {<FactSection
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
      {politicalRule && <FactSection
        heading='Här styr'
        data={politicalRuleFormatted}
        info={
          <>Uppgift om politiskt styre är hämtad från{' '}
            <a
              href="https://skr.se/skr/demokratiledningstyrning/valmaktfordelning/valresultatstyren/styrekommunereftervalet2022.69547.html"
              target="_blank"
              rel="noreferrer">
              Sveriges Kommuner och Regioner (SKR)
            </a>
            . Data uppdaterad mars 2023.
          </>}
      />}
    </StyledDiv>
  )
}

export default ScoreCard
