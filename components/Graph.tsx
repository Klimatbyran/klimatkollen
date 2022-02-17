/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Filler,
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Line } from 'react-chartjs-2'

import styled from 'styled-components'

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler)

const RangeContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-left: 12.5rem;
`

const Range = styled.input`
  appearance: slider-vertical;
  writing-mode: bt-lr; // ie and edge
  width: 0.05rem;
  margin-right: 2.95rem;
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

type Props = {
  step: number
  historical: EmissionData[]
  paris: EmissionData[]
  pledged: EmissionData[]
}

type Dataset = Array<null | number>

const Graph = ({ step, historical, paris, pledged }: Props) => {
  const chartRef = useRef()
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

  const [userGraph, setUserGraph] = useState(
    pledged
      .filter((pledge) => pledge.year >= setup.adjustableYearStart)
      .map((f) => ({ year: f.year, co2: f.co2, current: f.co2, change: 1 })),
  )

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

  const options = {
    options: {
      responsive: true,
      scales: {
        x: {
          min: step > 2 ? 2019 : 1991,
          max: step > 0 ? 2050 : 2019,
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          grid: {
            drawBorder: false,
            display: false,
          },
          beginAtZero: true,
        },
      },
    },
    data: {
      labels: setup.labels,
      datasets: [
        {
          id: 'historical',
          fill: true,
          data: historicalDataset,
          borderWidth: 1,
          borderColor: 'rgba(239, 94, 48, 1)',
          backgroundColor: 'rgba(239, 94, 48, 0.3)',
          pointRadius: 0,
          tension: 0.5,
          hidden: false,
        },
        {
          id: 'paris',
          fill: true,
          data: parisDataset,
          borderWidth: 1,
          borderColor: 'rgba(239, 153, 23, 1)',
          backgroundColor: 'rgba(239, 153, 23, 0.3)',
          pointRadius: 0,
          tension: 0.5,
          hidden: false,
        },
        {
          id: 'pledge',
          fill: true,
          data: pledgeDataset,
          borderWidth: 1,
          borderColor: 'rgba(239, 48, 84, 1)',
          backgroundColor: 'rgba(239, 48, 84, 0.3)',
          pointRadius: 0,
          tension: 0.5,
          hidden: step < 2,
        },
        {
          id: 'usergrap',
          fill: true,
          data: (
            getFillerValues(setup.minYear, setup.adjustableYearStart) as Dataset
          ).concat(
            userGraph.reduce(
              (sum, f) => {
                const acc = sum.acc * f.change
                return {
                  acc,
                  values: sum.values.concat([f.co2 / acc]),
                }
              },
              { acc: 1, values: [] as Dataset },
            ).values,
          ),
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255)',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          pointRadius: 0,
          tension: 0,
          hidden: step < 4,
        },
      ],
    },
  }

  const handleYearChange = (index: number, value: number) => {
    setUserGraph((current) => {
      // const thing = current.reduce((prev, curr) => {
      //   return {
      //     ...curr,
      //     acc: prev.acc * curr.change,
      //     // emitted: prev.emitted +
      //   }
      //   // curr.emitted = prev.emitted + curr.co2 * curr.acc
      // })
      // console.log(thing)
      const copy = [...current]
      copy[index].change = value
      return copy
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Line
        ref={chartRef}
        datasetIdKey="id"
        data={options.data}
        options={options.options}
      />
      {step > 3 && (
        <RangeContainer>
          {userGraph.map((value, i) => (
            <Range
              key={i}
              min={1}
              max={2}
              step={0.01}
              value={value.change}
              type="range"
              // @ts-ignore - this is for firefox :*(
              orient="vertical"
              onChange={(e) => handleYearChange(i, parseFloat(e.target.value))}
            />
          ))}
        </RangeContainer>
      )}
    </div>
  )
}

export default Graph
