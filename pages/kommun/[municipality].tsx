import { useRouter } from 'next/router'
import BackArrow from '../../components/BackArrow'
import Link from 'next/link'

const Municipality = () => {
  const router = useRouter()
  const { municipality } = router.query

  return (
    <>
      <p>Kommun: {municipality}</p>
      <Link href="/">
        <a>
          <BackArrow />
        </a>
      </Link>
    </>
  )
}

export default Municipality
