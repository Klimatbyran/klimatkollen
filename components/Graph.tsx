/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Filler,
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js'
import { useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'

import styled from 'styled-components'

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler)

// useEffect(() => {
//   const chart = chartRef.current
//   if (chart) {
//     const dataset = chart.data.datasets[3]

//     userGraph
//       .filter((f) => f !== null)
//       .reduce((prev, curr) => {
//         curr.acc = (prev.acc ?? 1) * curr.change
//         curr.emitted = prev.emitted + curr.co2 * curr.acc
//         return curr
//       })
//     dataset.data = historical.map((f) => f.null)
//     // console.log('before', chart.data.datasets[3].data.length)
//     // chart.data.datasets[3].data.splice(historical.length)
//     // console.log('after', chart.data.datasets[3].data.length)
//     // chart.data.datasets[3].data = userGraph.map((f) => (f ? f.co2 / f.acc : f))
//     // console.log(chart.data.datasets[3].data)
//     // chart.update()
//   }
// }, [userGraph])

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const YAxisTitle = styled.label`
  font-size: 0.94rem;
  margin-bottom: 1rem;
`

type EmissionData = {
  year: number
  co2: number
}

function getSetup(emissions: EmissionData[][]): {
  labels: number[]
  adjustableYearStart: number
  minYear: number
  maxYear: number
} {
  const all = new Set<number>()
  emissions.forEach((e) => e.forEach((t) => all.add(t.year)))
  const years = Array.from(all).sort()
  return {
    labels: years,
    adjustableYearStart: new Date().getFullYear(),
    minYear: years[0],
    maxYear: years[years.length - 1],
  }
}

function getFillerValues(fromYear: number, toYear: number) {
  return new Array(toYear - fromYear).map((f) => null)
}

type MandatePeriod = {
  start: number
  end: number
  change: number
}

type Props = {
  step: number
  historical: EmissionData[]
  paris: EmissionData[]
  pledged: EmissionData[]
  mandatePeriodChanges: MandatePeriod[]
}

type Dataset = Array<null | number>

const Graph = ({ step, historical, paris, pledged, mandatePeriodChanges }: Props) => {
  const setup = useMemo(
    () => getSetup([historical, paris, pledged]),
    [historical, paris, pledged],
  )

  const historicalDataset = useMemo(() => historical.map((f) => f.co2), [historical])
  const parisDataset = useMemo(
    () =>
      (historical.slice(0, -1).map(() => null) as Dataset).concat(
        paris.map((p) => p.co2),
      ),
    [historical, paris],
  )

  const pledgeDataset = useMemo(
    () =>
      (historical.slice(0, -1).map(() => null) as Dataset).concat(
        pledged.map((p) => p.co2),
      ),
    [historical, pledged],
  )

  const userGraph = useMemo(
    () =>
      pledged
        .filter((pledge) => pledge.year >= setup.adjustableYearStart)
        .map((f) => ({ year: f.year, co2: f.co2 })),
    [pledged, setup],
  )

  const adjustedUserGraph: Dataset = useMemo(() => {
    const dataset: Dataset = []
    let acc = 1

    mandatePeriodChanges.forEach((mandate) => {
      acc = acc * mandate.change
      userGraph
        .filter((f) => f.year >= mandate.start && f.year < mandate.end) // range exlusive end
        .forEach((f) => {
          dataset.push(f.co2 / acc)
        })
    })
    return dataset
  }, [userGraph, mandatePeriodChanges])

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
              borderColor: '#EF5E30',
              backgroundColor: '#EF5E30',
              pointRadius: 0,
              tension: 0.15,
              hidden: false,
            },
            {
              // @ts-ignore
              id: 'paris',
              fill: true,
              data: parisDataset,
              borderWidth: 2,
              borderColor: '#6BA292',
              backgroundColor: '#91DFC8',
              pointRadius: 0,
              tension: 0.15,
              hidden: false,
            },
            {
              // @ts-ignore
              id: 'usergrap',
              fill: true,
              data: (
                getFillerValues(setup.minYear, setup.adjustableYearStart) as Dataset
              ).concat(adjustedUserGraph),
              borderWidth: 1,
              borderColor: '#EFBF17',
              backgroundColor: '#EFBF17',
              pointRadius: 0,
              tension: 0.15,
              hidden: step < 4,
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
              max: step > 0 ? 2050 : 2019,
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
                  return idx % 2 === 0 ? setup.labels[idx] : ''
                },
              },
            },
            y: {
              suggestedMax: 150_000,
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
