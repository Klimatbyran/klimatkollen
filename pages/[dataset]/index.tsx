import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { defaultDataView } from '../../utils/datasetDefinitions'
import { isValidDataset, normalizeString } from '../../utils/shared'

interface Params extends ParsedUrlQuery {
  id: string
}

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
  const dataset = (params as Params).dataset as string
  const normalizedDataset = normalizeString(dataset)

  if (!isValidDataset(normalizedDataset)) {
    return {
      notFound: true, // Return a 404 page when the dataset is not valid
    }
  }

  return {
    redirect: {
      destination: `/${normalizedDataset}/${defaultDataView}`,
      permanent: true,
      shallow: true,
    },
    props: {
      ...await serverSideTranslations(locale as string, 'common'),
    },
  }
}

export default function Index() {
  return ''
}
