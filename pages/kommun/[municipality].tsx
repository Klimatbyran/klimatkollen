import { useRouter } from 'next/router'
import ShareButton from '../../components/ShareButton'
import InfoBox from '../../components/InfoBox'
import { H1 } from '../../components/Typography'
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
      <H1>Kommun: {municipality}</H1>
      <ShareButton handleClick={handleClick} />
      <InfoBox />
    </div>
  )
}

export default Municipality
