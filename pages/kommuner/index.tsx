
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
import { IconButton } from '../../components/shared'
import InfoModal from '../../components/InfoModal'
import MapLabel from '../../components/MapLabel'


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

const ArrowIcon = styled(Icon) <{ rotateUp?: boolean }>`
  position: absolute;
  z-index: 1;
  margin: auto;
  left: 0;
  ${(props) => props.rotateUp && 'transform: rotate(-90deg)'};
  right: 0;
  top: 0;
  bottom: 0;
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

const InfoButton = styled(IconButton)`
  height: 50px;
  width: 50px;
`

const InfoBox = styled.div`
  padding-bottom: 0.5rem;
`

const Label = styled.div`
  flex-shrink: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &:first-child div {
    border-top-left-radius: 10%;
    border-top-right-radius: 10%;
  }
  &:last-child div {
    border-bottom-left-radius: 10%;
    border-bottom-right-radius: 10%;
  }
`

const StyledParagraph = styled(Paragraph)`
  z-index: 1;
  width: 5em;
  font-size: 0.7em;
  margin: 0;
  line-height: 0;
  @media only screen and (${devices.tablet}) {
    font-size: 0.9em;
  }
`

const Kommuner = ({ municipalities }: PropsType) => {
  const [, setSelected] = useState('Utforska kartan')
  const [toggleViewMode, setToggleViewMode] = useState(true)
  const [modalIsOpen, setModalIsOpen] = useState(false)

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

  const toggleModal = () => {
    const body = document.body
    if (!modalIsOpen) {
      body.style.overflow = 'hidden'
      setModalIsOpen(true)
    } else {
      body.style.overflow = ''
      setModalIsOpen(false)
    }
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
              Utsläppsförändring
              <InfoButton type="button" aria-label="Om grafen" onClick={toggleModal} >
                <Info />
              </InfoButton>
            </>)
        }, // Fixme fixa så att onclick funkar, sen snygga till
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
                  <MapLabel color={'#EF3054'} label={labels[0]} rotateUp={true} />
                  <MapLabel color={'#EF5E30'} label={labels[1]} />
                  <MapLabel color={'#EF7F17'} label={labels[2]} />
                  <MapLabel color={'#EF9917'} label={labels[3]} />
                  <MapLabel color={'#EFBF17'} label={labels[4]} />
                  <MapLabel color={'#91BFC8'} label={labels[5]} />
                </InfoBox>
              </MapLabels>
              <Map emissionsLevels={emissionsLevels} setSelected={setSelected}></Map>
            </div>
            <div style={{ display: toggleViewMode ? "none" : "block", width: '100%' }}>
              <ComparisonTable data={emissionsLevels} columns={cols} />

              {modalIsOpen && (
                <InfoModal
                  close={toggleModal}
                  text={`Lorem ipsum`}
                  scrollY={scrollX}
                />
              )}
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

