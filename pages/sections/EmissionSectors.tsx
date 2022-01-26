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

const EmissionSectors = () => {
  const handleClick = (href: string) => {
    // Function to handle click on share icon
    // alert('click on share icon')
    // get municipality from jotai
    navigator.clipboard.writeText(`www.klimatkollen.se/kommun/goteborg/${href}`)
  }

  const handleOnChange = () => {
    console.log('TRE STÖRSTA UTSLÄPPSEKTORER is in viewport')
  }

  return (
    <InView as="div" threshold={1} onChange={() => handleOnChange()}>
      <SectionWrapper id="emission-sectors">
        <H5>Tre största utsläppsektorerna</H5>
        <ShareIcon handleClick={() => handleClick('utslappssektorer')} />
      </SectionWrapper>
    </InView>
  )
}

export default EmissionSectors
