import { H5 } from '../../components/Typography'
import ShareIcon from '../../components/ShareIcon'
import styled from 'styled-components'
import { InView } from 'react-intersection-observer'

const SectionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  height: 600px;
`

const Affect = () => {
  const handleClick = () => {
    // Function to handle click on share icon
    alert('click on share icon')
  }

  const handleOnChange = () => {
    console.log('HUR KAN JAG PÅVERKA is in viewport')
  }

  return (
    <InView as="div" threshold={1} onChange={() => handleOnChange()}>
      <SectionWrapper id="affect">
        <H5>Hur kan jag påverka?</H5>
        <ShareIcon handleClick={handleClick} />
      </SectionWrapper>
    </InView>
  )
}

export default Affect
