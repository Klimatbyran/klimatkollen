/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import styled from 'styled-components'

import { H1NoPad, ParagraphBold } from '../Typography'
import BackArrow from '../BackArrow'
import PageWrapper from '../PageWrapper'
import DropDown from '../DropDown'
import { devices } from '../../utils/devices'
import { Company as TCompany } from '../../utils/types'
import CompanyScorecard from './CompanyScorecard'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items center;
  gap: 1.5rem;
  margin-bottom: 48px;
`

const Logo = styled.img`
  width: 60px;
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

  @media only screen and (${devices.tablet}) {
    // flex-direction: row-reverse;
  }
`

const DropDownSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 30px;
  text-align: center;
  align-items: center;
`

type CompanyProps = {
  company: TCompany
  logo?: string | null
  companyNames: Array<string>
}

function Company({ company, logo, companyNames }: CompanyProps) {
  return (
    <>
      <PageWrapper backgroundColor="lightBlack">
        <StyledContainer>
          <HeaderSection>
            <BackArrow route="/" />
            <H1NoPad>{company.Name}</H1NoPad>
            {logo && (
              <Logo
                src={logo}
                alt={`Kommunvapen för ${company.Name}`}
              />
            )}
          </HeaderSection>
        </StyledContainer>
      </PageWrapper>
      <PageWrapper backgroundColor="black">
        <Bottom>
          <CompanyScorecard
            name={company.Name}
          />
        </Bottom>
        <DropDownSection>
          <ParagraphBold>Hur ser det med andra företag?</ParagraphBold>
          <DropDown
            className="municipality-page"
            municipalitiesName={companyNames}
            placeholder="Välj kommun"
          />
        </DropDownSection>
      </PageWrapper>
    </>
  )
}

export default Company
