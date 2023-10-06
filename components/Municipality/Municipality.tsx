/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import styled from 'styled-components'

import { useState } from 'react'
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

/**
 * FIXME
 *
 * - routing
 * - info section under graph text
 * - decide/implement historical graph vs other graphs
 *
 * */

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

function Municipality(props: Props) {
  const {
    municipality,
    coatOfArmsImage,
    municipalitiesName,
  } = props
  const [selectedCharts, setSelectedCharts] = useState<number[]>([0])

  const toggleCharts = (chart: number) => {
    setSelectedCharts((prevSelectedCharts) => (prevSelectedCharts.includes(chart)
      ? prevSelectedCharts.filter((s) => s !== chart)
      : [...prevSelectedCharts, chart]))
  }

  const infoHeading = 'CO₂-utsläpp'
  const infoText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'

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
          <MunicipalityEmissionNumbers municipality={municipality} charts={selectedCharts} />
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
