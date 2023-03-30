import { GetServerSideProps, NextPage } from 'next'
import { ClimateDataService } from '../utils/climateDataService';
import StartPage from './StartPage'

interface MapPageProps {
  viewMode: string;
  dataSource: string;
}

const MapPage: NextPage<MapPageProps> = ({ viewMode, dataSource }) => {
  return <StartPage municipalities={} viewMode={viewMode} dataSource={dataSource} />
};

export const getServerSideProps: GetServerSideProps<MapPageProps> = async (context, { res }) => {
  const municipalities = new ClimateDataService().getMunicipalities()
  if (municipalities.length < 1) throw new Error('No municipalities found')
  const { viewMode, dataSource } = context.query

  res.setHeader(
    'Cache-Control',
    'public, stale-while-revalidate=60, max-age=' + 60 * 60 * 24 * 7,
  )

  return {
    props: {
      municipalities,
      viewMode: viewMode || 'karta',
      dataSource: dataSource || 'Elbilar',
      url: '/',
    },
  }
}

export default MapPage