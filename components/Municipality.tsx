/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import styled from 'styled-components'
import { useRouter } from 'next/router'

import { H1, H2, ParagraphBold } from './Typography'
import BackArrow from './BackArrow'
import PageWrapper from './PageWrapper'
import DropDown from './DropDown'
import ScoreCard from './ScoreCard'
import { devices } from '../utils/devices'
import { EmissionPerYear, Municipality as TMunicipality } from '../utils/types'
import MunicipalitySolutions from './MunicipalitySolutions'
import MunicipalityIssues from './MunicipalityIssues'


const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
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
  margin-top: 20px;
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

  @media only screen and (${devices.tablet}) {
    margin-top: 50px;
    text-align: center;
    align-items: center;
    padding-right: 60px;
  }
`

const StyledH2 = styled(H2)`
  margin-top: 32px;
  margin-bottom: 32px;
  width: 100%;
`

type Props = {
  municipality: TMunicipality
  step: number
  onNextStep: (() => void) | undefined
  onPreviousStep: (() => void) | undefined
  coatOfArmsImage: string | null
  municipalitiesName: Array<string>
}

const Municipality = (props: Props) => {
  const {
    step,
    municipality,
    onNextStep,
    onPreviousStep,
    coatOfArmsImage,
    municipalitiesName,
  } = props

  const emissionLastYear = municipality.HistoricalEmission.EmissionPerYear?.[municipality.HistoricalEmission.EmissionPerYear.length - 1]?.CO2Equivalent
  // FIXME replace with const emissionLastYear = municipality.HistoricalEmission.EmissionPerYear.at(-1)?.CO2Equivalent when Node has been updated >16.0.0

  return (
    <>
      <PageWrapper backgroundColor="darkestGrey">
        <BackArrow route={'/'} />
        <StyledContainer>
          <HeaderSection>
            <H1>{municipality.Name}</H1>
            {coatOfArmsImage && (
              <CoatOfArmsImage
                src={coatOfArmsImage}
                alt={`Kommunvapen för ${municipality.Name}`}
              />
            )}
          </HeaderSection>
          <MunicipalityIssues
            municipality={municipality}
            step={step}
            onNextStep={onNextStep}
            onPreviousStep={onPreviousStep} />
        </StyledContainer>
        <MunicipalitySolutions municipality={municipality} />
      </PageWrapper>
      <PageWrapper backgroundColor={'darkGrey'}>
        <StyledH2>
          <H2>Fakta om {municipality.Name}</H2>
        </StyledH2>
        <Bottom>
          <ScoreCard
            rank={municipality.HistoricalEmission.AverageEmissionChangeRank}
            budget={municipality.Budget.CO2Equivalent}
            budgetRunsOut={municipality.BudgetRunsOut}
            emissionChangePercent={municipality.EmissionChangePercent}
            emissionLastYear={emissionLastYear}
            population={municipality.Population}
            politicalRule={municipality.PoliticalRule}
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
