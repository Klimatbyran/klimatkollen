/* eslint-disable react/jsx-one-expression-per-line */
import styled from 'styled-components'
import { H4 } from '../Typography'
import { Municipality as TMunicipality } from '../../utils/types'
import { colorTheme } from '../../Theme'
import { Square } from '../shared'
import { devices } from '../../utils/devices'
import {
  colorOfSector,
  compareSector,
  getEmissionsOfYear,
  fixSMHITypo,
  kiloTonString,
  sumEmissionsPerYear,
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

const StyledText = styled.p<{ $color: string }>`
  color: ${({ $color }) => $color};
`

type EmissionsProps = {
  municipality: TMunicipality
  step: number
  showSectors: boolean
}

function MunicipalityEmissionNumbers({ municipality, step, showSectors }: EmissionsProps) {
  let totalHistorical = sumEmissionsPerYear(municipality.HistoricalEmission.EmissionPerYear)
  let historicalEndsYear = municipality.HistoricalEmission.EmissionPerYear[municipality.HistoricalEmission.EmissionPerYear.length - 1]?.Year

  // TODO: Add approximated total values to total historical
  // Sector totals ends 2021 and historical + approximated historical end 2024
  //
  // if historical approximated data exist, include into total historical emission and advance the year to which historical data extends
  // if (municipality.ApproximatedHistoricalEmission.TotalCO2Emission) {
  //   totalHistorical += municipality.ApproximatedHistoricalEmission.TotalCO2Emission
  //   historicalEndsYear = municipality.ApproximatedHistoricalEmission.EmissionPerYear[
  //     municipality.ApproximatedHistoricalEmission.EmissionPerYear.length - 1]?.Year
  // }

  const totalTrend = municipality.EmissionTrend.TrendCO2Emission
  const trendStartsYear = municipality.EmissionTrend.TrendPerYear[0]?.Year

  const totalBudget = municipality.Budget.CO2Equivalent
  const budgetStartsYear = municipality.Budget.BudgetPerYear[0]?.Year

  const totalSectors = municipality.HistoricalEmission.SectorEmissionsPerYear
    .map(({ Name, EmissionsPerYear }) => ({
      Name,
      EmissionsPerYear,
      Total: sumEmissionsPerYear(EmissionsPerYear),
      Color: colorOfSector(Name),
    }))

  const sectorsLastYearWithData = municipality.HistoricalEmission.SectorEmissionsPerYear
    .map(({ Name, EmissionsPerYear }) => ({
      Name,
      Emissions: getEmissionsOfYear(EmissionsPerYear, historicalEndsYear),
      Color: colorOfSector(Name),
    }))
  const historicalLastYearWithData = getEmissionsOfYear(municipality.HistoricalEmission.EmissionPerYear, historicalEndsYear)

  // Blocks of elements that will be ordered and/or hidden
  const lastYearWithDataElementList = [
    <p key="lastYearWithData">{historicalEndsYear}</p>,
    (
      <TotalCo2 key="lastYearWithData-total">
        <StyledText $color={colorTheme.offWhite}>
          Totalt: {kiloTonString(historicalLastYearWithData)}
        </StyledText>
      </TotalCo2>
    ),
    ...sectorsLastYearWithData
      .slice().sort(compareSector).reverse()
      .map(({ Name, Emissions, Color }) => {
        const name = Name.replace('uppärmning', 'uppvärmning') // Original SMHI data contains typo
        const percent = 100 * (Emissions / historicalLastYearWithData)
        return (
          <TotalCo2 key={`lastYearWithData-${Name}`}>
            <Square color={Color.border} />
            <StyledText $color={Emissions > 100 ? colorTheme.offWhite : colorTheme.grey}>
              {name}: {kiloTonString(Emissions)} ({(percent.toFixed(1))}%)
            </StyledText>
          </TotalCo2>
        )
      }),
  ]

  const historicalElementList = [
    <p key="1990">1990-{historicalEndsYear}</p>,
    (
      <TotalCo2 key="total">
        <Square color={colorTheme.orange} />
        <StyledText $color={colorTheme.offWhite}>
          Totalt: {kiloTonString(totalHistorical)} tusen ton CO₂.
        </StyledText>
      </TotalCo2>
    ),
  ]

  const historicalWithSectorsElementList = [
    <p key="1990">1990-{historicalEndsYear}</p>,
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
            {fixSMHITypo(Name)}: {kiloTonString(Total)}
          </StyledText>
        </TotalCo2>
      )),
  ]

  const futureElementList = [
    <p key="2050">{trendStartsYear}-2050</p>, (
      <TotalCo2 key="trend">
        <Square color={step > 0 ? colorTheme.red : colorTheme.darkRed} />
        <StyledText $color={step > 0 ? colorTheme.offWhite : colorTheme.grey}>
          Trend: {kiloTonString(totalTrend)}
        </StyledText>
      </TotalCo2>
    ), ...(step === 2 ? ([
      <>
        {budgetStartsYear !== trendStartsYear ?
          ([
            <br key="br" />,
            <p key="2050">{budgetStartsYear}-2050</p>
          ])
          :
          null
        }
      </>,
      <TotalCo2 key="paris">
        <Square color={step > 1 ? colorTheme.lightGreen : colorTheme.midGreen} />
        <StyledText $color={step > 1 ? colorTheme.offWhite : colorTheme.grey}>
          Koldioxidbudget: {kiloTonString(totalBudget)}
        </StyledText>
      </TotalCo2>,
    ]) : []),
  ]

  let firstElementList: typeof historicalWithSectorsElementList = []
  let secondElementList: typeof historicalWithSectorsElementList = []

  if (showSectors) {
    switch (step) {
      case 0:
        firstElementList = historicalWithSectorsElementList
        secondElementList = []
        break
      case 1:
        firstElementList = lastYearWithDataElementList
        secondElementList = futureElementList
        break
      case 2:
        firstElementList = futureElementList
        secondElementList = lastYearWithDataElementList
        break
      default:
    }
  } else {
    firstElementList = futureElementList
    secondElementList = historicalElementList
  }

  return (
    <Container>
      <H4>Utsläppen i siffror</H4>
      Uttryckt i tusen ton CO₂ summerat över åren...
      <TotalCo2Container>
        {[
          ...firstElementList,
          (<br key="br" />),
          ...secondElementList,
        ]}
      </TotalCo2Container>
    </Container>
  )
}

export default MunicipalityEmissionNumbers
