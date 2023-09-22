/* eslint-disable react/jsx-props-no-spreading */
import { GetServerSideProps } from 'next'
import StartPage, { getServerSideProps as getIndexServerSideProps } from './index'
import { datasetDescriptions } from '../data/dataset_descriptions'
import Footer from '../components/Footer'
import Layout from '../components/Layout'
import { normalizeString } from '../utils/shared'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context
  const dataset = normalizeString(params?.dataset?.toString() as string)

  const validDatasets: string[] = Object.keys(datasetDescriptions).map(normalizeString)

  if (!validDatasets.includes(dataset)) {
    return {
      notFound: true,
    }
  }

  return getIndexServerSideProps(context)
}

function DatasetRoute(props: any) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return (
    <>
      <Layout>
        <StartPage {...props} />
      </Layout>
      <Footer />
    </>
  )
}

export default DatasetRoute
