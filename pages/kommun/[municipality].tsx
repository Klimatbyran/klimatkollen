// import styled from 'styled-components'
import { useRouter } from 'next/router'
import Button from '../../components/Button'
import InfoBox from '../../components/InfoBox'
import { H1 } from '../../components/Typography'
import Back from '../../components/Back'
import CarbonDioxideEmissions from '../sections/CarbonDioxideEmissions'
import EmissionSectors from '../sections/EmissionSectors'
import Affect from '../sections/Affect'

const Municipality = () => {
  const router = useRouter()
  const { municipality } = router.query

  window.history.replaceState(null, '', `/kommun/${municipality}`); 

  const handleClick = () => {
    // Function to handle click on share button
    alert('clicked the share button')
  }

  return (
    <>
      <Back />
      <H1>{municipality}</H1>
      <Button handleClick={handleClick} text="Dela" shareIcon />
      <InfoBox />
      <CarbonDioxideEmissions />
      <EmissionSectors />
      <Affect />
    </>
  )
}

export default Municipality
