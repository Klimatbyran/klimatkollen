import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { ParsedUrlQuery } from 'querystring'
import { defaultViewMode } from '../../data/dataset_descriptions'

export const VIEWMODES = ['kartap', 'lista']

// fixme förstå och skriv om
export default function Index() {
  const router = useRouter()
  const dataset = router.query.dataset as string

  useEffect(() => {
    if (dataset) router.replace(`/${dataset}/${VIEWMODES[0]}`)
  }, [dataset, router])

  return ''
}

interface Params extends ParsedUrlQuery {
  id: string
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const dataset = (params as Params).dataset as string

  return {
    redirect: {
      destination: `/${dataset}/${defaultViewMode}`,
      permanent: true,
      shallow: true,
    },
  }
}

