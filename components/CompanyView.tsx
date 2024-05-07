import styled from 'styled-components'
import { useTranslation } from 'next-i18next'

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

const Details = styled.div`
  display: grid;
  padding: 0px 6px 8px;

  @media only screen and (${devices.tablet}) {
    padding: 0 12px 16px;
  }
`

const DetailsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  padding-bottom: 0.5rem;

  @media only screen and (${devices.tablet}) {
    padding-bottom: 1rem;
  }

  p {
    font-style: italic;
    color: gray;
  }
`

type CompanyViewProps = {
  companies: Array<Company>
}

function CompanyView({
  companies,
}: CompanyViewProps) {
  const { t } = useTranslation()
  const cols = companyColumns(t)

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
            renderSubComponent={({ row }) => {
              const company = row.original
              return (
                <Details>
                  <DetailsHeader>
                    <p>
                      {t('common:comment')}
                      :
                    </p>
                    <a href={company.Url} target="_blank" rel="noopener noreferrer">Läs rapporten</a>
                  </DetailsHeader>
                  <p>{company.Comment}</p>
                </Details>
              )
            }}
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
