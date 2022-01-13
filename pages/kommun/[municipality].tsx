import { useRouter } from 'next/router'
import InfoBox from '../../components/InfoBox';


const Municipality = () => {
  const router = useRouter()
  const { municipality } = router.query

  return (
    <>
    <h1>{municipality}</h1>
    <InfoBox />
    </>
  )
}

export default Municipality
