/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Filler,
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js'
import { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import { EmissionPerYear } from '../utils/types'

import styled from 'styled-components'

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler)

//     userGraph
//       .filter((f) => f !== null)
//       .reduce((prev, curr) => {
//         curr.acc = (prev.acc ?? 1) * curr.change
//         curr.emitted = prev.emitted + curr.co2 * curr.acc
//         return curr
//       })

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

type MandatePeriod = {
  start: number
  end: number
  change: number
}

type Props = {
  step: number
  historical: EmissionPerYear[]
  budget: EmissionPerYear[]
  trend: EmissionPerYear[]
  mandatePeriodChanges: MandatePeriod[]
  totalRemainingCO2: number
}

type Dataset = Array<{ x: number; y: number }>

const Graph = ({
  step,
  historical,
  budget,
  trend,
  mandatePeriodChanges,
  totalRemainingCO2,
}: Props) => {
  const setup = useMemo(
    () => getSetup([historical, budget, trend]),
    [historical, budget, trend],
  )

  const historicalDataset: Dataset = useMemo(
    () => emissionPerYearToDataset(historical),
    [historical],
  )
  const budgetDataset: Dataset = useMemo(() => emissionPerYearToDataset(budget), [budget])
  const pledgeDataset: Dataset = useMemo(() => emissionPerYearToDataset(trend), [trend])

  const adjustedUserGraphDataset: Dataset = useMemo(() => {
    const dataset: Dataset = []

    let acc = 1
    mandatePeriodChanges.forEach((mandateChange) => {
      acc = acc * mandateChange.change

      // Problem: This counts on budget to go at least all the way to 2050
      budget
        .filter((e) => e.Year >= mandateChange.start && e.Year < mandateChange.end)
        .forEach((budgeted) => {
          // Problem: This is a clone of the budget and we cannot go "above it"
          dataset.push({ x: budgeted.Year, y: budgeted.CO2Equivalent / acc })
        })
    })

    console.log(dataset)

    return dataset
  }, [mandatePeriodChanges])

  // some assertions
  if (process.env.NODE_ENV !== 'production') {
    if (
      Math.max(
        adjustedUserGraphDataset.length,
        pledgeDataset.length,
        budgetDataset.length,
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
              borderColor: 'rgb(239, 94, 48)',
              backgroundColor: 'rgb(239, 94, 48, 0.6)',
              pointRadius: 0,
              tension: 0.15,
              hidden: false,
            },
            {
              // @ts-ignore
              id: 'usergrap',
              fill: true,
              data: adjustedUserGraphDataset,
              borderWidth: 1,
              borderColor: 'rgb(239, 191, 23)',
              backgroundColor: 'rgba(239, 191, 23, 0.6)',
              pointRadius: 0,
              tension: 0.15,
              hidden: step < 4,
            },
            {
              // @ts-ignore
              id: 'budget',
              fill: true,
              data: budgetDataset,
              borderWidth: 2,
              borderColor: '#6BA292',
              backgroundColor: 'rgba(145, 223, 200, 0.6)',
              pointRadius: 0,
              tension: 0.15,
              hidden: false,
            },
            {
              // @ts-ignore
              id: 'pledge',
              fill: true,
              data: pledgeDataset,
              borderWidth: 2,
              borderColor: '#EF3054',
              backgroundColor: '#542E35',
              pointRadius: 0,
              tension: 0.15,
              hidden: step < 2,
            },
          ],
        }}
        options={{
          responsive: true,
          scales: {
            x: {
              min: step > 2 ? 2019 : setup.minYear,
              max: step > 0 ? setup.maxYear : 2019,
              grid: {
                display: true,
                drawBorder: false,
                color: 'rgba(255, 255, 255, 0.2)',
                drawTicks: false,
              },
              ticks: {
                font: {
                  family: 'Helvetica Neue',
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
              suggestedMax: step > 3 ? totalRemainingCO2 : 150_000,
              grid: {
                drawBorder: false,
                display: false,
              },
              beginAtZero: true,
              ticks: {
                stepSize: 50_000,
                font: {
                  family: 'Helvetica Neue',
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
