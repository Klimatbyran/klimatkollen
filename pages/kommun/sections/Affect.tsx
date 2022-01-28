import { H5 } from '../../../components/Typography'
import ShareIcon from '../../../components/ShareIcon'
import styled from 'styled-components'
import { InView } from 'react-intersection-observer'
import { useRouter } from 'next/router'

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

  const router = useRouter()
  const { municipality } = router.query

  const handleOnChange = () => {
    window.history.replaceState(null, '', `/kommun/${municipality}/hur-kan-jag-paverka`)
  }

  return (
    <InView as="div" threshold={0.8} onChange={() => handleOnChange()}>
      <SectionWrapper id="hur-kan-jag-paverka">
        <H5>Hur kan jag påverka?</H5>
        <ShareIcon handleClick={handleClick} />
      </SectionWrapper>
    </InView>
  )
}

export default Affect
