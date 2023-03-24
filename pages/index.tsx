
import { GetServerSideProps } from 'next'
import { ReactElement, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { ColumnDef } from '@tanstack/react-table'

import DropDown from '../components/DropDown'
import Map from '../components/Map'
import MetaTags from '../components/MetaTags'
import {  H2, Paragraph, ParagraphBold } from '../components/Typography'
import { ClimateDataService } from '../utils/climateDataService'
import { Municipality } from '../utils/types'
import PageWrapper from '../components/PageWrapper'
import { devices } from '../utils/devices'
import Layout from '../components/Layout'
import Footer from '../components/Footer'
import ComparisonTable from '../components/ComparisonTable'
import MapLabel from '../components/MapLabel'
import InfoTooltip from '../components/InfoTooltip'


const Container = styled.div`
  display: flex;
  flex-direction: column;
`


/*
      & .active {
        background-color: ${({ theme }) => theme.main};
        & :hover {
          background-color: ${({ theme }) => theme.greenGraphOne};

      & .inactive {
        background-color: ${({ theme }) => theme.white};
        & :hover {
          background-color: ${({ theme }) => theme.greenGraphThree};
*/


const RadioContainer = styled.div`
  margin-top: 30px;
  gap: 16px;
  display: flex;
  font-weight: bolder
`

const RadioLabel = styled.label`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  text-decoration: none;
  color: ${({ theme }) => theme.darkestGrey};
  background: white;
  white-space: nowrap;
  cursor: pointer;
  margin-bottom: 8px;
  
  &:hover {
    background: ${({ theme }) => theme.greenGraphThree};
`

const RadioInput = styled.input`
  display: none;
  &:checked + ${RadioLabel} {
    background: ${({ theme }) => theme.greenGraphTwo};
  }
`

const InfoText = styled.div`
  margin-top: 3rem;
`

const ToggleButton = styled.button`
  width: 96px;
  margin-top: 3rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.paperWhite};
  background: transparent;
  border-radius: 4px;
  border: 1;
  padding: 0.8rem;
  cursor: pointer;
  fill: ${({ theme }) => theme.greenGraphTwo};
  &:hover {
    background: ${({ theme }) => theme.darkGrey};
  }
`

const MunicipalityContainer = styled.div`
  position: relative;
  overflow-y: scroll;
  z-index: 150;
  // TODO: Hardcoding this is not good.
  height: 380px;
  border: 1px solid ${({ theme }) => theme.paperWhite};
  border-radius: 8px;
  display: flex;
  margin-bottom: 32px;
  @media only screen and (${devices.tablet}) {
    height: 500px;
  }
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  ::-webkit-scrollbar {  /* Chrome, Safari and Opera */
    display: none;
  }
`

const MapLabels = styled.div`
  padding-left: 0.87rem;
  padding-top: 1.2rem;
  @media only screen and (${devices.tablet}) {
    position: absolute;
    left: 0;
    top: 0;
  }
`

const InfoBox = styled.div`
  padding-bottom: 0.5rem;
`

type SelectedData = 'Utsläppen' | 'Elbilarna'

type PropsType = {
  municipalities: Array<Municipality>
  viewMode: string
}

const Kommuner = ({ municipalities, viewMode = 'karta' }: PropsType) => {
  const [selectedData, setSelectedData] = useState<SelectedData>('Elbilarna')
  const [toggleViewMode, setToggleViewMode] = useState(viewMode)
  const router = useRouter()
  const municipalitiesName = municipalities.map((item) => item.Name)
  const data = municipalities.map((item) => ({
    name: item.Name,
    emissions: selectedData == 'Utsläppen' ? item.HistoricalEmission.EmissionLevelChangeAverage : item.ElectricCars,
  }))
  const boundaries = {
    'Utsläppen': [0, -0.01, -0.02, -0.03, -0.10],
    'Elbilarna': [0.30, 0.40, 0.50, 0.60, 0.70]
  }
  const dataHeading = {
    'Utsläppen': [
      'Utsläppsförändring sedan Parisavtalet',
      'På kartan visas genomsnittlig årlig förändring av utsläppen i Sveriges kommuner sedan Parisavtalet 2015.'
    ],
    'Elbilarna': [
      'Andel elbilar i nyförsäljning',
      'På kartan visas andelen elbilar av totala antalet bilar som såldes 2022.'
    ],
  }
  const dataColumnHeader = {
    'Utsläppen': [
      'Utsläppsförändring',
      'På kartan visas genomsnittlig årlig förändring av utsläppen i Sveriges kommuner sedan Parisavtalet 2015.'
    ],
    'Elbilarna': [
      'Andel elbilar',
      'Procent av nysålda bilar i kommunen som var elbilar 2022.'
    ],
  }
  const dataLabels = {
    'Utsläppen': ['0% +', '0–1%', '1–2%', '2–3%', '3–10%', '10–15%'],
    'Elbilarna': ['30% -', '30-40%', '40-50%', '50-60%', '60-70%', '70% +']
  }
  const labelColors = ['#EF3054', '#EF5E30', '#EF7F17', '#EF9917', '#EFBF17', '#91BFC8']

  const handleSelectData = () => {
    setSelectedData(selectedData == 'Elbilarna' ? 'Utsläppen' : 'Elbilarna')
  }

  type MuniciplaityItem = {
    name: string,
    emissions: number;
  }

  const handleToggle = () => {
    if (toggleViewMode == 'karta') {
      setToggleViewMode('lista')
      router.push('lista', undefined, { shallow: true })
    } else {
      setToggleViewMode('karta')
      router.push('karta', undefined, { shallow: true })
    }
  }

  const convertToPercent = (rowData: unknown) => {
    let percentString = 'Data saknas'
    if (typeof (rowData) == 'number') {
      const percent = (rowData * 100).toFixed(1) + '%'
      if (selectedData == 'Utsläppen') {
        percentString = rowData > 0 ? '+' + percent : percent
      } else {
        percentString = percent
      }
    }
    return percentString
  }

  const cols = useMemo<ColumnDef<MuniciplaityItem>[]>(
    () => [
      {
        header: 'Ranking',
        cell: (row) => row.cell.row.index + 1,
        accessorKey: 'index',
      },
      {
        header: 'Kommun',
        cell: (row) => row.renderValue(),
        accessorKey: 'name',
      },
      {
        header: () => {
          return (
            <> {/*  fixme fortsätt här, behöver ändra kolumnheader när man togglar! behöver också fixa redirect baserat på vad som är på karta/lista */}
              {dataColumnHeader[selectedData == 'Elbilarna' ? 'Elbilarna' : 'Utsläppen'][0]}
              <InfoTooltip text={dataColumnHeader[selectedData == 'Elbilarna' ? 'Elbilarna' : 'Utsläppen'][1]} />
            </>)
        },
        cell: (row) => convertToPercent(row.renderValue()),
        accessorKey: 'emissions',
      },
    ],
    []
  )

  return (
    <>
      <MetaTags
        title="Klimatkollen — Få koll på Sveriges klimatomställning"
        description="Hur går det med utsläppsminskningarna i Sverige och i din kommun? Minskar eller ökar klimatutsläppen? Klarar vi Parisavtalet?"
      />
      <PageWrapper backgroundColor='darkestGrey'>
        <Container>
          <H2>
            Hur går det med?
          </H2>
          <RadioContainer>
              <RadioInput
                type="radio"
                id="utslappen"
                value='Utsläppen'
                checked={selectedData === 'Utsläppen'}
                onChange={() => handleSelectData()}
              />

            <RadioLabel htmlFor="utslappen">
              Utsläppen
            </RadioLabel>
              <RadioInput
                type="radio"
                id='elbilarna'
                value='Elbilarna'
                checked={selectedData === 'Elbilarna'}
                onChange={() => handleSelectData()}
              />
              <RadioLabel htmlFor="elbilarna">
              Elbilarna
            </RadioLabel>
          </RadioContainer>
          <InfoText>
            <ParagraphBold>
              {dataHeading[selectedData == 'Elbilarna' ? 'Elbilarna' : 'Utsläppen'][0]}
            </ParagraphBold>
            <Paragraph>
              {dataHeading[selectedData == 'Elbilarna' ? 'Elbilarna' : 'Utsläppen'][1]}
            </Paragraph>
          </InfoText>
          <ToggleButton onClick={handleToggle}>
            {toggleViewMode == 'karta' ? 'Se lista' : 'Se karta'}
          </ToggleButton>
          <MunicipalityContainer>
            <div style={{ display: toggleViewMode == 'karta' ? 'block' : 'none' }}>
              <MapLabels>
                <InfoBox>
                  {dataLabels[selectedData == 'Elbilarna' ? 'Elbilarna' : 'Utsläppen'].map((label, i) => (
                    <MapLabel color={labelColors[i]} label={label} />
                  ))}
                </InfoBox>
              </MapLabels>
              <Map emissionsLevels={data} boundaries={boundaries[selectedData == 'Elbilarna' ? 'Elbilarna' : 'Utsläppen']} />
            </div>
            <div style={{ display: toggleViewMode == 'lista' ? 'block' : 'none', width: '100%' }}>
              <ComparisonTable data={data} columns={cols} />
            </div>
          </MunicipalityContainer>
          <DropDown
            className="startpage"
            municipalitiesName={municipalitiesName}
            placeholder="Hur går det i din kommun?"
          />
        </Container>
      </PageWrapper>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const municipalities = new ClimateDataService().getMunicipalities()
  if (municipalities.length < 1) throw new Error('No municipalities found')

  res.setHeader(
    'Cache-Control',
    'public, stale-while-revalidate=60, max-age=' + 60 * 60 * 24 * 7,
  )

  return {
    props: { municipalities },
  }
}

export default Kommuner

Kommuner.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
      <Footer />
    </>
  )
}

