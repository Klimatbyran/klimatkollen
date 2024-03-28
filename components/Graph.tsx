/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Filler,
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js'
import { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import styled from 'styled-components'
import { EmissionPerYear, EmissionSector } from '../utils/types'
import {
  colorOfSector,
  compareSector,
  fixSMHITypo,
  historicalSectorOrder,
  kiloTonString,
} from '../utils/climateDataPresentation'
import { colorTheme } from '../Theme'

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const YAxisTitle = styled.label`
  font-size: 0.94rem;
  margin-bottom: 1rem;
`

function getSetup(emissions: EmissionPerYear[][]): {
  labels: number[]
  adjustableYearStart: number
  minYear: number
  maxYear: number
} {
  let minYear = new Date().getFullYear()
  let maxYear = new Date().getFullYear()

  // const all = new Set<number>()
  emissions.forEach((e) => e.forEach((t) => {
    minYear = Math.min(minYear, t.Year)
    maxYear = Math.max(maxYear, t.Year)
  }))
  // const years = Array.from(all).sort()
  const labels: number[] = []
  for (let i = minYear; i <= maxYear; i += 1) {
    labels.push(i)
  }

  return {
    labels,
    adjustableYearStart: new Date().getFullYear(),
    minYear,
    maxYear,
  }
}

type Dataset = Array<{ x: number; y: number }>

const emissionPerYearToDataset = (
  perYear: EmissionPerYear[],
): Dataset => perYear
  .map((y) => ({ x: y.Year, y: y.CO2Equivalent }))

type Props = {
  step: number
  historical: EmissionPerYear[]
  historicalBySector: EmissionSector[]
  approximated: EmissionPerYear[]
  trend: EmissionPerYear[]
  budget: EmissionPerYear[]
  maxVisibleYear: number,
  showSectors: boolean,
}

// For chartjs fill property
// https://www.youtube.com/watch?v=2g0gIAsQSp4
const sectorFill = (name: string) => {
  const index = historicalSectorOrder
    .slice().reverse() // zero is the bottom one
    .indexOf(name)
  return index === 0 ? 'origin' : index - 1
}
function Graph({
  step, historical, historicalBySector, approximated, budget, trend, maxVisibleYear, showSectors,
}: Props) {
  const setup = useMemo(
    () => getSetup([historical, approximated, trend, budget]),
    [historical, approximated, trend, budget],
  )

  const historicalDataset: Dataset = useMemo(
    () => emissionPerYearToDataset(historical),
    [historical],
  )
  const historicalDatasetsBySector = useMemo(
    () => historicalBySector.map(({ Name, EmissionsPerYear }) => ({
      Name,
      EmissionsPerYear: emissionPerYearToDataset(EmissionsPerYear),
    })),
    [historicalBySector],
  )

  const approximatedDataset: Dataset = useMemo(() => emissionPerYearToDataset(approximated), [approximated])
  const trendDataset: Dataset = useMemo(() => emissionPerYearToDataset(trend), [trend])
  const budgetDataset: Dataset = useMemo(() => emissionPerYearToDataset(budget), [budget])

  // some assertions
  if (process.env.NODE_ENV !== 'production') {
    if (
      Math.max(budgetDataset.length, trendDataset.length, approximatedDataset.length, historicalDataset.length)
      > setup.labels.length
    ) {
      throw new Error('Dataset length larger than label length')
    }
  }

  // get last year with historical data (approximated included)
  const lastYearWithData = approximated.length > 0 ? approximated[approximated.length - 1]?.Year : historical[historical.length - 1]?.Year

  return (
    <Container>
      <YAxisTitle>Tusen ton CO₂</YAxisTitle>
      <Line
        datasetIdKey="id"
        data={{
          labels: setup.labels,
          datasets: [
            ...historicalDatasetsBySector
              .sort(compareSector)
              .map(({ Name, EmissionsPerYear }) => ({
                // @ts-ignore
                id: Name,
                label: Name,
                fill: sectorFill(Name),
                data: EmissionsPerYear,
                borderWidth: 2,
                borderColor: colorOfSector(Name).border,
                backgroundColor: colorOfSector(Name).fill,
                pointRadius: 0,
                tension: 0.15,
                hidden: !showSectors,
                stack: 'sectors',
              })),
            {
              // @ts-ignore
              id: 'historical',
              label: 'Historiskt',
              fill: true,
              data: historicalDataset,
              borderWidth: 2,
              borderColor: colorTheme.orange,
              backgroundColor: colorTheme.darkOrangeOpaque,
              pointRadius: 0,
              tension: 0.15,
              hidden: showSectors,
              stack: 'separate1',
            },
            {
              // @ts-ignore
              id: 'approximated',
              label: 'Historiskt (prognos)',
              fill: true,
              data: approximatedDataset,
              borderDash: [2, 2],
              borderWidth: 2,
              borderColor: colorTheme.orange,
              backgroundColor: colorTheme.darkOrangeOpaque,
              pointRadius: 0,
              tension: 0.15,
              hidden: false,
            },
            {
              // @ts-ignore
              id: 'budget',
              label: 'Parisavtalet',
              fill: true,
              data: step >= 2 ? budgetDataset : budgetDataset.map(({ x }) => ({ x, y: 0 })),
              borderWidth: step >= 2 ? 2 : 0,
              borderColor: colorTheme.lightGreen,
              backgroundColor: colorTheme.lightGreenOpaqe,
              pointRadius: 0,
              tension: 0.15,
              hidden: step < 2,
              stack: 'separate2',
            },
            {
              // @ts-ignore
              id: 'trend',
              label: 'Trend',
              fill: true,
              data: trendDataset,
              borderWidth: 2,
              borderColor: colorTheme.red,
              backgroundColor: colorTheme.darkRedOpaque,
              pointRadius: 0,
              tension: 0.15,
              hidden: false,
              stack: 'separate3',
            },
          ],
        }}
        options={{
          responsive: true,
          interaction: {
            intersect: false,
            mode: 'nearest',
          },
          plugins: {
            tooltip: {
              enabled: true,
              displayColors: true,
              padding: {
                top: 8,
                left: 8,
                right: 8,
                bottom: 1,
              },
              titleFont: {
                weight: 'normal',
              },
              callbacks: {
                label(context) {
                  const label = fixSMHITypo(context.dataset.label || '')
                  return `${label}: ${kiloTonString(context.parsed.y)}`
                },
                // We still want to display the total together with the specific sector
                title(context) {
                  // For gotland and friends the default is fine
                  const year = context[0].label
                  const historicalEntry = historical
                    .find((x) => (`${x.Year}`) === year)
                  if (historicalEntry && showSectors) {
                    return [
                      year,
                      `${kiloTonString(historicalEntry.CO2Equivalent)} totalt, varav...`,
                    ]
                  }
                  return year
                },
              },
            },
          },
          scales: {
            x: {
              min: step === 0 ? setup.minYear : 2015,
              max: step > 0 ? maxVisibleYear : lastYearWithData,
              grid: {
                display: true,
                color: 'rgba(255, 255, 255, 0.2)',
                drawTicks: false,
              },
              ticks: {
                font: {
                  family: 'Borna',
                  size: 15,
                  weight: 300,
                },
                color: 'white',
                align: 'center',
                callback: (tickValue) => {
                  const idx = tickValue as number
                  return setup.labels[idx]
                },
              },
            },
            y: {
              grid: {
                display: false,
              },
              beginAtZero: true,
              ticks: {
                stepSize: 50_000,
                font: {
                  family: 'Borna',
                  size: 15,
                  weight: 300,
                },
                color: 'white',
                callback: (a) => ((a as number) / 1000).toString(),
              },
              stacked: true,
            },
          },
        }}
      />
    </Container>
  )
}

export default Graph
