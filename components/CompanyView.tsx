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
  align-items: center;
  margin-bottom: 64px;
`

const ComparisonContainer = styled.div`
  position: relative;
  overflow-y: scroll;
  z-index: 100;
  // TODO: Hardcoding this is not good.
  height: 684px;
  border-radius: 8px;
  display: flex;
  margin-top: 0;

  @media only screen and (${devices.tablet}) {
    height: 520px;
  }

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  ::-webkit-scrollbar {
    /* Chrome, Safari and Opera */
    display: none;
  }
`

const FloatingH5 = styled(H5Regular)`
  position: absolute;
  margin: 56px 0 0 16px;
  z-index: 200;

  @media only screen and (${devices.tablet}) {
    margin: 60px 0 0 16px;
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
      <H2Regular>Hur går det med utsläppen?</H2Regular>
      <InfoContainer>
        <TitleContainer>
          <FloatingH5>Företagens utsläpp för 2023</FloatingH5>
        </TitleContainer>
        <ComparisonContainer>
          <ComparisonTable
            data={companies}
            columns={cols}
            dataType="companies"
            renderSubComponent={({ row }) => (
              <pre style={{ fontSize: '10px' }}>
                <code style={{ whiteSpace: 'break-spaces' }}>{JSON.stringify(row.original, null, 2)}</code>
              </pre>
            )}
            // TODO: since we want every row to expand, maybe we don't need this function?
            getRowCanExpand={() => true}
          />
        </ComparisonContainer>
        <InfoText>
          <Paragraph>Lorem</Paragraph>
          <ParagraphSource>Lorem ipsum</ParagraphSource>
        </InfoText>
      </InfoContainer>
    </>
  )
}

// TODO
// [] add tooltip on hover
// [] routing
// [] data from API not excel
// [] styling
// [] texts

export default CompanyView
