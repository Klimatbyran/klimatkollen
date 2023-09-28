import { GetServerSideProps } from 'next'
import { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'

import { useRouter } from 'next/router'
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
import {
  defaultDataset,
  datasetDescriptions,
  data,
  defaultViewMode,
  secondaryViewMode,
} from '../data/dataset_descriptions'
import RadioButtonMenu from '../components/RadioButtonMenu'
import { listColumns, rankData } from '../utils/createMunicipalityList'
import { normalizeString } from '../utils/shared'

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

type PropsType = {
  municipalities: Array<Municipality>
}

function StartPage({ municipalities }: PropsType) {
  const router = useRouter()
  const routeDataset = router.query.dataset
  const viewMode = router.query.viewMode || defaultViewMode

  const [toggleViewMode, setToggleViewMode] = useState(viewMode)
  const [selectedData, setSelectedData] = useState<SelectedData>(defaultDataset)

  const validDatasetsMap = Object.keys(datasetDescriptions).reduce<
    Record<string, string>
  >((acc, key) => {
    const normalizedKey = normalizeString(key)
    acc[normalizedKey] = key
    return acc
  }, {})

  useEffect(() => {
    if (routeDataset) {
      const routeDatasetNormalized = normalizeString(routeDataset as string)

      if (validDatasetsMap[routeDatasetNormalized]) {
        setToggleViewMode(toggleViewMode)
        setSelectedData(validDatasetsMap[routeDatasetNormalized])
      }
    }
    // Disable exhaustive-deps so that it only runs on first mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDataChange = (newData: SelectedData) => {
    const newDataString = newData as string
    setSelectedData(newDataString)
    const newDataLowerCase = newDataString.toLowerCase()
    router.push(`/${newDataLowerCase}`, undefined, { shallow: true, scroll: false })
  }

  const municipalityNames = municipalities.map((item) => item.Name) // get all municipality names for drop down
  const municipalityData = data(municipalities, selectedData) // get all municipality names and data points for map and list
  const datasetDescription = datasetDescriptions[selectedData] // get description of selected dataset

  const handleToggle = () => {
    const newViewMode = toggleViewMode === defaultViewMode ? secondaryViewMode : defaultViewMode
    setToggleViewMode(newViewMode)
    router.replace(`/${normalizeString(selectedData as string)}/${newViewMode}`, undefined, {
      shallow: true,
      scroll: false,
    })
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
            handleDataChange={handleDataChange}
          />
          <InfoText>
            <ParagraphBold>{datasetDescription.heading}</ParagraphBold>
            <Paragraph>{datasetDescription.body}</Paragraph>
            <ParagraphSource>{datasetDescription.source}</ParagraphSource>
          </InfoText>
          <ToggleButton
            handleClick={handleToggle}
            text={toggleViewMode === defaultViewMode ? 'Se lista' : 'Se karta'}
            icon={toggleViewMode === defaultViewMode ? <ListIcon /> : <MapIcon />}
          />
          <MunicipalityContainer>
            <div
              style={{
                display: toggleViewMode === defaultViewMode ? 'block' : 'none',
              }}
            >
              <MapLabels
                labels={datasetDescription.labels}
                rotations={datasetDescription.labelRotateUp}
              />
              <Map
                data={municipalityData}
                dataType={datasetDescription.dataType}
                boundaries={datasetDescription.boundaries}
              />
            </div>
            <div
              style={{
                display: toggleViewMode === secondaryViewMode ? 'block' : 'none',
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

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  const municipalities = new ClimateDataService().getMunicipalities()
  if (municipalities.length < 1) throw new Error('No municipalities found')

  res.setHeader(
    'Cache-Control',
    `public, stale-while-revalidate=60, max-age=${60 * 60 * 24 * 7}`,
  )

  const dataset = (params?.dataset || defaultDataset).toString().toLocaleLowerCase()

  return {
    props: { municipalities, dataset },
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
