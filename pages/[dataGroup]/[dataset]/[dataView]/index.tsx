import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { Company as TCompany, Municipality as TMunicipality } from '../../../../utils/types'
import StartPage, { getDataGroup } from '../../..'
import { ClimateDataService } from '../../../../utils/climateDataService'
import Layout from '../../../../components/Layout'
import Footer from '../../../../components/Footer/Footer'
import { CompanyDataService } from '../../../../utils/companyDataService'
import { getDataDescriptions } from '../../../../utils/datasetDefinitions'
import { getServerSideI18n } from '../../../../utils/getServerSideI18n'
import { ONE_WEEK_MS } from '../../../../utils/shared'

export const defaultDataView = 'lista'
export const secondaryDataView = 'karta'
export const isValidDataView = (dataView: string) => [defaultDataView, secondaryDataView].includes(dataView)

interface Params extends ParsedUrlQuery {
  dataGroup: string
  dataset: string
  dataView: string
}

const cache = new Map()

function getCompanies() {
  const cached = cache.get('companies')
  if (cached) return cached

  const companies = new CompanyDataService().getCompanies()
  cache.set('companies', companies)
  return companies
}

function getMunicipalities() {
  const cached = cache.get('municipalities')
  if (cached) return cached

  const municipalities = new ClimateDataService().getMunicipalities()
  cache.set('municipalities', municipalities)
  return municipalities
}

export const getServerSideProps: GetServerSideProps = async ({
  params, res, locale,
}) => {
  const { dataGroup, dataset, dataView } = params as Params
  const { t, _nextI18Next } = await getServerSideI18n(locale as string, ['common', 'startPage'])
  const { getDataset, getDataView } = getDataDescriptions(locale as string, t)

  const normalizedDataGroup = getDataGroup(dataGroup)
  const normalizedDataset = getDataset(dataset)
  const normalizedDataView = getDataView(dataView)

  if (dataset !== normalizedDataset || dataView !== normalizedDataView) {
    return {
      redirect: {
        destination: `/${normalizedDataGroup}/${normalizedDataset}/${normalizedDataView}`,
        permanent: true,
      }, // Redirect to the lower case non-åäö url
    }
  }

  res.setHeader(
    'Cache-Control',
    `public, stale-while-revalidate=60, max-age=${ONE_WEEK_MS}`,
  )

  const result = {
    props: {
      companies: getCompanies(),
      municipalities: getMunicipalities(),
      normalizedDataset,
      _nextI18Next,
    },
  }

  return result
}

type Props = {
  companies: Array<TCompany>
  municipalities: Array<TMunicipality>
}

export default function DataView({ companies, municipalities }: Props) {
  return (
    <>
      <Layout>
        <StartPage companies={companies} municipalities={municipalities} />
      </Layout>
      <Footer />
    </>
  )
}
