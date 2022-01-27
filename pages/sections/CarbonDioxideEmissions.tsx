import { H5 } from '../../components/Typography'
import ShareIcon from '../../components/ShareIcon'
import styled from 'styled-components'
import { InView } from 'react-intersection-observer'
import { useRouter } from 'next/router'

const SectionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  height: 600px;
`

const StyledShareButton = styled.button`
  background: transparent;
  border: 0px;
  margin-top: 5px;
`

const CarbonDioxideEmissions = () => {
  const handleClick = () => {
    // Function to handle click on share icon
    // alert('click on share icon')
  }



  const router = useRouter()
  const { municipality } = router.query

  const handleOnChange = () => {
    console.log('KOLDIOXIDUTSLÄPP is in viewport')
    window.history.replaceState(null, '', `/kommun/${municipality}/koldioxidutslapp`); 
  }

  return (
    <InView as="div" threshold={1} rootMargin="-25px 0px" onChange={() => handleOnChange()}>
      <SectionWrapper id="koldioxidutslapp">
        <H5>Koldioxidutsläpp</H5>
        <StyledShareButton>
          <ShareIcon handleClick={handleClick} />
        </StyledShareButton>
      </SectionWrapper>
    </InView>
  )
}

export default CarbonDioxideEmissions
