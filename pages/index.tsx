import { GetServerSideProps } from 'next'
import { ReactElement, useState } from 'react'
import styled from 'styled-components'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Link from 'next/link'

import Icon from '../public/icons/boxedArrow.svg'
import MetaTags from '../components/MetaTags'
import { Company, Municipality, DatasetKey } from '../utils/types'
import PageWrapper from '../components/PageWrapper'
import Layout from '../components/Layout'
import Footer from '../components/Footer/Footer'
import { defaultDataset, getDataDescriptions } from '../utils/datasetDefinitions'
import RegionalView from '../components/RegionalView'
import CompanyView from '../components/CompanyView'
import PillSwitch from '../components/PillSwitch'
import { DataView } from './[dataGroup]/[dataset]/[dataView]'
import { ONE_WEEK_MS, normalizeString } from '../utils/shared'
import Markdown from '../components/Markdown'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`

const NoticeContent = styled(Markdown)`
  p {
    margin: 0;
    line-height: 1 !important;
  }
`

const CompanyReportNotice = styled(Link)`
  background: ${({ theme }) => theme.newColors.orange2};
  color: ${({ theme }) => theme.newColors.black3};
  padding: 0.5rem 0.75rem;
  border-radius: 1rem;
  text-decoration: none !important;
  display: flex;
  align-items: center;

  margin-bottom: 2rem;
`

const ArrowIcon = styled(Icon)`
  width: 32px;
  height: 32px;
  position: absolute;
  z-index: 1;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  fill: ${({ theme }) => theme.newColors.black3};
`

const Square = styled.div`
  width: 24px;
  height: 24px;
  margin-top: 1px;
  position: relative;
  display: grid;
  place-items: center;
  border-radius: 4px;
`

export const defaultDataGroup = 'foretag'
export const secondaryDataGroup = 'geografiskt'
const dataGroups = new Set([defaultDataGroup, secondaryDataGroup])
export type DataGroup = typeof defaultDataGroup | typeof secondaryDataGroup

type PropsType = {
  companies: Array<Company>
  municipalities: Array<Municipality>
  initialDataGroup: DataGroup
}

export function getDataGroup(rawDataGroup: string): DataGroup {
  const normalized = normalizeString(rawDataGroup)
  if (dataGroups.has(normalized)) {
    return normalized as DataGroup
  }

  return defaultDataGroup
}

function StartPage({ companies, municipalities, initialDataGroup }: PropsType) {
  const router = useRouter()
  const { dataGroup, dataset: routeDataset, dataView } = router.query
  const { t } = useTranslation()
  const { dataDescriptions, getDataset, getDataView } = getDataDescriptions(
    router.locale as string,
    t,
  )

  const normalizedDataGroup = getDataGroup(dataGroup as string)

  const [selectedDataset, setSelectedDataset] = useState<DatasetKey>(
    getDataset(routeDataset as string),
  )
  const [selectedDataView, setSelectedDataView] = useState<DataView>(
    // NOTE: Very important to set initial state based on initialDataGroup rather than normalizedDataGroup to avoid nasty bugs
    initialDataGroup === 'foretag' ? 'karta' : getDataView(dataView as string),
  )

  return (
    <>
      <MetaTags
        title={t('startPage:meta.title')}
        description={t('startPage:meta.description')}
      />
      <PageWrapper compact>
        <Container>
          <CompanyReportNotice href="/bolagsklimatkollen" target="_blank">
            <NoticeContent>
              **Läs vår rapport:** Bolagsklimatkollen - En analys av 150 svenska storbolags
              klimatredovisning 2023
            </NoticeContent>
            <Square>
              <ArrowIcon />
            </Square>
          </CompanyReportNotice>

          <PillSwitch
            selectedDataGroup={normalizedDataGroup}
            links={[
              { text: t('common:companies'), href: '/foretag/utslappen/lista' },
              {
                text: t('common:municipalities'),
                href: `/geografiskt/${selectedDataset}/karta`,
                onClick: () => setSelectedDataView('karta'),
              },
            ]}
          />
          {normalizedDataGroup === 'foretag' ? (
            <CompanyView companies={companies} />
          ) : (
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
      destination: `/foretag/${defaultDataset}/lista`,
      permanent: true,
    },
    props: {
      ...(await serverSideTranslations(locale as string, ['common', 'startPage'])),
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
