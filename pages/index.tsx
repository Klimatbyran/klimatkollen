import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

import Markdown from '../components/Markdown'
import DropDown from '../components/DropDown'
import MetaTags from '../components/MetaTags'
import { H2Regular, Paragraph } from '../components/Typography'
import { Municipality, DatasetKey } from '../utils/types'
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
  getDataDescriptions,
  dataOnDisplay,
  defaultDataView,
  secondaryDataView,
} from '../utils/datasetDefinitions'
import RadioButtonMenu from '../components/RadioButtonMenu'
import { listColumns, rankData } from '../utils/createMunicipalityList'
import {
  isValidDataView,
  normalizeString,
} from '../utils/shared'

const Map = dynamic(() => import('../components/Map/Map'))

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vh;
  height: 100vh;
  align-items: center;
`

const InfoText = styled.div`
  padding: 0 16px;
`

const ParagraphSource = styled(Paragraph)`
  font-size: 13px;
  color: ${({ theme }) => theme.grey};
`

const TitleRow = styled.div`
position: absolute;
top: 0;
left: 0;
width: 100%;
display: flex;
flex-direction: row;
justify-content: start;
background-color: rgba(0, 0, 0, 0);
z-index: 110;
`


const InfoContainer = styled.div`
  background: ${({ theme }) => theme.lightBlack};
  border-radius: 8px;
  margin-bottom: 32px;
  z-index: 15;
  ::-webkit-scrollbar {
    display: none;
  }
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
`

const TitleContainer = styled.div`
z-index: 0; 
box-shadow: 0 2px 4px rgba(0,0,0,0.3);
// width: auto; 
margin: 16px 0 0 16px;
padding: 8px 16px;
border-radius: 12px;
background: ${({ theme }) => theme.midGreen};
background-color: ${({ theme }) => theme.midGreen};
align-items: flex-start;
`

const FloatingH5 = styled.h5`
  font-size: 16px;
  font-weight: regular;
  line-height: 1.25;

  @media only screen and (${devices.tablet}) {
    font-size: 18px;
  }
`

const ComparisonContainer = styled.div<{ $dataView: string }>`

  position: relative;
  overflow-y: scroll;
  z-index: 100;
  // TODO: Hardcoding this is not good.
  height: 400px;
  border-radius: 8px;
  display: flex;
  margin-top: ${({ $dataView }) => ($dataView === secondaryDataView ? '64px' : '0')};

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
  const { dataView } = router.query
  const { t } = useTranslation()
  const { dataDescriptions, isValidDataset } = getDataDescriptions(router.locale as string, t)

  const normalizedRouteDataset = normalizeString(routeDataset as string)
  const normalizedDataView = normalizeString(dataView as string)

  const [selectedDataset, setSelectedDataset] = useState<DatasetKey>(defaultDataset)
  const [selectedDataView, setSelectedDataView] = useState(normalizedDataView)

  useEffect(() => {
    if (normalizedRouteDataset && isValidDataset(normalizedRouteDataset)) {
      setSelectedDataset(normalizedRouteDataset)
    }

    if (normalizedDataView && isValidDataView(normalizedDataView)) {
      setSelectedDataView(selectedDataView)
    }
    // Disable exhaustive-deps so that it only runs on first mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDataChange = (newData: DatasetKey) => {
    setSelectedDataset(newData)
    const normalizedDataset = normalizeString(newData as string)
    router.push(`/${normalizedDataset}/${selectedDataView}`, undefined, {
      shallow: true,
      scroll: false,
    })
  }

  const municipalityNames = municipalities.map((item) => item.Name) // get all municipality names for drop down
  // get all municipality names and data points for map and list
  const municipalityDataOnDisplay = dataOnDisplay(municipalities, selectedDataset, router.locale as string, t)
  const datasetDescription = dataDescriptions[selectedDataset] // get description of selected dataset

  const handleToggle = () => {
    const newDataView = selectedDataView === defaultDataView ? secondaryDataView : defaultDataView
    setSelectedDataView(newDataView)
    router.replace(
      `/${normalizeString(selectedDataset as string)}/${newDataView}`,
      undefined,
      {
        shallow: true,
        scroll: false,
      },
    )
  }

  const cols = listColumns(selectedDataset, dataDescriptions[selectedDataset].columnHeader, t)
  const rankedData = rankData(municipalities, selectedDataset, router.locale as string, t)

  const isDefaultDataView = selectedDataView === defaultDataView

  return (
    <>
      <MetaTags
        title={t('startPage:meta.title')}
        description={t('startPage:meta.description')}
      />
      <PageWrapper backgroundColor="black">
        <Container>
          <H2Regular>{t('startPage:questionTitle')}</H2Regular>
          <RadioButtonMenu
            selectedData={selectedDataset}
            handleDataChange={handleDataChange}
            dataDescriptions={dataDescriptions}
          />
          <InfoContainer>
            <TitleRow>
              <TitleContainer>
                <FloatingH5>{datasetDescription.title}</FloatingH5>
                <MapLabels
                  labels={datasetDescription.labels}
                  rotations={datasetDescription.labelRotateUp}
                />
              </TitleContainer>
            </TitleRow>
            <ToggleButton
              handleClick={handleToggle}
              text={isDefaultDataView ? t('startPage:toggleView.list') : t('startPage:toggleView.map')}
              icon={isDefaultDataView ? <ListIcon /> : <MapIcon />}
            />

            <ComparisonContainer $dataView={selectedDataView.toString()}>
              {isDefaultDataView && (
                <>
                  <Map
                    data={municipalityDataOnDisplay}
                    boundaries={datasetDescription.boundaries}
                  />
                </>
              )}
              {selectedDataView === secondaryDataView && (
                <ComparisonTable data={rankedData[selectedDataset]} columns={cols} />
              )}
            </ComparisonContainer>
            <InfoText>
              <Markdown>{datasetDescription.body}</Markdown>
              <Markdown components={{ p: ParagraphSource }}>
                {datasetDescription.source}
              </Markdown>
            </InfoText>
          </InfoContainer>
          <DropDown
            municipalitiesName={municipalityNames}
            placeholder={t('startPage:yourMunicipality')}
          />
        </Container>
      </PageWrapper>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res, locale }) => {
  res.setHeader(
    'Cache-Control',
    `public, stale-while-revalidate=60, max-age=${60 * 60 * 24 * 7}`,
  )

  const normalizedDataset = normalizeString(defaultDataset)

  return {
    redirect: {
      destination: `/${normalizedDataset}/${defaultDataView}`,
      permanent: true,
    },
    props: {
      ...await serverSideTranslations(locale as string, ['common', 'startPage']),
    },
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
