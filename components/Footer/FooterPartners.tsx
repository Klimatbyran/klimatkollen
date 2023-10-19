import styled from 'styled-components'
import { devices } from '../../utils/devices'

const PartnerContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  grid-gap: 16px;
  justify-items: center;
  align-items: center;
  width: 100%;
  padding: 8px 16px;
  margin-bottom: 48px;

  @media only screen and (${devices.tablet}) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 16px 32px;
  }
`

function Partners() {
  return (
    <PartnerContainer>
      <a href="https://postkodstiftelsen.se/" target="_blank" rel="noreferrer">
        <img
          src="/icons/postkodstiftelsen.svg"
          width={90}
          height="auto"
          alt="Postkodstiftelsen logo"
        />
      </a>
      <a href="https://www.climateview.global/" target="_blank" rel="noreferrer">
        <img
          src="/icons/climateview.svg"
          width={90}
          height="auto"
          alt="ClimateView logo"
        />
      </a>
      <a href="https://www.wwf.se/" target="_blank" rel="noreferrer">
        <img
          src="/partners/WWF_Logo_Small_RGB_72dpi.jpg"
          width={45}
          height="auto"
          alt="WWF logo"
        />
      </a>
      <a href="https://researchersdesk.se/" target="_blank" rel="noreferrer">
        <img
          src="/partners/researchersdesk-logo2.svg"
          width="auto"
          height={60}
          alt="Researchers desk logo"
        />
      </a>
      <a href="https://www.klimatklubben.se/" target="_blank" rel="noreferrer">
        <img
          src="/icons/klimatklubben.svg"
          width="auto"
          height={45}
          alt="Klimatklubben logo"
        />
      </a>
    </PartnerContainer>
  )
}

export default Partners
