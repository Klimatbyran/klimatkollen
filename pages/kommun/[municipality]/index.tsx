import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { STEPS } from './[step]'

export default function Index() {
  const router = useRouter()
  const municipality = router.query.municipality as string

  useEffect(() => {
    if (municipality) router.replace(`/kommun/${municipality}/${STEPS[0]}`)
  }, [municipality, router])

  return <></>
}
