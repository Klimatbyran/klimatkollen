
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
import MapLabel from '../components/MapLabel'
import InfoTooltip from '../components/InfoTooltip'
import ListIcon from '../public/icons/list.svg'
import MapIcon from '../public/icons/map.svg'

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

const ToggleButton = styled.button`
  width: 112px;
  margin-top: 3rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.paperWhite};
  background: transparent;
  border-radius: 4px;
  border: 1px solid white;
  padding: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: ${({ theme }) => theme.darkGrey};
  }
`

const ToggleText = styled.p`
  margin-left: 8px;
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

type StartPageProps = {
  municipalities: Array<Municipality>
  viewMode: string
  dataSource: string
}

const StartPage = ({ municipalities, viewMode = 'karta' }: StartPageProps) => {
  const [selectedData, setSelectedData] = useState<SelectedData>('Elbilarna')
  const [toggleViewMode, setToggleViewMode] = useState(viewMode)
  const router = useRouter()
  const municipalitiesName = municipalities.map((item) => item.Name)
  const data = municipalities.map((item) => ({
    name: item.Name,
    dataPoint: selectedData == 'Utsläppen' ? item.HistoricalEmission.EmissionLevelChangeAverage : item.ElectricCarChangePercent,
  }))
  const [rankedData, setRankedData] = useState<{
    [key: string]: Array<{ name: string, dataPoint: number, rank: number }>
  }>({})

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

    const calculateRankings = (data: Array<{ name: string, dataPoint: number }>, sortAscending: boolean) => {
      const sortedData = data.sort((a, b) => sortAscending ? a.dataPoint - b.dataPoint : b.dataPoint - a.dataPoint);
      const rankedData = sortedData.map((item, index) => ({
        ...item,
        rank: index + 1,
      }));
      return rankedData;
    }
    
    type RankedData = {
      [key in SelectedData]: Array<{
        name: string;
        dataPoint: number;
        rank: number;
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

  const boundaries = {
    'Utsläppen': [0, -0.01, -0.02, -0.03, -0.10],
    'Elbilarna': [0.04, 0.05, 0.06, 0.07, 0.08]
  }

  const dataLabels = {
    'Utsläppen': ['0% +', '0–1%', '1–2%', '2–3%', '3–10%', '10–15%'],
    'Elbilarna': ['4% -', '4-5%', '5-6%', '6-7%', '7-8%', '8% +']
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
  const columnHeader = selectedData === 'Elbilarna' ?
    <>
      Andel elbilar
      <InfoTooltip
        text='Procent av nysålda bilar i kommunen som var elbilar 2022.' />
    </> :
    <>
      Utsläppsförändring
      <InfoTooltip
        text='På kartan visas genomsnittlig årlig förändring av utsläppen i Sveriges kommuner sedan Parisavtalet 2015.' />
    </>

  const labelColors = ['#EF3054', '#EF5E30', '#EF7F17', '#EF9917', '#EFBF17', '#91BFC8']

  const handleSelectData = () => {
    setSelectedData(selectedData == 'Elbilarna' ? 'Utsläppen' : 'Elbilarna')
  }

  type MuniciplaityItem = {
    name: string,
    dataPoint: number;
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
      percentString = rowData > 0 ? '+' + percent : percent
    }
    return percentString
  }

  const cols = useMemo<ColumnDef<MuniciplaityItem>[]>(
    () => [
      {
        header: 'Ranking',
        cell: (row) => row.cell.row.index + 1, // fixme fortsätt här
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
            <div>
              {selectedData === 'Elbilarna' ? 'Andel elbilar' : 'Utsläppsförändring'}
              <InfoTooltip text={dataHeading[selectedData === 'Elbilarna' ? 'Elbilarna' : 'Utsläppen'][1]} />
            </div>
          )
        },
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
            {toggleViewMode == 'karta' ?
              <>
                <ListIcon />
                <ToggleText>
                  Se lista
                </ToggleText>
              </> :
              <>
                <MapIcon />
                <ToggleText>
                  Se karta
                </ToggleText>
              </>
            }
          </ToggleButton>
          <MunicipalityContainer>
            <div style={{ display: toggleViewMode == 'karta' ? 'block' : 'none' }}>
              <MapLabels>
                <InfoBox>
                  {dataLabels[selectedData == 'Elbilarna' ? 'Elbilarna' : 'Utsläppen'].map((label, i) => (
                    <MapLabel key={i} color={labelColors[i]} label={label} />
                  ))}
                </InfoBox>
              </MapLabels>
              <Map data={data} boundaries={boundaries[selectedData == 'Elbilarna' ? 'Elbilarna' : 'Utsläppen']} />
            </div>
            <div style={{ display: toggleViewMode == 'lista' ? 'block' : 'none', width: '100%' }}>
              <ComparisonTable data={rankedData[selectedData == 'Elbilarna' ? 'Elbilarna' : 'Utsläppen']} columns={cols} />
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

export default StartPage

StartPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
      <Footer />
    </>
  )
}

