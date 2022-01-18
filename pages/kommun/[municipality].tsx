import { useRouter } from 'next/router'
import ShareButton from '../../components/ShareButton'
import Back from '../../components/Back'

const Municipality = () => {
  const router = useRouter()
  const { municipality } = router.query

  const handleClick = () => {
    // Function to handle click on share button
  }

  return (
    <div>
      <Back />
      <p>Kommun: {municipality}</p>
      <ShareButton handleClick={handleClick} />
    </div>
  )
}

export default Municipality
