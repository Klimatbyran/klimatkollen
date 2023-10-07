import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { Municipality as TMunicipality } from '../../../utils/types'
import StartPage from '../..'
import { ClimateDataService } from '../../../utils/climateDataService'
import Layout from '../../../components/Layout'
import Footer from '../../../components/Footer/Footer'

type Props = {
  municipalities: Array<TMunicipality>
}

export default function ViewMode({ municipalities }: Props) {
  return (
    <>
      <Layout>
        <StartPage municipalities={municipalities} />
      </Layout>
      <Footer />
    </>
  )
}

interface Params extends ParsedUrlQuery {
  dataset: string
}

const cache = new Map()

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  const municipalities = new ClimateDataService().getMunicipalities()
  if (municipalities.length < 1) throw new Error('No municipalities found')

  res.setHeader(
    'Cache-Control',
    `public, stale-while-revalidate=60, max-age=${60 * 60 * 24 * 7}`,
  )

  const dataset = (params as Params).dataset as string
  if (cache.get(dataset)) return cache.get(dataset)

  const result = {
    props: {
      municipalities,
      dataset,
    },
  }

  cache.set(dataset, result)
  return result
}

