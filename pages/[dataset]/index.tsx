import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { defaultDataView } from '../../data/dataset_descriptions'
import { isValidDataset } from '../../utils/shared'

interface Params extends ParsedUrlQuery {
  id: string
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const dataset = (params as Params).dataset as string

  if (!isValidDataset(dataset)) {
    return {
      notFound: true, // Return a 404 page when the dataset is not valid
    }
  }

  return {
    redirect: {
      destination: `/${dataset}/${defaultDataView}`,
      permanent: true,
      shallow: true,
    },
  }
}

export default function Index() {
  return ''
}
