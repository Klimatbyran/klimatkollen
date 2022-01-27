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

const EmissionSectors = () => {
  const handleClick = (href: string) => {
    // Function to handle click on share icon
    // alert('click on share icon')
    // get municipality from jotai
    navigator.clipboard.writeText(`www.klimatkollen.se/kommun/goteborg/${href}`)
  }

  const router = useRouter()
  const { municipality } = router.query

  const handleOnChange = () => {
    console.log('TRE STÖRSTA UTSLÄPPSEKTORER is in viewport')

    if (typeof window !== "undefined") {
      window.history.pushState(null, '', `/kommun/${municipality}/tre-storsta-utslappssektorerna`); 

    }

  }

  return (
    <InView as="div" threshold={1} onChange={() => handleOnChange()}>
      <SectionWrapper id="tre-storsta-utslappssektorerna">
        <H5>Tre största utsläppsektorerna</H5>
        <ShareIcon handleClick={() => handleClick('utslappssektorer')} />
      </SectionWrapper>
    </InView>
  )
}

export default EmissionSectors
