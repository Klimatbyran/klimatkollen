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
  margin: 8px 0;
  flex-direction: column;
  
  @media all and (${devices.tablet}) {
    margin: 16px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
`

const TotalCo2 = styled.div`
  display: flex;  
  align-items: center;
  font-weight: 500;
  gap: 8px;
  padding: 0.5rem 1rem 0.5rem 0rem;
  font-size: 12px;

  @media all and (${devices.tablet}) {
    font-size: 14px;
  }
`

type EmissionsProps = {
  municipality: TMunicipality
  step: number
}

function MunicipalityEmissionNumbers({ municipality, step }: EmissionsProps) {
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
          <Square color={colorTheme.darkOrange} />
          Historiskt: {totalHistorical.toFixed(1)} tusen ton CO₂
        </TotalCo2>
        <TotalCo2>
          <Square color={step > 0 ? colorTheme.darkRed : colorTheme.darkDarkRed} />
          Trend: {totalTrend.toFixed(1)} tusen ton CO₂
        </TotalCo2>
        <TotalCo2>
          <Square color={step > 1 ? colorTheme.midGreen : colorTheme.darkGreenOne} />
          Koldioxidbudget för att klara Parisavtalet:{' '}
          {(municipality.Budget.CO2Equivalent / 1000).toFixed(1)} tusen ton CO₂
        </TotalCo2>
      </TotalCo2Container>
    </Container>
  )
}

export default MunicipalityEmissionNumbers
