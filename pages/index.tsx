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
import { ONE_WEEK_MS, normalizeString } from '../utils/shared'

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

export const defaultDataGroup = 'foretag'
export const secondaryDataGroup = 'geografiskt'
const dataGroups = new Set([defaultDataGroup, secondaryDataGroup])
export type DataGroup = typeof defaultDataGroup | typeof secondaryDataGroup

export function getDataGroup(rawDataGroup: string): DataGroup {
  const normalized = normalizeString(rawDataGroup)
  if (dataGroups.has(normalized)) {
    return normalized as DataGroup
  }

  return defaultDataGroup
}

function StartPage({ companies, municipalities }: PropsType) {
  const router = useRouter()
  const { dataGroup, dataset: routeDataset, dataView } = router.query
  const { t } = useTranslation()
  const {
    dataDescriptions, getDataset, getDataView,
  } = getDataDescriptions(router.locale as string, t)

  const normalizedDataGroup = getDataGroup(dataGroup as string)

  const [selectedDataset, setSelectedDataset] = useState<DatasetKey>(getDataset(routeDataset as string))
  const [selectedDataView, setSelectedDataView] = useState(getDataView(dataView as string))

  const showCompanyData = normalizedDataGroup === defaultDataGroup

  return (
    <>
      <MetaTags
        title={t('startPage:meta.title')}
        description={t('startPage:meta.description')}
      />
      <PageWrapper compact>
        <Container>
          <PillSwitch
            selectedDataGroup={normalizedDataGroup}
            links={[
              { text: t('common:companies'), href: '/foretag/utslappen/lista' },
              { text: t('common:municipalities'), href: `/geografiskt/${selectedDataset}/${selectedDataView}` },
            ]}
          />
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
    `public, stale-while-revalidate=60, max-age=${ONE_WEEK_MS}`,
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
