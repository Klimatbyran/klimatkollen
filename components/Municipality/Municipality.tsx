/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import styled from 'styled-components'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { H2, H4, ParagraphBold } from '../Typography'
import BackArrow from '../BackArrow'
import PageWrapper from '../PageWrapper'
import DropDown from '../DropDown'
import Scorecard from './MunicipalityScorecard'
import { devices } from '../../utils/devices'
import { Municipality as TMunicipality } from '../../utils/types'
import MunicipalitySolutions from './MunicipalitySolutions'
import MunicipalityEmissionGraph from './MunicipalityEmissionGraph'
import MunicipalityEmissionNumbers from './MunicipalityEmissionNumbers'
import {
  chartDescriptions,
  chartsKeys,
  defaultChart,
} from '../../data/chart_descriptions'
import { normalizeString } from '../../utils/shared'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 48px;
`

const HeaderSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  margin-top: 20px;
`

const CoatOfArmsImage = styled.img`
  width: 30px;
  margin-right: 24px;
`

const StyledH2 = styled(H2)`
  font-family: 'Anonymous Pro', monospace;
  font-weight: 400;
`

const Bottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;

  @media only screen and (${devices.tablet}) {
    // flex-direction: row-reverse;
  }
`

const DropDownSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 30px;
  text-align: center;
  align-items: center;
`

type Props = {
  municipality: TMunicipality
  coatOfArmsImage: string | null
  municipalitiesName: Array<string>
}

/* todo
- fixa en "Läs mer"-komponent man kan fälla ut på kommunvyn
- fixa så att grafer från urlen visas markerade på grafen
- om man klickar av historiskt ska de(t) datasetet man hade öppet komma tillbaka
*/

function Municipality(props: Props) {
  const { municipality, coatOfArmsImage, municipalitiesName } = props
  const router = useRouter()
  // fixme fortsätt här, är routeCharts undefined
  const routeCharts = router.query.charts as string | string[]
  const [selectedCharts, setSelectedCharts] = useState<string[]>([routeCharts as string])

  console.log('routeCharts', routeCharts)

  useEffect(() => {
    if (routeCharts) {
      const charts = (routeCharts as string)?.split('+')
      setSelectedCharts(charts)
    } else {
      // If there are no charts in the URL, set it to the default chart
      setSelectedCharts([defaultChart])
    }
  }, [routeCharts])

  const toggleCharts = (chart: string) => {
    setSelectedCharts((prevSelectedCharts) => {
      let updatedCharts

      // Check if the selected chart is in selectedCharts already
      if (prevSelectedCharts.includes(chart)) {
        // If already selected, remove it
        updatedCharts = prevSelectedCharts.filter((s) => s !== chart)
      } else if (chart === chartsKeys[0]) {
        // If the selected chart is the first chart in chartsKeys, select only that chart
        // Used since historical emissions (first chart) cancels the other charts
        updatedCharts = [chart]
      } else {
        // If a different chart is selected
        updatedCharts = [...prevSelectedCharts, chart]

        // Check if the first chart in chartsKeys is in the previous selection
        const firstChartIndex = prevSelectedCharts.indexOf(chartsKeys[0])
        if (firstChartIndex !== -1) {
          // If it's in the selection, remove it
          updatedCharts.splice(firstChartIndex, 1)
        }
      }

      const chartsString = updatedCharts.join('+')
      const normalizedMunicipalityName = normalizeString(municipality.Name)
      router.push(`/kommun/${normalizedMunicipalityName}/${chartsString}`, undefined, {
        shallow: true,
      })

      return updatedCharts
    })
  }

  const infoHeading = 'CO₂-utsläpp'

  const chartTexts = selectedCharts
    .map((chart) => chartDescriptions[chart]?.text)
    .reduce((acc: string, text: string, index: number, array: string[]) => {
      if (index === array.length - 1) {
        if (array.length === 1) {
          return text
        }
        return `${acc} och ${text}`
      }
      if (index === array.length - 2) {
        return acc + text
      }
      return `${acc + text}, `
    }, '')

  const infoText = `Grafen ovan visar ${chartTexts}.`

  return (
    <>
      <PageWrapper backgroundColor="lightBlack">
        <BackArrow route="/" />
        <StyledContainer>
          <HeaderSection>
            {coatOfArmsImage && (
              <CoatOfArmsImage
                src={coatOfArmsImage}
                alt={`Kommunvapen för ${municipality.Name}`}
              />
            )}
            <StyledH2>{municipality.Name}</StyledH2>
          </HeaderSection>
          <MunicipalityEmissionGraph
            municipality={municipality}
            selectedCharts={selectedCharts}
            handleSelectCharts={toggleCharts}
          />
          <H4>{infoHeading}</H4>
          {infoText}
          <MunicipalityEmissionNumbers
            municipality={municipality}
            charts={selectedCharts}
          />
        </StyledContainer>
        <MunicipalitySolutions municipality={municipality} />
      </PageWrapper>
      <PageWrapper backgroundColor="black">
        <Bottom>
          <Scorecard
            name={municipality.Name}
            rank={municipality.HistoricalEmission.AverageEmissionChangeRank}
            budget={municipality.Budget.CO2Equivalent}
            budgetRunsOut={municipality.BudgetRunsOut}
            emissionChangePercent={municipality.EmissionChangePercent}
            politicalRule={municipality.PoliticalRule}
            climatePlan={municipality.ClimatePlan}
          />
        </Bottom>
        <DropDownSection>
          <ParagraphBold>Hur ser det ut i andra kommuner?</ParagraphBold>
          <DropDown
            className="municipality-page"
            municipalitiesName={municipalitiesName}
            placeholder="Välj kommun"
          />
        </DropDownSection>
      </PageWrapper>
    </>
  )
}

export default Municipality
