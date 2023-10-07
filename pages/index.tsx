import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'

import { useRouter } from 'next/router'
import DropDown from '../components/DropDown'
import MetaTags from '../components/MetaTags'
import {
  H2Regular, H5Regular, Paragraph,
} from '../components/Typography'
import { ClimateDataService } from '../utils/climateDataService'
import { Municipality, SelectedData } from '../utils/types'
import PageWrapper from '../components/PageWrapper'
import { devices } from '../utils/devices'
import Layout from '../components/Layout'
import Footer from '../components/Footer/Footer'
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

/**
 * FIXME
 *
 * - ta bort "hopp" när man byter från default-läge
 * - lägg till routing så att man får url direkt på start? ATT DISKUTERA
 * - fixa så att viewMode håller sig när man hoppar mellan dataset
 *
*/

const Map = dynamic(() => import('../components/Map/Map'))

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 32px;
  align-items: center;

  @media only and ${devices.mobile} {
    margin-top: 16px;
  }
`

const InfoText = styled.div`
  padding: 1rem 1rem 0 1rem;
`

const ParagraphSource = styled(Paragraph)`
  font-size: 13px;
  color: ${({ theme }) => theme.grey};
`

const InfoContainer = styled.div`
  width: 100%;
  position: relative;
  background: ${({ theme }) => theme.lightBlack};
  border-radius: 8px;
  margin-bottom: 32px;
  z-index: 15;
  ::-webkit-scrollbar {
    display: none;
  }
`

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const FloatingH5 = styled(H5Regular)`
  position: absolute;
  margin: 60px 0 0 16px;
  z-index: 200;

  @media only screen and (${devices.mobile}) {
    margin: 55px 0 0 16px;
  }
`

const ComparisonContainer = styled.div<{ $viewMode: string }>`
  position: relative;
  overflow-y: scroll;
  z-index: 100;
  // TODO: Hardcoding this is not good.
  height: 400px;
  border-radius: 8px;
  display: flex;
  margin-top: ${({ $viewMode }) => ($viewMode === secondaryViewMode ? '64px' : '0')};

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

  const isDefaultViewMode = toggleViewMode === defaultViewMode

  return (
    <>
      <MetaTags
        title="Klimatkollen — Få koll på Sveriges klimatomställning"
        description="Hur går det med utsläppen i Sverige och i din kommun? Minskar eller ökar klimatutsläppen? Klarar vi Parisavtalet?"
      />
      <PageWrapper backgroundColor="black">
        <Container>
          <H2Regular>Hur går det med?</H2Regular>
          <RadioButtonMenu
            selectedData={selectedData}
            handleDataChange={handleDataChange}
          />
          <InfoContainer>
            <TitleContainer>
              <FloatingH5>{datasetDescription.title}</FloatingH5>
              <ToggleButton
                handleClick={handleToggle}
                text={isDefaultViewMode ? 'Listvy' : 'Kartvy'}
                icon={isDefaultViewMode ? <ListIcon /> : <MapIcon />}
              />
            </TitleContainer>
            <ComparisonContainer $viewMode={toggleViewMode.toString()}>
              {isDefaultViewMode && (
                <>
                  <MapLabels
                    labels={datasetDescription.labels}
                    rotations={datasetDescription.labelRotateUp}
                  />
                  <Map
                    data={municipalityData}
                    dataType={datasetDescription.dataType}
                    boundaries={datasetDescription.boundaries}
                  />
                </>
              )}
              {toggleViewMode === secondaryViewMode && (
                <ComparisonTable data={rankedData[selectedData]} columns={cols} />
              )}
            </ComparisonContainer>
            <InfoText>
              <Paragraph>{datasetDescription.body}</Paragraph>
              <ParagraphSource>{datasetDescription.source}</ParagraphSource>
            </InfoText>
          </InfoContainer>
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
