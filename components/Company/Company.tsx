import styled from 'styled-components'
import { useTranslation } from 'next-i18next'

import { H1NoPad, ParagraphBold } from '../Typography'
import BackArrow from '../BackArrow'
import PageWrapper from '../PageWrapper'
// import DropDown from '../DropDown'
import { GuessedCompany, Company as TCompany } from '../../utils/types'
import CompanyFacts from './CompanyFacts'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 48px;
`

const HeaderSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`

const Bottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`

const DropDownSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 30px;
  text-align: center;
  align-items: center;
  padding-bottom: 6rem;
`

type Props = {
  id: string
  company: { verified: TCompany, guessed: GuessedCompany }
  companyNames: Array<string>
}

function Company(props: Props) {
  const {
    id,
    company,
    // TODO: Provide a list of company names to allow searching and navigating to other pages
    companyNames,
  } = props

  // NOTE: Temporary log to supress ts errors
  if (!id && !companyNames) {
    throw new Error('temporary to supress ts errors')
  }

  const { t } = useTranslation()

  return (
    <>
      <PageWrapper>
        <StyledContainer>
          <HeaderSection>
            <BackArrow route="/foretag/utslappen/lista" />
            <H1NoPad>{company.verified.Name}</H1NoPad>
            <span>{/* HACK: Only for temporary layout */}</span>
          </HeaderSection>
        </StyledContainer>
      </PageWrapper>
      <PageWrapper>
        <Bottom>
          <CompanyFacts
            company={company}
          />
        </Bottom>
        <DropDownSection>
          <ParagraphBold>{t('company:otherCompanies')}</ParagraphBold>
          {/* <DropDown
            municipalitiesName={municipalitiesName}
            placeholder={t('municipality:select')}
          /> */}
        </DropDownSection>
      </PageWrapper>
    </>
  )
}

export default Company
