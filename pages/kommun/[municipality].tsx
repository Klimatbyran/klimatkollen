import { useRouter } from 'next/router'

const Municipality = () => {
  const router = useRouter()
  const { municipality } = router.query

  return <p>Kommun: {municipality}</p>
}

export default Municipality
