import styled from 'styled-components'
import { useTranslation } from 'next-i18next'

import { H4 } from '../Typography'
import { Municipality as TMunicipality } from '../../utils/types'
import { colorTheme } from '../../Theme'
import { Square } from '../shared'
import { devices } from '../../utils/devices'

const Container = styled.div`
  background: ${({ theme }) => theme.newColors.black2};
  padding: 1rem;
  border-radius: 16px;

  @media all and (${devices.tablet}) {
    padding: 2rem;
  }
`

const TotalCo2Container = styled.div`
  flex-direction: column;
  margin-top: 16px;
`

const TotalCo2 = styled.div`
  display: flex;  
  align-items: center;
  gap: 8px;
  padding: 2px 0;
  font-size: 13px;

  @media all and (${devices.tablet}) {
    font-size: 15px;
  }
`

const StyledText = styled.p<{$color: string}>`
  color: ${({ $color }) => $color};
`

type EmissionsProps = {
  municipality: TMunicipality
  step: number
}

const formatter = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 1 })

function MunicipalityEmissionNumbers({ municipality, step }: EmissionsProps) {
  const { t } = useTranslation()
  let totalHistorical = municipality.HistoricalEmission.EmissionPerYear.reduce(
    (total, year) => total + year.CO2Equivalent,
    0,
  ) / 1000
  let historicalEndsYear = municipality.HistoricalEmission.EmissionPerYear[municipality.HistoricalEmission.EmissionPerYear.length - 1]?.Year

  // if historical approximated data exist, include into total historical emission and advance the year to which historical data extends
  if (municipality.ApproximatedHistoricalEmission.TotalCO2Emission) {
    totalHistorical += municipality.ApproximatedHistoricalEmission.TotalCO2Emission / 1000
    historicalEndsYear = municipality.ApproximatedHistoricalEmission.EmissionPerYear[
      municipality.ApproximatedHistoricalEmission.EmissionPerYear.length - 1]?.Year
  }

  const totalTrend = municipality.EmissionTrend.TrendCO2Emission / 1000
  const trendStartsYear = municipality.EmissionTrend.TrendPerYear[0]?.Year

  const totalBudget = municipality.Budget.CO2Equivalent / 1000
  const budgetStartsYear = municipality.Budget.BudgetPerYear[0]?.Year

  // TODO: use updated colors
  return (
    <Container>
      <H4>{t('municipality:emissionNumbers.title')}</H4>
      <TotalCo2Container>
        <TotalCo2>
          <Square color={colorTheme.orange} />
          <StyledText $color={colorTheme.offWhite}>
            {t('municipality:emissionNumbers.historical', { historicalEndsYear, totalHistorical: formatter.format(totalHistorical) })}
          </StyledText>
        </TotalCo2>
        <TotalCo2>
          <Square color={step > 0 ? colorTheme.red : colorTheme.darkRed} />
          <StyledText $color={step > 0 ? colorTheme.offWhite : colorTheme.grey}>
            {t('municipality:emissionNumbers.trend', { trendStartsYear, totalTrend: formatter.format(totalTrend) })}
          </StyledText>
        </TotalCo2>
        <TotalCo2>
          <Square color={step > 1 ? colorTheme.lightGreen : colorTheme.midGreen} />
          <StyledText $color={step > 1 ? colorTheme.offWhite : colorTheme.grey}>
            {t('municipality:emissionNumbers.co2budget', { budgetStartsYear, totalBudget: formatter.format(totalBudget) })}
          </StyledText>
        </TotalCo2>
      </TotalCo2Container>
    </Container>
  )
}

export default MunicipalityEmissionNumbers
