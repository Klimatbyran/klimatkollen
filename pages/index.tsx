import { GetServerSideProps } from 'next'

export default function Index() {
  return <></>
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: `/kommuner`,
      permanent: true,
    },
  }
}
