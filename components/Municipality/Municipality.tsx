import styled from 'styled-components'
import { useTranslation } from 'next-i18next'

import { H1NoPad, ParagraphBold } from '../Typography'
import BackArrow from '../BackArrow'
import PageWrapper from '../PageWrapper'
import DropDown from '../DropDown'
import { Municipality as TMunicipality } from '../../utils/types'
import MunicipalitySolutions from './MunicipalitySolutions'
import MunicipalityEmissionGraph from './MunicipalityEmissionGraph'
import MunicipalityEmissionNumbers from './MunicipalityEmissionNumbers'
import Scorecard from './MunicipalityScorecard'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
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
`

const DropDownSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 30px;
  text-align: center;
  align-items: center;
  padding-bottom: 6rem;
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

  const { t } = useTranslation()

  return (
    <>
      <PageWrapper>
        <StyledContainer>
          <HeaderSection>
            <BackArrow route="/" />
            <H1NoPad>{municipality.Name}</H1NoPad>
            {coatOfArmsImage && (
              <CoatOfArmsImage
                src={coatOfArmsImage}
                alt={t('municipality:coatOfArms', { name: municipality.Name })}
              />
            )}
          </HeaderSection>
          <MunicipalityEmissionGraph
            municipality={municipality}
            chart={step}
            onNextStep={onNextStep}
            onPreviousStep={onPreviousStep}
          />
          <MunicipalityEmissionNumbers municipality={municipality} step={step} />
        </StyledContainer>
        <MunicipalitySolutions municipality={municipality} />
      </PageWrapper>
      <PageWrapper>
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
          <ParagraphBold>{t('municipality:otherMunicipalities')}</ParagraphBold>
          <DropDown
            municipalitiesName={municipalitiesName}
            placeholder={t('municipality:select')}
          />
        </DropDownSection>
      </PageWrapper>
    </>
  )
}

export default Municipality
