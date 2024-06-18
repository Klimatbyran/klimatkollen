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
  position: -webkit-sticky;
  position: sticky;
  bottom: 0;
  background: ${({ theme }) => theme.newColors.black2};
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

  @media screen and (${devices.tablet}) {
    p {
      font-size: 14px;
    }
  }

  @media screen and (${devices.laptop}) {
    p {
      font-size: 16px;
    }
  }
`

const ParagraphSource = styled(Paragraph)`
  color: ${({ theme }) => theme.newColors.gray};
  margin: 0;
  font-size: 12px;
  padding: 0 16px 8px;
`

const InfoContainer = styled.div`
  width: 100%;
  position: relative;
  background: ${({ theme }) => theme.newColors.black2};
  border-radius: 8px;
  margin: 32px 0;
  z-index: 15;
`

const ComparisonContainer = styled.div`
  position: relative;
  border-radius: 8px;
  display: flex;
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
          />
        </ComparisonContainer>
        <InfoText>
          <Markdown>{t('startPage:companyView.tableFooterInfo')}</Markdown>
        </InfoText>
        <Markdown components={{ p: ParagraphSource }}>
          {t('startPage:companyView.source')}
        </Markdown>
      </InfoContainer>
    </>
  )
}

export default CompanyView
