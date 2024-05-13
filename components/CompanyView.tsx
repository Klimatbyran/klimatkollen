import styled from 'styled-components'
import { useTranslation } from 'next-i18next'

import { H2Regular, Paragraph } from './Typography'
import { devices } from '../utils/devices'
import { Company } from '../utils/types'
import ComparisonTable from './ComparisonTable'
import { companyColumns } from '../utils/createCompanyList'
import Markdown from './Markdown'

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

const ComparisonContainer = styled.div`
  position: relative;
  overflow-y: scroll;
  z-index: 100;
  // TODO: Hardcoding this is not good.
  height: 684px;
  border-radius: 8px;
  display: flex;
  margin-top: 8px;

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

const Details = styled.div`
  display: grid;
  padding: 0 6px 8px;

  @media only screen and (${devices.tablet}) {
    padding: 8px 12px 16px;
  }
`

const DetailsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;

  p {
    font-style: italic;
    color: gray;
    padding-top: 0.5rem;
  }

  a {
    padding: 0.5rem 0;
  }

  @media only screen and (${devices.tablet}) {
    padding-bottom: 0.5rem;
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
      <H2Regular>{t('startPage:companyView.questionTitle')}</H2Regular>
      <InfoContainer>
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
          <Markdown>{t('startPage:companyView.tableFooterInfo')}</Markdown>
          {/* TODO: Link directly to specific section about company data */}
          <Markdown components={{ p: ParagraphSource }}>
            {t('startPage:companyView.source')}
          </Markdown>
        </InfoText>
      </InfoContainer>
    </>
  )
}

export default CompanyView
