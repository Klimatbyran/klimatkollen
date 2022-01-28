import { H1, Paragraph } from '../../../components/Typography'
import ShareIcon from '../../../components/ShareIcon'
import styled from 'styled-components'
import { InView } from 'react-intersection-observer'
import { useRouter } from 'next/router'
import InfoBox from '../../../components/InfoBox'
import Back from '../../../components/Back'

const SectionWrapper = styled.div`
  margin-bottom: 4rem;
`

const StyledShareButton = styled.button`
  background: transparent;
  border: 0px;
  margin-top: 5px;
`

const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 0;
`

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
`

const MunicipalityInfo = () => {
  const handleClick = () => {
    // Function to handle click on share icon
    // alert('click on share icon')
  }

  const router = useRouter()
  const { municipality } = router.query

  const handleOnChange = () => {
    window.history.replaceState(null, '', `/kommun/${municipality}`)
  }

  return (
    <InView as="div" threshold={1} onChange={() => handleOnChange()}>
      <SectionWrapper id="kommuninfo">
        <SectionHeader>
          <Back />
          <StyledShareButton>
            <ShareIcon handleClick={handleClick} />
          </StyledShareButton>
        </SectionHeader>
        <H1>{municipality}</H1>
        <SectionContent>
          <Paragraph>
            {municipality} har X kommuner med bättre förutsättningar att nå Parisavtalet.
          </Paragraph>
        </SectionContent>
        <InfoBox />
      </SectionWrapper>
    </InView>
  )
}

export default MunicipalityInfo
