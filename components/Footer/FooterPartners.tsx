import styled from 'styled-components'
import { devices } from '../../utils/devices'

const PartnerContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  justify-items: center;
  align-items: center;
  width: 100%;
  margin-bottom: 48px;
  padding: 8px 16px;

  @media only screen and (${devices.tablet}) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    padding: 16px 32px;
  }
`

function Partners() {
  return (
    <PartnerContainer>
      <a href="https://www.climateview.global/" target="_blank" rel="noreferrer">
        <img
          src="/logos/partners/climateview.svg"
          width={90}
          height="auto"
          alt="ClimateView logo"
        />
      </a>
      <a href="https://researchersdesk.se/" target="_blank" rel="noreferrer">
        <img
          src="/logos/partners/researchersdesk-logo.svg"
          width="auto"
          height={60}
          alt="Researchers desk logo"
        />
      </a>
      <a href="https://www.klimatklubben.se/" target="_blank" rel="noreferrer">
        <img
          src="/logos/partners/klimatklubben.svg"
          width="auto"
          height={45}
          alt="Klimatklubben logo"
        />
      </a>
      <a href="https://exponentialroadmap.org/" target="_blank" rel="noreferrer">
        <img
          src="/logos/partners/exponential_roadmap.svg"
          width={105}
          height="auto"
          alt="Exponential Roadmap logo"
        />
      </a>
    </PartnerContainer>
  )
}

export default Partners
