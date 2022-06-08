import { GetServerSideProps } from 'next'
import { ReactElement, useState } from 'react'
import styled from 'styled-components'
import Link from 'next/link'

import MetaTags from '../../components/MetaTags'
import { Paragraph } from '../../components/Typography'
import { EmissionService } from '../../utils/emissionService'
import PageWrapper from '../../components/PageWrapper'
import Layout from '../../components/Layout'
import Footer from '../../components/Footer'

import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle,
} from 'chart.js'
import { Bar, Radar } from 'react-chartjs-2'
Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle,
)

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`

const Partier = () => {
  const allParties = [
    {
      label: 'Total',
      data: [89, 100, 143, 139, 79, 67, 80],
      backgroundColor: ['rgb(75, 155, 79)'],
      borderColor: ['rgb(255, 99, 132)'],
      borderWidth: 0,
    },
  ]

  const party = [
    {
      label: 'Skog',
      data: [0, 12, 0, 0, 0, 0, 0],
      backgroundColor: ['rgba(255, 99, 132)'],
      borderColor: ['rgb(255, 99, 132)'],
      borderWidth: 0,
    },
    {
      label: 'Trafik',
      data: [0, 59, 0, 0, 0, 0, 0],
      backgroundColor: ['rgba(201, 203, 207)'],
      borderColor: ['rgb(255, 99, 132)'],
      borderWidth: 0,
    },
    {
      label: 'Total',
      data: [89, 0, 143, 139, 79, 67, 80],
      backgroundColor: ['rgb(75, 155, 79)'],
      borderColor: ['rgb(255, 99, 132)'],
      borderWidth: 0,
    },
  ]

  const [partyDetails, setPartyDetails] = useState(false)

  return (
    <>
      <MetaTags
        title="Klimatkollen — Få koll på Sveriges klimatomställning"
        description=""
      />
      <PageWrapper backgroundColor="black">
        <Container>
          <div>
            <Paragraph>Här kommer grafer för partierna finnas.</Paragraph>
          </div>
          <div>
            <Radar
              data={{
                labels: [
                  'Eating',
                  'Drinking',
                  'Sleeping',
                  'Designing',
                  'Coding',
                  'Cycling',
                  'Running',
                ],
                datasets: [
                  {
                    label: 'S',
                    data: [65, 59, 90, 81, 56, 55, 40],
                    fill: true,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgb(255, 99, 132)',
                    pointBackgroundColor: 'rgb(255, 99, 132)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(255, 99, 132)',
                  },
                  {
                    label: 'M',
                    data: [28, 48, 40, 19, 96, 27, 100],
                    fill: true,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgb(54, 162, 235)',
                    pointBackgroundColor: 'rgb(54, 162, 235)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(54, 162, 235)',
                  },
                ],
              }}
            />
          </div>
          <div style={{ width: '200px' }}>
            <Radar
              data={{
                labels: [
                  'Eating',
                  'Drinking',
                  'Sleeping',
                  'Designing',
                  'Coding',
                  'Cycling',
                  'Running',
                ],
                datasets: [
                  {
                    label: 'M',
                    data: [28, 48, 40, 19, 96, 27, 100],
                    fill: true,
                    backgroundColor: 'rgba(54, 162, 235)',
                    borderColor: 'rgb(54, 162, 235)',
                    pointBackgroundColor: 'rgb(54, 162, 235)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(54, 162, 235)',
                  },
                ],
              }}
              options={{
                elements: {
                  line: {
                    borderWidth: 0,
                    borderColor: '#ffffff',
                  },
                  point: {
                    radius: 0,
                  },
                },
                scales: {
                  r: {
                    pointLabels: { display: false },
                    ticks: { display: false },
                    grid: { color: '#c0c0c0' },
                  },
                },
                plugins: {
                  legend: {
                    onClick: () => {
                      null
                    },
                  },
                },
              }}
            />
          </div>
          <div>
            {!partyDetails ? (
              <Bar
                data={{
                  labels: ['S', 'M', 'V', 'MP', 'C', 'L', 'KD'],
                  datasets: allParties,
                }}
                options={{
                  indexAxis: 'y',
                  scales: {
                    x: {
                      stacked: true,
                    },

                    y: {
                      stacked: true,
                    },
                  },
                  plugins: {
                    legend: {
                      onClick: () => {
                        null
                      },
                    },
                  },
                }}
              />
            ) : (
              <Bar
                data={{
                  labels: ['S', 'M', 'V', 'MP', 'C', 'L', 'KD'],
                  datasets: party,
                }}
                options={{
                  indexAxis: 'y',
                  scales: {
                    x: {
                      stacked: true,
                    },

                    y: {
                      stacked: true,
                    },
                  },
                  plugins: {
                    legend: {
                      onClick: () => {
                        null
                      },
                    },
                  },
                }}
              />
            )}
            <button onClick={() => setPartyDetails(!partyDetails)}>Se detaljer</button>
          </div>
          <div>
            <Link href="/kommuner">
              <a href="placeholder">Kommuner</a>
            </Link>
          </div>
        </Container>
      </PageWrapper>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const municipalities = await new EmissionService().getMunicipalities()
  if (municipalities.length < 1) throw new Error('No municipalities found')

  res.setHeader(
    'Cache-Control',
    'public, stale-while-revalidate=60, max-age=' + 60 * 60 * 24 * 7,
  )

  return {
    props: { municipalities },
  }
}

export default Partier

Partier.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
      <Footer />
    </>
  )
}
