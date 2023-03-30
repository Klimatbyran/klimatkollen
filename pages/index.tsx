import { GetServerSideProps, NextPage } from 'next'
import StartPage from './StartPage'

interface IndexPageProps {
  viewMode: string;
  dataSource: string;
}

const IndexPage: NextPage<IndexPageProps> = ({ viewMode, dataSource }) => {
  return <StartPage viewMode={viewMode} dataSource={dataSource} />;
};

export const getServerSideProps: GetServerSideProps<IndexPageProps> = async (context) => {
  const { viewMode, dataSource } = context.query;

  return {
    props: {
      viewMode: viewMode || 'lista',
      dataSource: dataSource || 'Elbilar',
      url: '/',
    },
  };
};

export default IndexPage