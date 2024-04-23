import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'

import { defaultDataView, getDataDescriptions } from '../../utils/datasetDefinitions'
import { normalizeString } from '../../utils/shared'
import { getServerSideI18n } from '../../utils/getServerSideI18n'

interface Params extends ParsedUrlQuery {
  id: string
}

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
  const dataset = (params as Params).dataset as string
  const normalizedDataset = normalizeString(dataset)
  const { t } = await getServerSideI18n(locale as string, ['common'])
  const { isValidDataset } = getDataDescriptions(locale as string, t)

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
  }
}

export default function Index() {
  return ''
}
