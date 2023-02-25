
import { GetServerSideProps } from 'next'
import { ReactElement, useMemo, useState } from 'react'
import styled from 'styled-components'
import { ColumnDef } from '@tanstack/react-table'

import DropDown from '../../components/DropDown'
import Map from '../../components/Map'
import MetaTags from '../../components/MetaTags'
import { ParagraphBold, Paragraph } from '../../components/Typography'
import { EmissionService } from '../../utils/emissionService'
import { Municipality } from '../../utils/types'
import PageWrapper from '../../components/PageWrapper'
import Icon from '../../public/icons/arrow.svg'
import { devices } from '../../utils/devices'
import Layout from '../../components/Layout'
import Footer from '../../components/Footer'
import ComparisonTable from '../../components/ComparisonTable'
import Info from '../../public/icons/info.svg'
import MapLabel from '../../components/MapLabel'
import InfoTooltip from '../../components/InfoTooltip'


type PropsType = {
  municipalities: Array<Municipality>
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const InfoText = styled.div`
  margin-top: 3rem;
`

const Square = styled.div<{ color: string }>`
  background-color: ${(props) => props.color};
  width: 20px;
  height: 20px;
  position: relative;
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

const Kommuner = ({ municipalities }: PropsType) => {
  const [, setSelected] = useState('Utforska kartan')
  const [toggleViewMode, setToggleViewMode] = useState(true)

  const municipalitiesName = municipalities.map((item) => item.Name)
  const emissionsLevels = municipalities.map((item) => ({
    name: item.Name,
    emissions: item.HistoricalEmission.EmissionLevelChangeAverage,
  }))

  type MuniciplaityItem = {
    name: string,
    emissions: number;
  }

  const convertToPercent = (rowData: unknown) => {
    let percentString = 'Data saknas'
    if (typeof (rowData) == 'number') {
      let percent = (rowData * 100).toFixed(1)
      percentString = percent > 0 ? '+' + percent + '%' : percent + '%'
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
              Utsläppsförändring<InfoTooltip text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
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
      <PageWrapper backgroundColor="black">
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
          <ToggleButton onClick={() => setToggleViewMode(!toggleViewMode)}>
            {toggleViewMode ? 'Visa lista' : 'Visa karta'}
          </ToggleButton>
          <MunicipalityContainer>
            <div style={{ display: toggleViewMode ? "block" : "none" }}>
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
              <Map emissionsLevels={emissionsLevels} setSelected={setSelected}></Map>
            </div>
            <div style={{ display: toggleViewMode ? "none" : "block", width: '100%' }}>
              <ComparisonTable data={emissionsLevels} columns={cols} />
            </div>
          </MunicipalityContainer>
        </Container>
      </PageWrapper>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const municipalities = new EmissionService().getMunicipalities()
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

