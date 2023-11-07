import styled from 'styled-components'
import { devices } from '../../utils/devices'

const PartnerContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  margin-bottom: 48px;
  padding: 8px 16px;

  @media only screen and (${devices.tablet}) {
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
      <a href="https://www.wwf.se/" target="_blank" rel="noreferrer">
        <img
          src="/logos/partners/WWF_Logo_Small_RGB_72dpi.jpg"
          width={45}
          height="auto"
          alt="WWF logo"
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
