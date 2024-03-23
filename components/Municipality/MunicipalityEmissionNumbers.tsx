/* eslint-disable react/jsx-one-expression-per-line */
import styled from 'styled-components'
import { H4 } from '../Typography'
import { EmissionPerYear, Municipality as TMunicipality } from '../../utils/types'
import { colorTheme } from '../../Theme'
import { Square } from '../shared'
import { devices } from '../../utils/devices'
import {
  colorOfSector,
  compareSector,
  CURRENT_YEAR,
  emissionsCurrentYear,
  fixSMHITypo,
  kiloTonString,
} from '../../utils/climateDataPresentation'

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
  showSectors: boolean
}

function sumEmissionsPerYear(emissions: Array<EmissionPerYear>) {
  return emissions.reduce(
    (total, { CO2Equivalent }) => total + CO2Equivalent,
    0,
  )
}

function MunicipalityEmissionNumbers({ municipality, step, showSectors }: EmissionsProps) {
  const historicalEndsYear = municipality.HistoricalEmission.EmissionPerYear[municipality.HistoricalEmission.EmissionPerYear.length - 1]?.Year

  const totalTrend = municipality.EmissionTrend.TrendCO2Emission 
  const trendStartsYear = municipality.EmissionTrend.TrendPerYear[0]?.Year

  const totalBudget = municipality.Budget.CO2Equivalent / 1000
  const budgetStartsYear = municipality.Budget.BudgetPerYear[0]?.Year

  // Retrieving data and summing
  const totalHistorical = sumEmissionsPerYear(municipality.HistoricalEmission.EmissionPerYear)
  //const totalTrend = municipality.EmissionTrend.FutureCO2Emission
  const totalSectors = municipality.HistoricalEmission.SectorEmissionsPerYear
    .map(({ Name, EmissionsPerYear }) => ({
      Name,
      EmissionsPerYear,
      Total: sumEmissionsPerYear(EmissionsPerYear),
      Color: colorOfSector(Name),
    }))
  const sectorsCurrentYear = municipality.HistoricalEmission.SectorEmissionsPerYear
    .map(({ Name, EmissionsPerYear }) => ({
      Name,
      Emissions: emissionsCurrentYear(EmissionsPerYear),
      Color: colorOfSector(Name),
    }))
  const totalCurrentYear = emissionsCurrentYear(municipality.HistoricalEmission.EmissionPerYear)

  // Blocks of elements that will be ordered and/or hidden
  const thisYear = [
    <p key="currentYear">{CURRENT_YEAR}</p>,
    (
      <TotalCo2 key="currentYear-total">
        <StyledText $color={colorTheme.offWhite}>
          Totalt: {kiloTonString(totalCurrentYear)}
        </StyledText>
      </TotalCo2>
    ),
    ...sectorsCurrentYear
      .slice().sort(compareSector).reverse()
      .map(({ Name, Emissions, Color }) => {
        const name = Name.replace('uppärmning', 'uppvärmning') // Original SMHI data contains typo
        const percent = 100 * (Emissions / totalCurrentYear)
        return (
          <TotalCo2 key={`currentYear-${Name}`}>
            <Square color={Color.border} />
            <StyledText $color={Emissions > 100 ? colorTheme.offWhite : colorTheme.grey}>
              { name }: { kiloTonString(Emissions)} ({(percent.toFixed(1)) }%)
            </StyledText>
          </TotalCo2>
        )
      }),
  ]

  const justTotalHistory = [
    <p key="1990">1990-{CURRENT_YEAR}</p>,
    (
      <TotalCo2 key="total">
        <Square color={colorTheme.orange} />
        <StyledText $color={colorTheme.offWhite}>
          Totalt: {kiloTonString(totalHistorical)} tusen ton CO₂.
        </StyledText>
      </TotalCo2>
    ),
  ]

  const history = [
    <p key="1990">1990-{CURRENT_YEAR}</p>,
    (
      <TotalCo2 key="total">
        <StyledText $color={colorTheme.offWhite}>
          Totalt: {kiloTonString(totalHistorical)}
        </StyledText>
      </TotalCo2>
    ),
    ...totalSectors
      .slice().sort(compareSector).reverse()
      .map(({
        Name,
        Total,
        Color,
      }) => (
        <TotalCo2 key={Name}>
          <Square color={Color.border} />
          <StyledText $color={Total > 1000 ? colorTheme.offWhite : colorTheme.grey}>
            { fixSMHITypo(Name) }: {kiloTonString(Total)}
          </StyledText>
        </TotalCo2>
      )),
  ]

  const presentFuture = [
    <p key="2050">{CURRENT_YEAR}-2050</p>, (
      <TotalCo2 key="trend">
        <Square color={step > 0 ? colorTheme.red : colorTheme.darkRed} />
        <StyledText $color={step > 0 ? colorTheme.offWhite : colorTheme.grey}>
          Trend: {kiloTonString(totalTrend)} tusen ton CO₂.
        </StyledText>
      </TotalCo2>
    ), ...(step === 2 ? ([
      <TotalCo2 key="paris">
        <Square color={step > 1 ? colorTheme.lightGreen : colorTheme.midGreen} />
        <StyledText $color={step > 1 ? colorTheme.offWhite : colorTheme.grey}>
          Koldioxidbudget för att klara Parisavtalet:{' '}
          {(municipality.Budget.CO2Equivalent / 1000).toFixed(1)} tusen ton CO₂.
        </StyledText>
      </TotalCo2>,
    ]) : []),
  ]

  let list1 : typeof history = []
  let list2 : typeof history = []

  if (showSectors) {
    switch (step) {
      case 0:
        list1 = history
        list2 = []
        break
      case 1:
        list1 = thisYear
        list2 = presentFuture
        break
      case 2:
        list1 = presentFuture
        list2 = thisYear
        break
      default:
    }
  } else {
    list1 = presentFuture
    list2 = justTotalHistory
  }

  return (
    <Container>
      <H4>Utsläppen i siffror</H4>
      Uttryckt i tusen ton CO₂ summerat över åren...
      <TotalCo2Container>
        {[
          ...list1,
          (<br key="br" />),
          ...list2,
        ]}
      </TotalCo2Container>
    </Container>
  )
}

export default MunicipalityEmissionNumbers
