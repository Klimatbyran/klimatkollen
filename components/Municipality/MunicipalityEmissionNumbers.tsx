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
  fixSMHITypo,
  kiloTonString,
  sumEmissionsPerYear,
} from '../../utils/climateDataPresentation'
import { groupEmissionSectors } from '../../utils/shared'

const Container = styled.div`
  background: ${({ theme }) => theme.black};
  padding: 1rem;
  border-radius: 16px;

  @media all and (${devices.tablet}) {
    padding: 2rem;
  }
`

const TotalCo2Container = styled.div`
  > * {
    padding-top: 16px;
  }
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

  // If historical approximated data exist, include into total historical emission and advance the year to which historical data extends
  // NOTE: Only do so if sectors aren't shown
  if (!showSectors && municipality.ApproximatedHistoricalEmission.TotalCO2Emission) {
    totalHistorical += municipality.ApproximatedHistoricalEmission.TotalCO2Emission || 0
    historicalEndsYear = municipality.ApproximatedHistoricalEmission.EmissionPerYear[
      municipality.ApproximatedHistoricalEmission.EmissionPerYear.length - 1]?.Year
  }

  const totalTrend = municipality.EmissionTrend.TrendCO2Emission
  const trendStartsYear = municipality.EmissionTrend.TrendPerYear[0]?.Year

  const totalBudget = municipality.Budget.CO2Equivalent

  const totalSectors = groupEmissionSectors(municipality.HistoricalEmission.SectorEmissionsPerYear)
    .map(({ Name, EmissionsPerYear }) => ({
      Name,
      EmissionsPerYear,
      Total: sumEmissionsPerYear(EmissionsPerYear),
      Color: colorOfSector(Name),
    }))

  // Blocks of elements that will be ordered and/or hidden
  const historicalElementList = [
    <p key="1990">1990-{historicalEndsYear}</p>,
    <TotalCo2 key="historical">
      <Square color={colorTheme.orange} />
      <StyledText $color={colorTheme.offWhite}>
        Historiskt: {kiloTonString(totalHistorical)}
      </StyledText>
    </TotalCo2>,
  ]

  const historicalWithSectorsElementList = [
    <p key="1990">1990-{historicalEndsYear}</p>,
    <TotalCo2 key="historicalWithSectors">
      <StyledText $color={colorTheme.offWhite}>
        Historiskt: {kiloTonString(totalHistorical)} varav...
      </StyledText>
    </TotalCo2>,
    ...totalSectors
      .slice().sort(compareSector).reverse()
      .map(({
        Name,
        Total,
        Color,
      }) => (
        <TotalCo2 key={Name}>
          <Square color={Color.border} />
          <StyledText $color={Total > 100 ? colorTheme.offWhite : colorTheme.grey}>
            {fixSMHITypo(Name)}: {kiloTonString(Total)}
          </StyledText>
        </TotalCo2>
      )),
  ]

  const futureElementList = [
    <p key="2050">{trendStartsYear}-2050</p>,
    <TotalCo2 key="trend">
      <Square color={step > 0 ? colorTheme.red : colorTheme.darkRed} />
      <StyledText $color={step > 0 ? colorTheme.offWhite : colorTheme.grey}>
        Trend: {kiloTonString(totalTrend)}
      </StyledText>
    </TotalCo2>,
    <TotalCo2 key="paris">
      <Square color={step > 1 ? colorTheme.lightGreen : colorTheme.midGreen} />
      <StyledText $color={step > 1 ? colorTheme.offWhite : colorTheme.grey}>
        Koldioxidbudget: {kiloTonString(totalBudget)}
      </StyledText>
    </TotalCo2>,
  ]

  return (
    <Container>
      <H4>Utsläppen i siffror (tusen ton CO₂)</H4>
      <TotalCo2Container>
        {[
          showSectors ? historicalWithSectorsElementList : historicalElementList,
          futureElementList,
        ]}
      </TotalCo2Container>
    </Container>
  )
}

export default MunicipalityEmissionNumbers
