
import { GetServerSideProps } from 'next'
import { ReactElement, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { ColumnDef } from '@tanstack/react-table'

import DropDown from '../components/DropDown'
import Map from '../components/Map'
import MetaTags from '../components/MetaTags'
import { Paragraph, ParagraphBold } from '../components/Typography'
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

const RadioContainer = styled.div`
  display: flex;
  column-gap: 200px;
  justify-content: center;
  border-bottom: 1px solid white;
`

const RadioLabel = styled.label`
  display: inline-block;
  vertical-align: top;
  font-weight: bolder;
  cursor: pointer;
  margin-bottom: 8px;
  &:hover {
    color: ${({ theme }) => theme.greenGraphTwo};
`

const RadioInput = styled.input`
  display: none;
`

const InfoText = styled.div`
  margin-top: 3rem;
`

const ToggleButton = styled.button`
  width: 100%;
  margin-top: 3rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.paperWhite};
  background: ${({ theme }) => theme.darkGrey};
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 0;
  align-items: center;
  justify-content: center;
  padding: 0.8rem;
  cursor: pointer;
  fill: ${({ theme }) => theme.greenGraphTwo};
  &:hover {
    background: ${({ theme }) => theme.grey};
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
    'Utsläppen': [0, -0.01, -0.02, -0.03, -0.1],
    'Elbilarna': [30, 40, 50, 60, 70]
  }

  const dataLabels = {
    'Utsläppen': ['0% +', '0–1%', '1–2%', '2–3%', '3–10%', '10–15%'],
    'Elbilarna': ['30% -', '30-40%', '40-50%', '50-60%', '60-70%', '70% +']
  }
  const labelColors = ['#EF3054', '#EF5E30', '#EF7F17', '#EF9917', '#EFBF17', '#91BFC8']

  const handleSelectData = (selection: SelectedData) => {
    if (selectedData == 'Elbilarna') {
      setSelectedData('Utsläppen')
    } else {
      setSelectedData('Elbilarna')
    }
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
      percentString = rowData > 0 ? '+' + percent : percent
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
            <>
              Utsläppsförändring<InfoTooltip text="Genomsnittlig årlig procentuell förändring av koldioxidutsläppen sedan Parisavtalet 2015" />
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
          <ParagraphBold>
            Hur går det med...?
          </ParagraphBold>
          <RadioContainer>
            <RadioLabel>
              <RadioInput
                type="radio"
                value='Utsläppen'
                checked={selectedData === 'Utsläppen'}
                onChange={() => handleSelectData('Utsläppen')}
              />
              Utsläppen
            </RadioLabel>
            {/* fixne styla så att man ser vilken som är aktiv */}
            <RadioLabel>
              <RadioInput
                type="radio"
                value='Elbilarna'
                checked={selectedData === 'Elbilarna'}
                onChange={() => handleSelectData('Elbilarna')}
              />
              Elbilarna
            </RadioLabel>
          </RadioContainer>
          <InfoText>
            <ParagraphBold>
              Utsläppsförändring sedan Parisavtalet
            </ParagraphBold>
            <Paragraph>
              På kartan visas genomsnittlig årlig förändring av utsläppen i Sveriges
              kommuner sedan Parisavtalet 2015.
            </Paragraph>
          </InfoText>
          <ToggleButton onClick={handleToggle}>
            {toggleViewMode == 'karta' ? 'Visa lista' : 'Visa karta'}
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

