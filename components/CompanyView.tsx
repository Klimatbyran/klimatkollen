import styled from 'styled-components'
import { useTranslation } from 'next-i18next'

import { H2Regular, Paragraph } from './Typography'
import { devices } from '../utils/devices'
import { Company } from '../utils/types'
import ComparisonTable from './ComparisonTable'
import { companyColumns } from '../utils/createCompanyList'
import Markdown from './Markdown'

const InfoText = styled.div`
  padding: 8px 16px;
  position: sticky;
  bottom: 0;
  background: ${({ theme }) => theme.lightBlack};
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;

  p {
    margin-top: 0;
    font-size: 12px;
  }

  &::before {
    content: ' ';
    position: absolute;
    width: 100%;
    height: 2rem;
    background: linear-gradient(transparent, #0002);
    top: -2rem;
    left: 0;
    right: 0;
  }
`

// TODO: remove if we decide to show source together with the footer info text.
const ParagraphSource = styled(Paragraph)`
  color: ${({ theme }) => theme.grey};
  margin: 0;
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
  border-radius: 8px;
  display: flex;
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
        {/* IDEA: Maybe make it possible to expand/collapse the table footer to show more info */}
        <InfoText>
          {/* IDEA: Maybe combine texts into one paragraph to save space? */}
          <Markdown>{t('startPage:companyView.tableFooterInfo') + t('startPage:companyView.source')}</Markdown>
          {/* IDEA: Maybe use gray color span to render part of the markdown string, to show that source info is less important */}

          {/* <Markdown>{t('startPage:companyView.tableFooterInfo')}</Markdown>
          <Markdown components={{ p: ParagraphSource }}>
            {t('startPage:companyView.source')}
          </Markdown> */}
        </InfoText>
      </InfoContainer>
    </>
  )
}

export default CompanyView
