import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import { ClimateDataService } from '../utils/climateDataService';
import IndexPage from './index';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const municipalities = new ClimateDataService().getMunicipalities()
  if (municipalities.length < 1) throw new Error('No municipalities found')
  const viewMode = 'lista'

  res.setHeader(
    'Cache-Control',
    'public, stale-while-revalidate=60, max-age=' + 60 * 60 * 24 * 7,
  )

  return {
    props: { municipalities, viewMode },
  }
}

export default IndexPage

IndexPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
      <Footer />
    </>
  )
}