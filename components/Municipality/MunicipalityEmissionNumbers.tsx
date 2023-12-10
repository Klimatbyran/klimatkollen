/* eslint-disable react/jsx-one-expression-per-line */
import styled from 'styled-components'
import { H4 } from '../Typography'
import { Municipality as TMunicipality } from '../../utils/types'
import { colorTheme, colorOfSector } from '../../Theme'
import { Square } from '../shared'
import { devices } from '../../utils/devices'
import { compareSector } from '../../utils/climateDataPresentation'

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
  step: number
}

function MunicipalityEmissionNumbers({ municipality, step }: EmissionsProps) {
  const totalHistorical = municipality.HistoricalEmission.EmissionPerYear.reduce(
    (total, year) => total + year.CO2Equivalent,
    0,
  ) / 1000
  const totalTrend = municipality.EmissionTrend.FutureCO2Emission / 1000

  const totalSectors = municipality.HistoricalEmission.SectorEmissionsPerYear
    .map(({ Name, EmissionsPerYear }) => ({
      Name,
      EmissionsPerYear,
      Total: EmissionsPerYear.reduce(
        (total, year) => total + year.CO2Equivalent,
        0,
      ) / 1000,
      Color: colorOfSector(Name),
    }))

  const history = [
    <p key="1990">1990-2021</p>,
    (
      <TotalCo2 key="total">
        {/* <Square color={colorTheme.offWhite} /> */}
        <StyledText $color={colorTheme.offWhite}>
          Totalt: {totalHistorical.toFixed(1)}
        </StyledText>
      </TotalCo2>
    ),
    ...totalSectors
      .slice().sort(compareSector).reverse()
      .map(({ Name, Total, Color }) => {
        const name = Name.replace('uppärmning', 'uppvärmning') // Original SMHI data contains typo
        return (
          <TotalCo2 key={Name}>
            <Square color={Color.border} />
            <StyledText $color={Total > 1 ? colorTheme.offWhite : colorTheme.grey}>
              { name }: { Total.toFixed(1) }
            </StyledText>
          </TotalCo2>
        )
      }),
  ]

  const presentFuture = [
    <p key="2050">2021-2050</p>, (
      <TotalCo2 key="trend">
        <Square color={step > 0 ? colorTheme.red : colorTheme.darkRed} />
        <StyledText $color={step > 0 ? colorTheme.offWhite : colorTheme.grey}>
          Trend: {totalTrend.toFixed(1)}
        </StyledText>
      </TotalCo2>
    ), (
      <TotalCo2 key="paris">
        <Square color={step > 1 ? colorTheme.lightGreen : colorTheme.midGreen} />
        <StyledText $color={step > 1 ? colorTheme.offWhite : colorTheme.grey}>
          Koldioxidbudget för att klara Parisavtalet:{' '}
          {(municipality.Budget.CO2Equivalent / 1000).toFixed(1)}
        </StyledText>
      </TotalCo2>
    ),
  ]

  return (
    <Container>
      <H4>Utsläppen i siffror</H4>
      Uttryckt i tusen ton CO₂ summerat över åren...
      <TotalCo2Container>

        {[
          ...(step > 0 ? presentFuture : history),
          (<br key="br" />),
          ...(step <= 0 ? presentFuture : history),
        ]}
      </TotalCo2Container>
    </Container>
  )
}

export default MunicipalityEmissionNumbers
