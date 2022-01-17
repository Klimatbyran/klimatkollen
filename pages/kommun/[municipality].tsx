import { useRouter } from 'next/router'
import ShareButton from '../../components/ShareButton'

const Municipality = () => {
  const router = useRouter()
  const { municipality } = router.query

  const handleClick = () => {
    console.log('clicked')
  }

  return (
    <div>
      <p>Kommun: {municipality}</p>
      <ShareButton handleClick={handleClick} />
    </div>
  )
}

export default Municipality
