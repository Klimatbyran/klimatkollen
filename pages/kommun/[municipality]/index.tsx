import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Index() {
  const router = useRouter()
  const municipality = router.query.municipality as string

  useEffect(() => {
    if (municipality) router.replace(`/kommun/${municipality}/historiska-utslapp`)
  }, [municipality, router])

  return <></>
}
