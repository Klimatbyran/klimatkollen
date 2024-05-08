import styled from 'styled-components'
import { devices } from '../../utils/devices'

const SupporterContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  justify-items: center;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  margin-bottom: 48px;
  padding: 8px 16px;

  img {
    margin: 16px 24px;
  }

  @media only screen and (${devices.tablet}) {
    padding: 16px 32px;

    img {
      margin: 0 40px;
    }
  }
`

function Supporters() {
  return (
    <SupporterContainer>
      <a href="https://www.google.org/" target="_blank" rel="noreferrer">
        <img
          src="/logos/supporters/google_org_white.svg"
          height={45}
          alt="Google.org logo"
        />
      </a>
      <a href="https://postkodstiftelsen.se/" target="_blank" rel="noreferrer">
        <img
          src="/logos/supporters/postkodstiftelsen.svg"
          width={90}
          height="auto"
          alt="Postkodstiftelsen logo"
        />
      </a>
    </SupporterContainer>
  )
}

export default Supporters
