import { GetServerSideProps } from 'next'
import MetaTags from '../components/MetaTags'

export default function Index() {
  return (
    <>
      <MetaTags
        title="Klimatkollen — Få koll på Sveriges klimatomställning"
        description="Hur går det med utsläppsminskningarna i Sverige och i din kommun? Minskar eller ökar klimatutsläppen? Klarar vi Parisavtalet?"
      />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: `/kommuner`,
      permanent: true,
    },
  }
}
