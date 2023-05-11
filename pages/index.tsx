import React from 'react'
import { GetServerSideProps } from 'next'
import { ReactElement, useMemo, useState } from 'react'
import styled from 'styled-components'
import { ColumnDef } from '@tanstack/react-table'

import DropDown from '../components/DropDown'
import Map from '../components/Map/Map'
import MetaTags from '../components/MetaTags'
import { H2, Paragraph, ParagraphBold } from '../components/Typography'
import { ClimateDataService } from '../utils/climateDataService'
import { Municipality, SelectedData } from '../utils/types'
import PageWrapper from '../components/PageWrapper'
import { devices } from '../utils/devices'
import Layout from '../components/Layout'
import Footer from '../components/Footer'
import ComparisonTable from '../components/ComparisonTable'
import MapLabels from '../components/Map/MapLabels'
import InfoTooltip from '../components/InfoTooltip'
import ListIcon from '../public/icons/list.svg'
import MapIcon from '../public/icons/map.svg'
import ToggleButton from '../components/ToggleButton'
import { dataSetDescriptions } from '../data/dataset_descriptions'
import RadioButtonMenu from '../components/RadioButtonMenu'

const DEFAULT_VIEWMODE = 'karta'
const DEFAULT_DATASET = 'Utsläppen'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const InfoText = styled.div`
  margin-top: 3rem;
`

const ParagraphSource = styled(Paragraph)`
  font-size: 13px;
  color: ${({ theme }) => theme.lightGrey};
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

type PropsType = {
  municipalities: Array<Municipality>
  viewMode: string
  dataset: SelectedData
}


const StartPage = ({ municipalities, viewMode = DEFAULT_VIEWMODE, dataset = DEFAULT_DATASET }: PropsType) => {
  const [selectedData, setSelectedData] = useState<SelectedData>(dataset)
  const [toggleViewMode, setToggleViewMode] = useState(viewMode)

  const [rankedData, setRankedData] = useState<{
    [key: string]: Array<{ name: string, dataPoint: number | string, rank?: number }>
  }>({})

  const municipalitiesName = municipalities.map((item) => item.Name)

  const data = municipalities.map((item) => ({ // Fixme refactor
    name: item.Name,
    dataPoint: selectedData === 'Utsläppen'
      ? item.HistoricalEmission.EmissionLevelChangeAverage
      : selectedData === 'Elbilarna'
        ? item.ElectricCarChangePercent
        : item.ClimatePlan.Link 
  }))

  const selectedDataset = dataSetDescriptions[selectedData]

  const calculateRankings = (data: Array<{ name: string, dataPoint: number }>, sortAscending: boolean) => {
    const sortedData = data.sort((a, b) => sortAscending ? a.dataPoint - b.dataPoint : b.dataPoint - a.dataPoint)
    const rankedData = sortedData.map((item, index) => ({
      ...item,
      rank: index + 1,
    }))
    return rankedData
  }

  useMemo(() => {  // Fixme refactor
    const dataSets = {
      Elbilarna: municipalities.map((item) => ({
        name: item.Name,
        dataPoint: item.ElectricCarChangePercent,
      })),
      Utsläppen: municipalities.map((item) => ({
        name: item.Name,
        dataPoint: item.HistoricalEmission.EmissionLevelChangeAverage,
      })),
      Klimatplanerna: municipalities.map((item) => ({
        name: item.Name,
        dataPoint: item.ClimatePlan?.Link,
      })),
    }

    type RankedData = {
      [key in SelectedData]: Array<{
        name: string
        dataPoint: number | string
        rank?: number
      }>
    }

    const newRankedData: RankedData = {
      Elbilarna: [],
      Utsläppen: [],
      Klimatplanerna: [],
    }    

    for (const dataSetKey in dataSets) {
      if (Object.prototype.hasOwnProperty.call(dataSets, dataSetKey)) {
        if (dataSetKey === 'Klimatplanerna') {
          newRankedData[dataSetKey] = dataSets[dataSetKey]
        } else {
          const sortAscending = dataSetKey === 'Elbilarna' ? false : true
          newRankedData[dataSetKey] = calculateRankings(
            dataSets[dataSetKey].map((item: { name: any; dataPoint: any }) => ({  // Fixme
              name: item.name,
              dataPoint: Number(item.dataPoint)
            })),
            sortAscending
          )
        }
      }
    }

    setRankedData(newRankedData)
  }, [municipalities])

  const columnHeader = (
    <div>
      {selectedDataset['columnHeader']}
      <InfoTooltip text={selectedDataset['tooltip']} />
    </div>
  )

  const handleToggle = () => {
    setToggleViewMode(toggleViewMode === 'lista' ? 'karta' : 'lista')
  }

  const boundaries: Array<string | number> = dataSetDescriptions[selectedData].boundaries
  const isLinkData = 'dataIsLink' in selectedDataset

  const formatData = (rowData: unknown) => {
    let dataString: JSX.Element = <span>Data saknas</span>
    if (isLinkData) {
      dataString = boundaries.includes(rowData as string) ?
        <i style={{ color: 'grey' }}>{rowData as string}</i>
        : <a href={rowData as string}>Öppna</a>
    } else if (typeof (rowData) === 'number') {
      const percent = (rowData * 100).toFixed(1)
      dataString = rowData > 0 ? <span>+{percent}</span> : <span>{percent}</span>
    } else if (typeof (rowData) === 'string') {
      dataString = <span>{rowData}</span>
    }
    return dataString
  }


  type MuniciplaityItem = {
    name: string,
    dataPoint: number | string
  }

  const cols = useMemo<ColumnDef<MuniciplaityItem>[]>(
    () => [
      {
        header: 'Ranking',
        cell: (row: { cell: { row: { index: number } } }) => row.cell.row.index + 1,
        accessorKey: 'index',
      },
      {
        header: 'Kommun',
        cell: (row: { renderValue: () => any }) => row.renderValue(),
        accessorKey: 'name',
      },
      {
        header: () => columnHeader,
        cell: (row: { renderValue: () => unknown }) => formatData(row.renderValue()),
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
          <RadioButtonMenu selectedData={selectedData} setSelectedData={setSelectedData} />
          <InfoText>
            <ParagraphBold>
              {selectedDataset['heading']}
            </ParagraphBold>
            <Paragraph>
              {selectedDataset['body']}
            </Paragraph>
            <ParagraphSource>
              {selectedDataset['source']}
            </ParagraphSource>
          </InfoText>
          <ToggleButton
            handleClick={handleToggle}
            text={toggleViewMode === 'karta' ? 'Se lista' : 'Se karta'}
            icon={toggleViewMode === 'karta' ? <MapIcon /> : <ListIcon />} />
          <MunicipalityContainer>
            <div style={{ display: toggleViewMode === 'karta' ? 'block' : 'none' }}>
              <MapLabels
                labels={selectedDataset['labels']}
                rotations={selectedDataset['labelRotateUp']} />
              <Map data={data} boundaries={selectedDataset['boundaries']} />
            </div>
            <div style={{ display: toggleViewMode === 'lista' ? 'block' : 'none', width: '100%' }}>
              <ComparisonTable data={rankedData[selectedData]} columns={cols} />
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

