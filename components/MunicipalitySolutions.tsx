import styled from "styled-components"
import { H2, H5, Paragraph } from "./Typography"
import FactSection from './FactSection'
import { ElectricCarChangeYearly } from '../utils/types'
import EVCar from '../public/icons/ev_car.svg'
import Graph from "./Graph"


const StyledH2 = styled(H2)`
  margin-top: 32px;
  margin-bottom: 32px;
  width: 100%;
`

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`

const StyledH5 = styled(H5)`
  margin: 32px 0 32px 16px;
`

type SolutionsProps = {
  electricCarChangePercent: number
  electricCarChangeYearly: ElectricCarChangeYearly
}

const Solutions = ({ electricCarChangePercent, electricCarChangeYearly }: SolutionsProps) => {
  return (
    <>
      <StyledH2>
        Omställning
      </StyledH2>
      <Paragraph>
        Här visas nyckeltal för hur det går med klimatomställningen i kommunerna. Först ut är trafikutsläppen och övergången från
        fossilbilar till laddbara bilar. Fler nyckeltal tillkommer.
      </Paragraph>
      <FlexContainer>
        <EVCar />
        <StyledH5>
          Elbilarna
        </StyledH5>
      </FlexContainer>
      <FactSection
        heading='Ökning elbilar'
        data={(electricCarChangePercent * 100).toFixed(1) + '%'}
        info={
          <>
            Ökningstakten för andelen nyregistrerade laddbara bilar sedan Parisavtalet 2015 i procentenheter per år.
          </>}
      />
      <Graph
        historical={electricCarChangeYearly.ChangePerYear}
        yLabel={'Procentenheter'}
        maxVisibleYear={2050}
        divideBy={0.01} />
    </>
  )
}

export default Solutions