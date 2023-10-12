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
import { EmissionPerYear } from '../utils/types'

import { colorTheme } from '../Theme'

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

const END_YEAR = 2050

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

type Props = {
  charts: string[]
  historical: EmissionPerYear[]
  trend: EmissionPerYear[]
  budget: EmissionPerYear[]
}

function Graph({
  charts, historical, budget, trend,
}: Props) {
  const setup = useMemo(
    () => getSetup([historical, trend, budget]),
    [historical, trend, budget],
  )

  const historicalDataset: Dataset = useMemo(
    () => emissionPerYearToDataset(historical),
    [historical],
  )
  const pledgeDataset: Dataset = useMemo(() => emissionPerYearToDataset(trend), [trend])
  const budgetDataset: Dataset = useMemo(() => emissionPerYearToDataset(budget), [budget])

  // some assertions
  if (process.env.NODE_ENV !== 'production') {
    if (
      Math.max(budgetDataset.length, pledgeDataset.length, historicalDataset.length)
      > setup.labels.length
    ) {
      throw new Error('Dataset length larger than label length')
    }
  }

  const onlyHistorical = charts.every((n) => n !== 'trend' && n !== 'parisavtalet')

  return (
    <Container>
      <YAxisTitle>Tusen ton CO₂</YAxisTitle>
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
              borderColor: colorTheme.orange,
              backgroundColor: colorTheme.darkOrangeOpaque,
              pointRadius: 0,
              tension: 0.15,
              hidden: false,
            },
            {
              // @ts-ignore
              id: 'budget',
              fill: true,
              data: budgetDataset,
              borderWidth: 2,
              borderColor: colorTheme.lightGreen,
              backgroundColor: colorTheme.lightGreenOpaqe,
              pointRadius: 0,
              tension: 0.15,
              hidden: !charts.includes('parisavtalet'),
            },
            {
              // @ts-ignore
              id: 'pledge',
              fill: true,
              data: pledgeDataset,
              borderWidth: 2,
              borderColor: colorTheme.red,
              backgroundColor: colorTheme.darkRedOpaque,
              pointRadius: 0,
              tension: 0.15,
              hidden: !charts.includes('trend'),
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
                  return `${(tooltipItems[0].parsed.y / 1000).toFixed(1)}`
                },
                label() {
                  return ''
                },
              },
            },
          },
          scales: {
            x: {
              min: onlyHistorical ? setup.minYear : 2016,
              max: onlyHistorical ? 2021 : END_YEAR,
              grid: {
                display: true,
                color: 'rgba(255, 255, 255, 0.2)',
                drawTicks: false,
              },
              ticks: {
                font: {
                  family: 'Borna',
                  size: 15,
                  weight: '300',
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
                  family: 'Borna',
                  size: 15,
                  weight: '300',
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
