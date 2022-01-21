import { useRouter } from 'next/router'
import Button from '../../components/Button'
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
      <p>Kommun: {municipality}</p>
      <H1>Kommun: {municipality}</H1>
      <Button handleClick={handleClick} text="Dela" shareIcon />
      <InfoBox />
    </div>
  )
}

export default Municipality
