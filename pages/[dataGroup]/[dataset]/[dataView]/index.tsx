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

export const defaultDataView = 'lista'
export const secondaryDataView = 'karta'
export const isValidDataView = (dataView: string) => [defaultDataView, secondaryDataView].includes(dataView)

interface Params extends ParsedUrlQuery {
  dataGroup: string
  dataset: string
  dataView: string
}

const cache = new Map()

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

  const cacheKey = `${normalizedDataGroup}/${normalizedDataset}`

  if (cache.get(cacheKey)) {
    return cache.get(cacheKey)
  }

  const municipalities = new ClimateDataService().getMunicipalities()
  const companies = new CompanyDataService().getCompanies()

  res.setHeader(
    'Cache-Control',
    `public, stale-while-revalidate=60, max-age=${60 * 60 * 24 * 7}`,
  )

  const result = {
    props: {
      companies,
      municipalities,
      normalizedDataset,
      _nextI18Next,
    },
  }

  cache.set(cacheKey, result)
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