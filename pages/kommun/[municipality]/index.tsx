import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { ParsedUrlQuery } from 'querystring'
import { defaultChart } from './[chart]'

export default function Index() {
  const router = useRouter()
  const municipality = router.query.municipality as string

  useEffect(() => {
    if (municipality) router.replace(`/kommun/${municipality}/${defaultChart}`)
  }, [municipality, router])

  return ''
}

interface Params extends ParsedUrlQuery {
  id: string
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = (params as Params).municipality as string

  return {
    redirect: {
      destination: `/kommun/${id}/framtida-prognos`,
      permanent: true,
    },
  }
}
