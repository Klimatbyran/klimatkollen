import { GetServerSideProps } from 'next'
import React, { ReactElement, useState } from 'react'
import styled from 'styled-components'

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
import ListIcon from '../public/icons/list.svg'
import MapIcon from '../public/icons/map.svg'
import ToggleButton from '../components/ToggleButton'
import { default_dataset, datasetDescriptions, data } from '../data/dataset_descriptions'
import RadioButtonMenu from '../components/RadioButtonMenu'
import { listColumns, rankData } from '../utils/createMunicipalityList'

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
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  ::-webkit-scrollbar {
    /* Chrome, Safari and Opera */
    display: none;
  }
`

const default_view_mode = 'karta'
const secondary_view_mode = 'lista'

type PropsType = {
  municipalities: Array<Municipality>
  viewMode: string
  dataset: SelectedData
}

function StartPage({
  municipalities,
  viewMode = default_view_mode,
  dataset = default_dataset,
}: PropsType) {
  const [selectedData, setSelectedData] = useState<SelectedData>(dataset)
  const [toggleViewMode, setToggleViewMode] = useState(viewMode)

  const municipalityNames = municipalities.map((item) => item.Name) // get all municipality names for drop down
  const municipalityData = data(municipalities, selectedData) // get all municipality names and data points for map and list
  const datasetDescription = datasetDescriptions[selectedData] // get description of selected dataset

  const handleToggle = () => {
    setToggleViewMode(
      toggleViewMode === default_view_mode ? secondary_view_mode : default_view_mode,
    )
  }

  const cols = listColumns(selectedData, datasetDescription)
  const rankedData = rankData(municipalities)

  return (
    <>
      <MetaTags
        title="Klimatkollen — Få koll på Sveriges klimatomställning"
        description="Hur går det med utsläppen i Sverige och i din kommun? Minskar eller ökar klimatutsläppen? Klarar vi Parisavtalet?"
      />
      <PageWrapper backgroundColor="darkestGrey">
        <Container>
          <H2>Hur går det med?</H2>
          <RadioButtonMenu
            selectedData={selectedData}
            setSelectedData={setSelectedData}
          />
          <InfoText>
            <ParagraphBold>{datasetDescription.heading}</ParagraphBold>
            <Paragraph>{datasetDescription.body}</Paragraph>
            <ParagraphSource>{datasetDescription.source}</ParagraphSource>
          </InfoText>
          <ToggleButton
            handleClick={handleToggle}
            text={toggleViewMode === default_view_mode ? 'Se lista' : 'Se karta'}
            icon={toggleViewMode === default_view_mode ? <ListIcon /> : <MapIcon />}
          />
          <MunicipalityContainer>
            <div
              style={{
                display: toggleViewMode === default_view_mode ? 'block' : 'none',
              }}
            >
              <MapLabels
                labels={datasetDescription.labels}
                rotations={datasetDescription.labelRotateUp}
              />
              <Map data={municipalityData} dataType={datasetDescription.dataType} boundaries={datasetDescription.boundaries} />
            </div>
            <div
              style={{
                display: toggleViewMode === secondary_view_mode ? 'block' : 'none',
                width: '100%',
              }}
            >
              <ComparisonTable data={rankedData[selectedData]} columns={cols} />
            </div>
          </MunicipalityContainer>
          <DropDown
            className="startpage"
            municipalitiesName={municipalityNames}
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
    `public, stale-while-revalidate=60, max-age=${60 * 60 * 24 * 7}`,
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
