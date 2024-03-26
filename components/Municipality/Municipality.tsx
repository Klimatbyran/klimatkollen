/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import styled from 'styled-components'

import { H1NoPad, ParagraphBold } from '../Typography'
import BackArrow from '../BackArrow'
import PageWrapper from '../PageWrapper'
import DropDown from '../DropDown'
import { devices } from '../../utils/devices'
import { Municipality as TMunicipality } from '../../utils/types'
import MunicipalitySolutions from './MunicipalitySolutions'
import MunicipalityEmissionGraph from './MunicipalityEmissionGraph'
import MunicipalityEmissionNumbers from './MunicipalityEmissionNumbers'
import Scorecard from './MunicipalityScorecard'
import { isCementSector } from '../../utils/climateDataPresentation'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items center;
  gap: 1.5rem;
  margin-bottom: 48px;
`

const CoatOfArmsImage = styled.img`
  width: 60px;
`

const HeaderSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
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
  step: number
  onNextStep: (() => void) | undefined
  onPreviousStep: (() => void) | undefined
  coatOfArmsImage: string | null
  municipalitiesName: Array<string>
}

function Municipality(props: Props) {
  const {
    step,
    municipality,
    onNextStep,
    onPreviousStep,
    coatOfArmsImage,
    municipalitiesName,
  } = props

  return (
    <>
      <PageWrapper backgroundColor="lightBlack">
        <StyledContainer>
          <HeaderSection>
            <BackArrow route="/" />
            <H1NoPad>{municipality.Name}</H1NoPad>
            {coatOfArmsImage && (
              <CoatOfArmsImage
                src={coatOfArmsImage}
                alt={`Kommunvapen för ${municipality.Name}`}
              />
            )}
          </HeaderSection>
          <MunicipalityEmissionGraph
            municipality={municipality}
            chart={step}
            onNextStep={onNextStep}
            onPreviousStep={onPreviousStep}
            showSectors={!isCementSector(municipality.Name)}
          />
          <MunicipalityEmissionNumbers
            municipality={municipality}
            step={step}
            showSectors={!isCementSector(municipality.Name)}
          />
        </StyledContainer>
        <MunicipalitySolutions municipality={municipality} />
      </PageWrapper>
      <PageWrapper backgroundColor="black">
        <Bottom>
          <Scorecard
            name={municipality.Name}
            rank={municipality.HistoricalEmission.HistoricalEmissionChangeRank}
            budget={municipality.Budget.CO2Equivalent}
            budgetRunsOut={municipality.BudgetRunsOut}
            neededEmissionChangePercent={municipality.NeededEmissionChangePercent}
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
