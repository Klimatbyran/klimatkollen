import { H5 } from '../components/Typography'
import ShareIcon from '../components/ShareIcon'
import styled from 'styled-components'

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

  return (
    <SectionWrapper id="emission-sectors">
      <H5>Tre största utsläppsektorerna</H5>
      <ShareIcon handleClick={()=>handleClick('utslappssektorer')} />
    </SectionWrapper>
  )
}

export default EmissionSectors
