import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { ParsedUrlQuery } from 'querystring'
import { CHARTS } from './[step]'

const municipalityRoute = (name: string) => `/kommun/${encodeURIComponent(name)}/${CHARTS[1]}`

export default function Index() {
  const router = useRouter()
  const municipality = router.query.municipality as string

  useEffect(() => {
    if (municipality) {
      const decodedName = decodeURIComponent(municipality)
      router.replace(municipalityRoute(decodedName))
    }
  }, [municipality, router])

  return null
}

interface Params extends ParsedUrlQuery {
  id: string
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = (params as Params).municipality as string

  const decodedId = decodeURIComponent(id)

  return {
    redirect: {
      destination: municipalityRoute(decodedId),
      permanent: true,
    },
  }
}
