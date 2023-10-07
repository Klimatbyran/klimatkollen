import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { defaultViewMode } from '../../data/dataset_descriptions'
import { isValidDataset } from '../../utils/shared'

interface Params extends ParsedUrlQuery {
  id: string
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const dataset = (params as Params).dataset as string

  if (isValidDataset(dataset)) {
    return {
      redirect: {
        destination: `/${dataset}/${defaultViewMode}`,
        permanent: true,
        shallow: true,
      }
    }
  } else {
    return {
      notFound: true, // Return a 404 page when the dataset is not valid
    }
  }
}

export default function Index() {
  return ''
}
