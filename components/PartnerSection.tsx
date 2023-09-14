import styled from 'styled-components'

import { devices } from '../utils/devices'

const IconSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media only screen and (${devices.tablet}) {
    flex: 0 1 350px;
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

export default PartnerSection
