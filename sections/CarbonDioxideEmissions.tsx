import { H5 } from '../components/Typography'
import ShareIcon from '../components/ShareIcon'
import styled from 'styled-components'

const SectionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  height: 600px;
`

const StyledShareButton = styled.button`
background: transparent;
border: 0px;
margin-top: 5px`


const CarbonDioxideEmissions = () => {

  const handleClick = () => {
    // Function to handle click on share icon
    // alert('click on share icon')
  }
  
  return (
    <SectionWrapper id="carbon-dioxide-emissions">
      <H5>Koldioxidutsläpp</H5>
        <StyledShareButton><ShareIcon handleClick={handleClick} /></StyledShareButton>
    </SectionWrapper>
  )
}

export default CarbonDioxideEmissions
