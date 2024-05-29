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
import { useTranslation } from 'next-i18next'

import { EmissionPerYear } from '../utils/types'
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

const emissionPerYearToDataset = (perYear: EmissionPerYear[]): Dataset => perYear.map((y) => ({ x: y.Year, y: y.CO2Equivalent }))
const formatter = new Intl.NumberFormat('sv', { maximumFractionDigits: 1 })

type Props = {
  step: number
  historical: EmissionPerYear[]
  approximated: EmissionPerYear[]
  trend: EmissionPerYear[]
  budget: EmissionPerYear[]
  maxVisibleYear: number
}

function Graph({
  step, historical, approximated, budget, trend, maxVisibleYear,
}: Props) {
  const { t } = useTranslation()
  const setup = useMemo(
    () => getSetup([historical, approximated, trend, budget]),
    [historical, approximated, trend, budget],
  )

  const historicalDataset: Dataset = useMemo(() => emissionPerYearToDataset(historical), [historical])
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

  // TODO: Use new colors, and match with the legend colors
  return (
    <Container>
      <YAxisTitle>{t('municipality:graphYAxisTitle')}</YAxisTitle>
      <Line
        datasetIdKey="id"
        data={{
          labels: setup.labels,
          datasets: [
            {
              // @ts-ignore
              id: 'historical',
              fill: true,
              data: historicalDataset,
              borderWidth: 2,
              borderColor: colorTheme.newColors.orange3,
              backgroundColor: colorTheme.newColors.orange4,
              pointRadius: 0,
              tension: 0.15,
              hidden: false,
            },
            {
              // @ts-ignore
              id: 'approximated',
              fill: true,
              data: approximatedDataset,
              borderDash: [2, 2],
              borderWidth: 2,
              borderColor: colorTheme.newColors.orange3,
              backgroundColor: colorTheme.newColors.orange4,
              pointRadius: 0,
              tension: 0.15,
              hidden: false,
            },
            {
              // @ts-ignore
              id: 'budget',
              fill: true,
              data: step >= 2 ? budgetDataset : budgetDataset.map(({ x }) => ({ x, y: 0 })),
              borderWidth: step >= 2 ? 2 : 0,
              borderColor: colorTheme.newColors.blue3,
              backgroundColor: colorTheme.newColors.blue4,
              pointRadius: 0,
              tension: 0.15,
              hidden: false,
            },
            {
              // @ts-ignore
              id: 'pledge',
              fill: true,
              data: trendDataset,
              borderWidth: 2,
              borderColor: colorTheme.newColors.pink3,
              backgroundColor: colorTheme.newColors.pink4,
              pointRadius: 0,
              tension: 0.15,
              hidden: false,
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
              displayColors: false,
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
                title(tooltipItems) {
                  return formatter.format((tooltipItems[0].parsed.y / 1000))
                },
                label() {
                  return ''
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
                  family: '"DM Sans Variable", sans-serif',
                  size: 14,
                  weight: 400,
                },
                color: 'white',
                align: 'center',
                callback: (tickValue) => {
                  const idx = tickValue as number
                  // return idx % 2 === 0 ? setup.labels[idx] : ''
                  return setup.labels[idx]
                },
              },
            },
            y: {
              // suggestedMax: step > 3 ? totalRemainingCO2 : 1350_000,
              grid: {
                display: false,
              },
              beginAtZero: true,
              ticks: {
                stepSize: 50_000,
                font: {
                  family: '"DM Sans Variable", sans-serif',
                  size: 14,
                  weight: 400,
                },
                color: 'white',
                callback: (a) => ((a as number) / 1000).toString(),
              },
            },
          },
        }}
      />
    </Container>
  )
}

export default Graph
