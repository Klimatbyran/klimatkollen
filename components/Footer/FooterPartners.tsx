import styled from 'styled-components'

import { devices } from '../../utils/devices'

const IconSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media only screen and (${devices.tablet}) {
    flex: 0 1 150px;
  }
`

type PartnerProps = {
  link: string
  logo: JSX.Element
}

function PartnerSection({ link, logo }: PartnerProps) {
  return (
    <IconSection>
      <a href={link} target="_blank" rel="noreferrer">
        {logo}
      </a>
    </IconSection>
  )
}

function Partners() {
  return (
    <>
      <PartnerSection
        link="https://postkodstiftelsen.se/"
        logo={(
          <img
            src="/icons/postkodstiftelsen.svg"
            width={90}
            height="auto"
            alt="Postkodstiftelsen logo"
          />
      )}
      />
      <PartnerSection
        link="https://www.wwf.se/"
        logo={(
          <img
            src="/partners/WWF_Logo_Small_RGB_72dpi.jpg"
            width={45}
            height={45}
            alt="WWF logo"
          />
        )}
      />
      <PartnerSection
        link="https://www.climateview.global/"
        logo={(
          <img
            src="/icons/climateview.svg"
            width={90}
            height="auto"
            alt="ClimateViw logo"
          />
        )}
      />
      <PartnerSection
        link="https://www.klimatklubben.se/"
        logo={(
          <img
            src="/icons/klimatklubben.svg"
            width="auto"
            height={45}
            alt="Klimatklubben logo"
          />
        )}
      />
    </>
  )
}

export default Partners
