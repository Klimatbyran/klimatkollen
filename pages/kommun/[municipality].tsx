// import styled from 'styled-components'
import { useRouter } from 'next/router'
import Button from '../../components/Button'
// import { H1 } from '../../components/Typography'
// import Back from '../../components/Back'
import CarbonDioxideEmissions from '../kommun/sections/CarbonDioxideEmissions'
import EmissionSectors from '../kommun/sections/EmissionSectors'
import Affect from '../kommun/sections/Affect'
import { InView } from 'react-intersection-observer'
import MunicipalityInfo from './sections/MunicipalityInfo'

const Municipality = () => {
  const router = useRouter()
  const { municipality } = router.query

  const handleClick = () => {
    // Function to handle click on share button
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
