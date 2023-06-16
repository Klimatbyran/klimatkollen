import { H2, H5, Paragraph } from '../Typography'
import styled from 'styled-components'
import FactSection from '../FactSection'
import { Municipality } from '../../utils/types'
import EVCar from '../../public/icons/ev_car.svg'
import Bike from '../../public/icons/bike.svg'

const StyledH2 = styled(H2)`
  margin-top: 32px;
  margin-bottom: 32px;
  width: 100%;
`

const StyledH5 = styled(H5)`
  margin: 32px 0 32px 16px;
`

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`

type SolutionSectionProps = {
  icon: JSX.Element
  title: string
  heading: string
  data: string
  info: string
}

const SolutionSection = ({ icon, title, heading, data, info }: SolutionSectionProps) => {
  return (
    <>
      <FlexContainer>
        {icon}
        <StyledH5>{title}</StyledH5>
      </FlexContainer>
      <FactSection heading={heading} data={data} info={info} />
    </>
  )
}

type SolutionsProps = {
  municipality: Municipality
}

const MunicipalitySolutions = ({ municipality }: SolutionsProps) => {
  return (
    <>
      <StyledH2>Omställning</StyledH2>
      <Paragraph>
        Här visas nyckeltal för hur det går med klimatomställningen i kommunerna.
      </Paragraph>
      <SolutionSection
        icon={<EVCar />}
        title="Elbilarna"
        heading="Förändringstakt andel laddbara bilar"
        data={(municipality.ElectricCarChangePercent * 100).toFixed(1) + '%'}
        info="Ökningstakten för andelen nyregistrerade laddbara bilar sedan Parisavtalet
            2015 i procentenheter per år."
      />
      <SolutionSection
        icon={<Bike />}
        title="Cykelvägarna"
        heading="Lorem ipsum"
        data={municipality.BicycleMetrePerCapita.toFixed(1) + ' meter'}
        info="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua."
      />
    </>
  )
}

export default MunicipalitySolutions