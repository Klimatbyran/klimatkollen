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

const YAxisTitle = styled.label`
  font-size: 0.94rem;
  margin-bottom: 1rem;
`

const RangeContainer = styled.div`
  margin-top: 4rem;
  display: flex;
  justify-content: center;
`

const Range = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Slider = styled.input`
  appearance: slider-vertical;
  writing-mode: bt-lr; // ie and edge
  width: 4rem;
  margin-top: 0.25rem;
`

const Percentage = styled.label`
  font-size: 0.75rem;
  margin-top: 6px;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const MandatePeriod = styled.div`
  font-size: 0.75rem;
`

const StartYear = styled.div`
  border-bottom: 1px solid white;
  font-weight: 300;
`
const EndYear = styled.div`
  font-weight: 300;
`

const Help = styled.p`
  margin-top: 2rem;
  line-height: 1.5rem;
`

const P = styled.p`
  margin-top: 1.5rem;
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

const MANDATE_PERIODS = [
  [2022, 2026],
  [2026, 2030],
  [2030, 2034],
  [2034, 2038],
  [2038, 2042],
  [2042, 2046],
  [2046, 2050],
]

type Props = {
  step: number
  historical: EmissionData[]
  paris: EmissionData[]
  pledged: EmissionData[]
}

type Dataset = Array<null | number>

const Graph = ({ step, historical, paris, pledged }: Props) => {
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

  const [mandateChanges, setMandateChanges] = useState(
    MANDATE_PERIODS.map((f) => ({
      start: f[0],
      end: f[1],
      change: 1.0,
    })),
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

    mandateChanges.forEach((mandate) => {
      acc = acc * mandate.change
      userGraph
        .filter((f) => f.year >= mandate.start && f.year < mandate.end) // range exlusive end
        .forEach((f) => {
          dataset.push(f.co2 / acc)
        })
    })
    return dataset
  }, [userGraph, mandateChanges])

  const handleYearChange = (index: number, value: number) => {
    setMandateChanges((m) => {
      const copy = [...m]
      copy[index].change = value
      return copy
    })
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
              borderColor: '#EF5E30',
              backgroundColor: '#EF5E30',
              pointRadius: 0,
              tension: 0.5,
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
              tension: 0.5,
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
              tension: 0.5,
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
              tension: 0.5,
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
      {step > 3 && (
        <>
          <RangeContainer>
            {mandateChanges.map((value, i) => (
              <Range
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                <MandatePeriod>
                  <StartYear>{value.start}</StartYear>
                  <EndYear>{value.end}</EndYear>
                </MandatePeriod>
                <Slider
                  min={1}
                  max={2}
                  step={0.01}
                  value={value.change}
                  type="range"
                  // @ts-ignore - this is for firefox :*(
                  orient="vertical"
                  onChange={(e) => handleYearChange(i, parseFloat(e.target.value))}
                />
                <Percentage>{100 - Math.round(100 / value.change)}%</Percentage>
              </Range>
            ))}
          </RangeContainer>
          <Help>
            Med hjälp av reglagen så styr du hur stora utsläppsminskningar man behöver
            göra per mandatperiod för att nå Parisavtalet.
          </Help>
          <P>Dela din graf på sociala medier.</P>
        </>
      )}
    </Container>
  )
}

export default Graph
