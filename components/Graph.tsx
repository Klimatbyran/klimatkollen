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
  step: number
  historical: EmissionPerYear[]
  sectorHistorical: EmissionSector[]
  trend: EmissionPerYear[]
  budget: EmissionPerYear[]
  maxVisibleYear: number
}

function Graph({
  step, historical, sectorHistorical, budget, trend, maxVisibleYear,
}: Props) {
  const setup = useMemo(
    () => getSetup([historical, trend, budget]),
    [historical, trend, budget],
  )

  const colorOfSector = (name) => ({
    'Transporter': '#A3A3A3',
    'Jordbruk': '#bfe5a0',
    'El och fjärrvärme': '#D58733',
    'Arbetsmaskiner': colorTheme.lightBlue,
    'Produktanvändning (inkl. lösningsmedel)': '#852C24',
    'Avfall (inkl.avlopp)': '#0F5257',
    'Egen uppärmning av bostäder och lokaler': '#C5533A',
    'Utrikes transporter': colorTheme.darkYellow,
    'Industri (energi + processer)': '#FFE07A',
  }[name] || colorTheme.lightYellow)

  const historicalDataset: Dataset = useMemo(
    () => emissionPerYearToDataset(historical),
    [historical],
  )
  const sectorHistoricals: Dataset = useMemo(
    () => sectorHistorical.map(({ Name, EmissionsPerYear }) => ({
      Name,
      EmissionsPerYear: emissionPerYearToDataset(EmissionsPerYear),
    })),
    [sectorHistorical],
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

  return (
    <Container>
      <YAxisTitle>Tusen ton CO₂</YAxisTitle>
      <Line
        datasetIdKey="id"
        data={{
          labels: setup.labels,
          datasets: [
            ...sectorHistoricals.map((x) => ({
              // @ts-ignore
              id: x.Name,
              label: x.Name,
              fill: true,
              data: x.EmissionsPerYear,
              borderWidth: 0,
              backgroundColor: colorOfSector(x.Name),
              pointRadius: 0,
              tension: 0.15,
              hidden: false,
              stack: 'sectors',
            })),
            {
              // @ts-ignore
              id: 'historical',
              label: 'Alla',
              fill: true,
              data: historicalDataset,
              borderWidth: 2,
              borderColor: colorTheme.orange,
              backgroundColor: colorTheme.darkOrangeOpaque,
              pointRadius: 0,
              tension: 0.15,
              hidden: true,
              stack: 'separate',
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
              borderColor: colorTheme.red,
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
                title() {
                  return ''
                },
                label(context) {
                  return `${context.dataset.label}: ${(context.parsed.y / 1000).toFixed(1)}`
                },
              },
            },
          },
          scales: {
            x: {
              min: step === 0 ? setup.minYear : 2015,
              max: step > 0 ? maxVisibleYear : 2021,
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
              stacked: true,
            },
          },
        }}
      />
    </Container>
  )
}

export default Graph
