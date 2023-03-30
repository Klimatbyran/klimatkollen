
import { GetServerSideProps } from 'next'
import { ReactElement, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { ColumnDef } from '@tanstack/react-table'

import DropDown from '../components/DropDown'
import Map from '../components/Map'
import MetaTags from '../components/MetaTags'
import { ParagraphBold } from '../components/Typography'
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

type PropsType = {
  municipalities: Array<Municipality>
  viewMode: string
}


const Kommuner = ({ municipalities, viewMode = 'karta' }: PropsType) => {
  const [toggleViewMode, setToggleViewMode] = useState(viewMode)
  const router = useRouter()

  const municipalitiesName = municipalities.map((item) => item.Name)
  const emissionsLevels = municipalities.map((item) => ({
    name: item.Name,
    emissions: item.HistoricalEmission.EmissionLevelChangeAverage,
  }))

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
          <DropDown
            className="startpage"
            municipalitiesName={municipalitiesName}
            placeholder="Hur går det i din kommun?"
          />
          <InfoText>
            <ParagraphBold>Utsläppsförändring sedan Parisavtalet</ParagraphBold>
            <p>
              På kartan visas genomsnittlig årlig förändring av utsläppen i Sveriges
              kommuner sedan Parisavtalet 2015.
            </p>
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
                  <MapLabel color={'#EF3054'} label={'0% +'} rotateUp={true} />
                  <MapLabel color={'#EF5E30'} label={'0–1%'} />
                  <MapLabel color={'#EF7F17'} label={'1–2%'} />
                  <MapLabel color={'#EF9917'} label={'2–3%'} />
                  <MapLabel color={'#EFBF17'} label={'3–10%'} />
                  <MapLabel color={'#91BFC8'} label={'10–15%'} />
                </InfoBox>
              </MapLabels>
              <Map emissionsLevels={emissionsLevels} />
            </div>
            <div style={{ display: toggleViewMode == 'lista' ? 'block' : 'none', width: '100%' }}>
              <ComparisonTable data={emissionsLevels} columns={cols} />
            </div>
          </MunicipalityContainer>
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

export default Kommuner

Kommuner.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
      <Footer />
    </>
  )
}

