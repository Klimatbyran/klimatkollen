/* eslint-disable react/jsx-one-expression-per-line */
import styled from 'styled-components'
import { H4 } from '../Typography'
import { Municipality as TMunicipality } from '../../utils/types'
import { colorTheme } from '../../Theme'
import { Square } from '../shared'
import { devices } from '../../utils/devices'

const Container = styled.div`
  background: ${({ theme }) => theme.black};
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
  font-family: 'Anonymous Pro', monospace;

  @media all and (${devices.tablet}) {
    font-size: 15px;
  }
`

const StyledText = styled.p<{$color: string}>`
  color: ${({ $color }) => $color};
`

type EmissionsProps = {
  municipality: TMunicipality
  charts: number[]
}

function MunicipalityEmissionNumbers({ municipality, charts }: EmissionsProps) {
  const totalHistorical = municipality.HistoricalEmission.EmissionPerYear.reduce(
    (total, year) => total + year.CO2Equivalent,
    0,
  ) / 1000
  const totalTrend = municipality.EmissionTrend.FutureCO2Emission / 1000

  return (
    <Container>
      <H4>Utsläppen i siffror</H4>
      <TotalCo2Container>
        <TotalCo2>
          <Square color={colorTheme.orange} />
          <StyledText $color={colorTheme.offWhite}>
            Historiskt: {totalHistorical.toFixed(1)} tusen ton CO₂
          </StyledText>
        </TotalCo2>
        <TotalCo2>
          <Square color={charts.includes(1) ? colorTheme.red : colorTheme.darkRed} />
          <StyledText $color={charts.includes(1) ? colorTheme.offWhite : colorTheme.grey}>
            Trend: {totalTrend.toFixed(1)} tusen ton CO₂
          </StyledText>
        </TotalCo2>
        <TotalCo2>
          <Square color={charts.includes(2) ? colorTheme.lightGreen : colorTheme.darkGreenOne} />
          <StyledText $color={charts.includes(2) ? colorTheme.offWhite : colorTheme.grey}>
            Koldioxidbudget för att klara Parisavtalet:{' '}
            {(municipality.Budget.CO2Equivalent / 1000).toFixed(1)} tusen ton CO₂
          </StyledText>
        </TotalCo2>
      </TotalCo2Container>
    </Container>
  )
}

export default MunicipalityEmissionNumbers
