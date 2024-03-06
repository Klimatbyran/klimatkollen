import { GetServerSideProps } from 'next'
import { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import MetaTags from '../components/MetaTags'
import { Company, Municipality, SelectedData } from '../utils/types'
import PageWrapper from '../components/PageWrapper'
import Layout from '../components/Layout'
import Footer from '../components/Footer/Footer'
import {
  defaultDataset,
  defaultDataView,
} from '../utils/datasetDescriptions'
import {
  isValidDataView,
  isValidDataset,
  normalizeString,
  validDatasetsMap,
} from '../utils/shared'
import PillSwitch from '../components/PillSwitch'
import RegionalView from '../components/RegionalView'
import CompanyView from '../components/CompanyView'

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

  const normalizedRouteDataset = normalizeString(routeDataset as string)
  const normalizedDataView = normalizeString(dataView as string)

  const [selectedDataset, setSelectedDataset] = useState<SelectedData>(defaultDataset)
  const [selectedDataView, setSelectedDataView] = useState(normalizedDataView)

  const [showRegionalEmissionData, setShowRegionalEmissionData] = useState(true)

  useEffect(() => {
    if (normalizedRouteDataset && isValidDataset(normalizedRouteDataset)) {
      setSelectedDataset(validDatasetsMap[normalizedRouteDataset])
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
        title="Klimatkollen — Få koll på Sveriges klimatomställning"
        description="Hur går det med utsläppen i Sverige och i din kommun? Minskar eller ökar klimatutsläppen? Klarar vi Parisavtalet?"
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
                router={router}
              />
            )
            : (
              <CompanyView
                companies={companies}
                selectedDataView={selectedDataView}
                setSelectedDataView={setSelectedDataView}
              />
            )}
        </Container>
      </PageWrapper>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
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
