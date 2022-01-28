import { useRouter } from 'next/router'
import Button from '../../components/Button'
import CarbonDioxideEmissions from '../kommun/sections/CarbonDioxideEmissions'
import EmissionSectors from '../kommun/sections/EmissionSectors'
import Affect from '../kommun/sections/Affect'
import { InView } from 'react-intersection-observer'
import MunicipalityInfo from './sections/MunicipalityInfo'

const Municipality = () => {
  const router = useRouter()
  const { municipality } = router.query

  const handleClick = () => {
    alert('clicked the share button')
  }

  const handleOnChange = () => {
    window.history.replaceState(null, '', `/kommun/${municipality}`)
  }

  return (
    <InView as="div" onChange={() => handleOnChange()}>
      <MunicipalityInfo />
      <CarbonDioxideEmissions />
      <EmissionSectors />
      <Affect />
      <Button handleClick={handleClick} text="Dela" shareIcon />
    </InView>
  )
}

export default Municipality
