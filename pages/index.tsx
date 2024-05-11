import { GetServerSideProps } from 'next'
import { ReactElement, useState } from 'react'
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
} from '../utils/datasetDefinitions'
import RegionalView from '../components/RegionalView'
import CompanyView from '../components/CompanyView'
import PillSwitch from '../components/PillSwitch'
import { defaultDataView } from './[dataGroup]/[dataset]/[dataView]'

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

const primaryDataGroup = 'foretag'
const secondaryDataGroup = 'geografiskt'

function StartPage({ companies, municipalities }: PropsType) {
  const router = useRouter()
  const { dataGroup, dataset: routeDataset, dataView } = router.query
  const { t } = useTranslation()
  const {
    dataDescriptions, getDataset, getDataView,
  } = getDataDescriptions(router.locale as string, t)

  const [selectedDataset, setSelectedDataset] = useState<DatasetKey>(getDataset(routeDataset as string))
  const [selectedDataView, setSelectedDataView] = useState(getDataView(dataView as string))

  const [showCompanyData, setShowCompanyData] = useState(dataGroup === primaryDataGroup)

  const handleToggle = () => {
    setShowCompanyData(!showCompanyData)
    setSelectedDataset(defaultDataset)
    setSelectedDataView(defaultDataView)

    const newDataGroup = dataGroup === primaryDataGroup ? secondaryDataGroup : primaryDataGroup
    const path = `/${newDataGroup}/${defaultDataset}/${defaultDataView}`

    router.push(path, undefined, { shallow: true })
  }

  return (
    <>
      <MetaTags
        title={t('startPage:meta.title')}
        description={t('startPage:meta.description')}
      />
      <PageWrapper backgroundColor="black" compact={showCompanyData}>
        <Container>
          <PillSwitch onToggle={handleToggle} isActive={!showCompanyData} />
          {showCompanyData
            ? (
              <CompanyView companies={companies} />
            )
            : (
              <RegionalView
                municipalities={municipalities}
                selectedDataset={selectedDataset}
                setSelectedDataset={setSelectedDataset}
                selectedDataView={selectedDataView}
                setSelectedDataView={setSelectedDataView}
                dataDescriptions={dataDescriptions}
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

  return {
    redirect: {
      destination: `/foretag/${defaultDataset}/${defaultDataView}`,
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
