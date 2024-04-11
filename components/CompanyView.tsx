import styled from 'styled-components'
import { H2Regular, H5Regular, Paragraph } from './Typography'
import { devices } from '../utils/devices'
import { Company } from '../utils/types'
import ComparisonTable from './ComparisonTable'
import { companyColumns } from '../utils/createCompanyList'

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
}

function CompanyView({
  companies,
}: CompanyViewProps) {
  const cols = companyColumns()

  return (
    <>
      <H2Regular>Hur går det med företagen?</H2Regular>
      <InfoContainer>
        <TitleContainer>
          <FloatingH5>Företagens utsläpp</FloatingH5>
        </TitleContainer>
        <ComparisonTable data={companies} columns={cols} />
        <InfoText>
          <Paragraph>Lorem</Paragraph>
          <ParagraphSource>Lorem ipsum</ParagraphSource>
        </InfoText>
      </InfoContainer>
    </>
  )
}

export default CompanyView
