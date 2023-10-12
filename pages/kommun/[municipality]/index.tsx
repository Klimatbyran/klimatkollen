import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { defaultChart } from '../../../data/chart_descriptions'

export default function Index() {
  return ''
}

interface Params extends ParsedUrlQuery {
  id: string
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = (params as Params).municipality as string

  return {
    redirect: {
      destination: `/kommun/${id}/${defaultChart}`,
      permanent: true,
    },
  }
}
