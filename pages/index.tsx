
import { GetServerSideProps } from 'next'
import { ReactElement, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { ColumnDef } from '@tanstack/react-table'

import DropDown from '../components/DropDown'
import Map from '../components/Map'
import MetaTags from '../components/MetaTags'
import { H2, Paragraph, ParagraphBold } from '../components/Typography'
import { ClimateDataService } from '../utils/climateDataService'
import { Municipality } from '../utils/types'
import PageWrapper from '../components/PageWrapper'
import { devices } from '../utils/devices'
import Layout from '../components/Layout'
import Footer from '../components/Footer'
import ComparisonTable from '../components/ComparisonTable'
import MapLabels from '../components/MapLabels'
import InfoTooltip from '../components/InfoTooltip'
import ListIcon from '../public/icons/list.svg'
import MapIcon from '../public/icons/map.svg'
import ToggleButton from '../components/ToggleButton'
import { dataSetDescriptions } from '../data/dataset_description'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const RadioContainer = styled.div`
  margin-top: 30px;
  gap: 16px;
  display: flex;
  font-weight: bolder;
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

type SelectedData = 'Utsläppen' | 'Elbilarna'

type PropsType = {
  municipalities: Array<Municipality>
  viewMode: string
  dataSource: SelectedData
}

const StartPage = ({ municipalities, viewMode = 'karta', dataSource = 'Utsläppen' }: PropsType) => {
  const [selectedData, setSelectedData] = useState<SelectedData>(dataSource)
  const [toggleViewMode, setToggleViewMode] = useState(viewMode)
  const router = useRouter()

  const [rankedData, setRankedData] = useState<{
    [key: string]: Array<{ name: string, dataPoint: number, rank: number }>
  }>({})

  const municipalitiesName = municipalities.map((item) => item.Name)

  const data = municipalities.map((item) => ({
    name: item.Name,
    dataPoint: selectedData === 'Utsläppen' ? item.HistoricalEmission.EmissionLevelChangeAverage : item.ElectricCarChangePercent,
  }))

  const calculateRankings = (data: Array<{ name: string, dataPoint: number }>, sortAscending: boolean) => {
    const sortedData = data.sort((a, b) => sortAscending ? a.dataPoint - b.dataPoint : b.dataPoint - a.dataPoint);
    const rankedData = sortedData.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
    return rankedData;
  }

  useMemo(() => {
    const dataSets = {
      Elbilarna: municipalities.map((item) => ({
        name: item.Name,
        dataPoint: item.ElectricCarChangePercent,
      })),
      Utsläppen: municipalities.map((item) => ({
        name: item.Name,
        dataPoint: item.HistoricalEmission.EmissionLevelChangeAverage,
      })),
    }

    type RankedData = {
      [key in SelectedData]: Array<{
        name: string
        dataPoint: number
        rank: number
      }>
    }

    const newRankedData: RankedData = {
      Elbilarna: [],
      Utsläppen: [],
    }

    for (const dataSetKey in dataSets) {
      if (Object.prototype.hasOwnProperty.call(dataSets, dataSetKey)) {
        const sortAscending = dataSetKey === 'Elbilarna' ? false : true;
        newRankedData[dataSetKey as SelectedData] = calculateRankings(dataSets[dataSetKey as SelectedData], sortAscending);
      }
    }

    setRankedData(newRankedData)
  }, [municipalities])

  const columnHeader = (
    <div>
      {selectedData === 'Elbilarna' ? 'Ökning elbilar' : 'Utsläppsförändring'}
      <InfoTooltip text={dataSetDescriptions[selectedData === 'Elbilarna' ? 'Elbilarna' : 'Utsläppen']['tooltip']} />
    </div>
  )

  const handleSelectData = () => {
    const path = router.pathname.includes('elbilarna') && selectedData === 'Elbilarna' ? '/' : '/elbilarna'
    router.push(path, undefined, { shallow: true })
    setSelectedData(selectedData === 'Elbilarna' ? 'Utsläppen' : 'Elbilarna')
  }

  const handleToggle = () => {
    setToggleViewMode(toggleViewMode === 'lista' ? 'karta' : 'lista')
  }

  const convertToPercent = (rowData: unknown) => {
    let percentString = 'Data saknas'
    if (typeof (rowData) === 'number') {
      const percent = (rowData * 100).toFixed(1)
      percentString = rowData > 0 ? '+' + percent : percent
    }
    return percentString
  }

  type MuniciplaityItem = {
    name: string,
    dataPoint: number;
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
        header: () => columnHeader,
        cell: (row) => convertToPercent(row.renderValue()),
        accessorKey: 'dataPoint',
      },
    ],
    [columnHeader]
  )

  return (
    <>
      <MetaTags
        title="Klimatkollen — Få koll på Sveriges klimatomställning"
        description="Hur går det med utsläppen i Sverige och i din kommun? Minskar eller ökar klimatutsläppen? Klarar vi Parisavtalet?"
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
              {dataSetDescriptions[selectedData === 'Elbilarna' ? 'Elbilarna' : 'Utsläppen']['heading']}
            </ParagraphBold>
            <Paragraph>
              {dataSetDescriptions[selectedData === 'Elbilarna' ? 'Elbilarna' : 'Utsläppen']['body']}
            </Paragraph>
          </InfoText>
          <ToggleButton
            handleClick={handleToggle}
            text={toggleViewMode === 'karta' ? 'Se lista' : 'Se karta'}
            icon={toggleViewMode === 'karta' ? <MapIcon /> : <ListIcon />} />
          <MunicipalityContainer>
            <div style={{ display: toggleViewMode === 'karta' ? 'block' : 'none' }}>
              <MapLabels 
              labels={dataSetDescriptions[selectedData === 'Elbilarna' ? 'Elbilarna' : 'Utsläppen']['labels']}
              rotations={dataSetDescriptions[selectedData === 'Elbilarna' ? 'Elbilarna' : 'Utsläppen']['labelRotateUp']} />
              <Map data={data} boundaries={dataSetDescriptions[selectedData === 'Elbilarna' ? 'Elbilarna' : 'Utsläppen']['boundaries']} />
            </div>
            <div style={{ display: toggleViewMode === 'lista' ? 'block' : 'none', width: '100%' }}>
              <ComparisonTable data={rankedData[selectedData === 'Elbilarna' ? 'Elbilarna' : 'Utsläppen']} columns={cols} />
            </div>
          </MunicipalityContainer>
          <DropDown
            className="startpage"
            municipalitiesName={municipalitiesName}
            placeholder="Hur går det i din kommun?"
          />
        </Container>
      </PageWrapper >
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

export default StartPage

StartPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
      <Footer />
    </>
  )
}

