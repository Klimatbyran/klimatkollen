/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Filler,
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
} from 'chart.js'
import { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import { EmissionPerYear } from '../utils/types'

import styled from 'styled-components'
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
  emissions.forEach((e) =>
    e.forEach((t) => {
      minYear = Math.min(minYear, t.Year)
      maxYear = Math.max(maxYear, t.Year)
    }),
  )
  // const years = Array.from(all).sort()
  const labels: number[] = []
  for (let i = minYear; i <= maxYear; i++) {
    labels.push(i)
  }

  return {
    labels,
    adjustableYearStart: new Date().getFullYear(),
    minYear,
    maxYear,
  }
}

const emissionPerYearToDataset = (perYear: EmissionPerYear[]): Dataset =>
  perYear.map((y) => ({ x: y.Year, y: y.CO2Equivalent }))

type Props = {
  step: number
  historical: EmissionPerYear[]
  trend: EmissionPerYear[]
  budget: EmissionPerYear[]
  maxVisibleYear: number
}

type Dataset = Array<{ x: number; y: number }>

const Graph = ({
  step,
  historical,
  budget,
  trend,
  maxVisibleYear,
}: Props) => {
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
      Math.max(
        budgetDataset.length,
        pledgeDataset.length,
        historicalDataset.length,
      ) > setup.labels.length
    ) {
      throw new Error('Dataset length larger than label length')
    }
  }

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
              borderColor: colorTheme.darkOrange,
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
              hidden: step < 2,
            },
            {
              // @ts-ignore
              id: 'pledge',
              fill: true,
              data: pledgeDataset,
              borderWidth: 2,
              borderColor: colorTheme.darkRed,
              backgroundColor: colorTheme.darkRedOpaque,
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
                weight: 'normal'
              },
              callbacks: {
                title: function (tooltipItems) {
                  return `${(tooltipItems[0].parsed.y / 1000).toFixed(1)}`
                },
                label: function (context) {
                  return ''
                },
              },
            },
          },
          scales: {
            x: {
              min: step === 0 ? setup.minYear : step < 3 ? 2016 : 2022,
              max: step > 0 ? maxVisibleYear : 2020,
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
              //suggestedMax: step > 3 ? totalRemainingCO2 : 1350_000,
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
                callback: (a, _idx) => {
                  return ((a as number) / 1000).toString()
                },
              },
            },
          },
        }}
      />
    </Container>
  )
}

export default Graph
