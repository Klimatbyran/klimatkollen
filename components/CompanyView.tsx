import styled from 'styled-components'
import { H2Regular, H5Regular, Paragraph } from './Typography'
import { devices } from '../utils/devices'
import { Company } from '../utils/types'
import ComparisonTable from './ComparisonTable'
import { companyColumns } from '../utils/createCompanyList'
import ToggleButton from './ToggleButton'
import { defaultDataView, secondaryDataView } from '../utils/datasetDescriptions'
import ListIcon from '../public/icons/list.svg'
import MapIcon from '../public/icons/map.svg'

const InfoText = styled.div`
  padding: 0 16px;
`

const ParagraphSource = styled(Paragraph)`
  font-size: 13px;
  color: ${({ theme }) => theme.grey};
`

const InfoContainer = styled.div`
  width: 100%;
  position: relative;
  background: ${({ theme }) => theme.lightBlack};
  border-radius: 8px;
  margin: 32px 0;
  z-index: 15;
  ::-webkit-scrollbar {
    display: none;
  }
`

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 64px;
`

const FloatingH5 = styled(H5Regular)`
  position: absolute;
  margin: 60px 0 0 16px;
  z-index: 200;

  @media only screen and (${devices.mobile}) {
    margin: 55px 0 0 16px;
  }
`

type CompanyViewProps = {
  companies: Array<Company>
  selectedDataView: string
  setSelectedDataView: (newData: string) => void
}

function CompanyView({
  companies,
  selectedDataView,
  setSelectedDataView,
}: CompanyViewProps) {
  const cols = companyColumns()

  const handleToggleView = () => {
    const newDataView = selectedDataView === defaultDataView ? secondaryDataView : defaultDataView
    setSelectedDataView(newDataView)
  }

  const isDefaultDataView = selectedDataView === defaultDataView
  const routeString = 'företag'

  return (
    <>
      <H2Regular>Hur går det med företagen?</H2Regular>
      <InfoContainer>
        <TitleContainer>
          <FloatingH5>Företagens utsläpp</FloatingH5>
        </TitleContainer>
        <ToggleButton
          handleClick={handleToggleView}
          text={isDefaultDataView ? 'Listvy' : 'Grafvy'}
          icon={isDefaultDataView ? <ListIcon /> : <MapIcon />}
        />
        <ComparisonTable data={companies} columns={cols} routeString={routeString} />
        <InfoText>
          <Paragraph>Lorem</Paragraph>
          <ParagraphSource>Lorem ipsum</ParagraphSource>
        </InfoText>
      </InfoContainer>
    </>
  )
}

export default CompanyView
