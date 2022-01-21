import { useRouter } from 'next/router'
import Button from '../../components/Button'
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
      <Button handleClick={handleClick} text="Dela" shareIcon />
    </div>
  )
}

export default Municipality
