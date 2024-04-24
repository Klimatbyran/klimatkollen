import { GetServerSideProps } from 'next'
import { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

import MetaTags from '../components/MetaTags'
import { Company, Municipality, DatasetKey } from '../utils/types'
import PageWrapper from '../components/PageWrapper'
import Layout from '../components/Layout'
import Footer from '../components/Footer/Footer'
import {
  defaultDataset,
  getDataDescriptions,
  defaultDataView,
} from '../utils/datasetDefinitions'
import {
  isValidDataView,
  normalizeString,
} from '../utils/shared'
import RegionalView from '../components/RegionalView'
import CompanyView from '../components/CompanyView'
import PillSwitch from '../components/PillSwitch'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`

type PropsType = {
  companies: Array<Company>
  municipalities: Array<Municipality>
}

function StartPage({ companies, municipalities }: PropsType) {
  const router = useRouter()
  const routeDataset = router.query.dataset
  const { dataView } = router.query
  const { t } = useTranslation()
  const { dataDescriptions, isValidDataset } = getDataDescriptions(router.locale as string, t)

  const normalizedRouteDataset = normalizeString(routeDataset as string)
  const normalizedDataView = normalizeString(dataView as string)

  const [selectedDataset, setSelectedDataset] = useState<DatasetKey>(defaultDataset)
  const [selectedDataView, setSelectedDataView] = useState(normalizedDataView)

  const [showRegionalEmissionData, setShowRegionalEmissionData] = useState(true)

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

  return (
    <>
      <MetaTags
        title={t('startPage:meta.title')}
        description={t('startPage:meta.description')}
      />
      <PageWrapper backgroundColor="black">
        <Container>
          <PillSwitch onToggle={setShowRegionalEmissionData} />
          {showRegionalEmissionData
            ? (
              <RegionalView
                municipalities={municipalities}
                selectedDataset={selectedDataset}
                setSelectedDataset={setSelectedDataset}
                selectedDataView={selectedDataView}
                setSelectedDataView={setSelectedDataView}
                dataDescriptions={dataDescriptions}
              />
            )
            : (
              <CompanyView
                companies={companies}
              />
            )}
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
