import styled from 'styled-components'
import { useTranslation } from 'next-i18next'

import {
  H1NoPad, H3, Paragraph,
} from '../Typography'
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  max-width: 400px;
  background: ${({ theme }) => theme.newColors.black2};
  padding: 1rem;
  border-radius: 16px;
  margin-bottom: 2rem;

  ${Paragraph} {
    margin: 0;
  }

  ${Paragraph}:nth-child(odd) {
    font-weight: 600;
  }

  ${Paragraph}:nth-child(even) {
    text-align: right;
  }
`

// const DropDownSection = styled.div`
//   width: 100%;
//   display: flex;
//   flex-direction: column;
//   gap: 10px;
//   margin-top: 30px;
//   text-align: center;
//   align-items: center;
//   padding-bottom: 6rem;
// `

type Props = {
  id: string
  company: { verified: TCompany, guessed: GuessedCompany }
  companyNames: Array<string>
}

const formatter = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 1 })

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
    <PageWrapper>
      <StyledContainer>
        <HeaderSection>
          <BackArrow route="/foretag/utslappen/lista" />
          <H1NoPad>{company.verified.Name}</H1NoPad>
          <span>{/* HACK: Only for temporary layout */}</span>
        </HeaderSection>
      </StyledContainer>

      <Grid>
        <Paragraph>Egna utsläpp:</Paragraph>
        <Paragraph>{`${formatter.format(company.verified.Emissions.Scope1n2 as unknown as number)} ton CO₂e`}</Paragraph>
        <Paragraph>I värdekedjan:</Paragraph>
        <Paragraph>{`${formatter.format(company.verified.Emissions.Scope3 as unknown as number)} ton CO₂e`}</Paragraph>
      </Grid>

      <H3>{t('common:comment')}</H3>
      <Paragraph>{company.verified.Comment}</Paragraph>

      <Bottom>
        <CompanyFacts
          company={company}
        />
      </Bottom>
      {/* <DropDownSection>
          <ParagraphBold>{t('company:otherCompanies')}</ParagraphBold>
          <DropDown
            municipalitiesName={municipalitiesName}
            placeholder={t('municipality:select')}
          />
        </DropDownSection> */}
    </PageWrapper>
  )
}

export default Company
