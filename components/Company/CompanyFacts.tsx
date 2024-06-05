import styled from 'styled-components'
import { useTranslation } from 'next-i18next'
// import Link from 'next/link'

import ScorecardSection from './ScorecardSection'
import { H4 } from '../Typography'
// import Icon from '../../public/icons/boxedArrow.svg'
// import PlanIcon from '../../public/icons/climatePlan.svg'
// import FactSection from '../FactSection'
// import Markdown from '../Markdown'
import { Company as TCompany, GuessedCompany } from '../../utils/types'

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 64px;
`

const StyledH4 = styled(H4)`
  margin-top: 32px;
  margin-bottom: 32px;
  width: 100%;
`

// const GreyContainer = styled.div`
//   background: ${({ theme }) => theme.newColors.black2};
//   border-radius: 8px;
//   padding: 16px 16px 0 16px;
//   margin-bottom: 8px;

//   .no-climate-plan h3 {
//     color: ${({ theme }) => theme.newColors.orange3};
//   }
// `

// const Row = styled.div`
//   display: flex;
//   flex-direction: row;
//   justify-content: space-between;
//   height: 36px;
// `

// const SectionLeft = styled.section`
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
//   width: 90%;
// `

// const SectionRight = styled.section`
//   text-align: right;
// `

// const ArrowIcon = styled(Icon)`
//   width: 32px;
//   height: 32px;
//   position: absolute;
//   z-index: 1;
//   margin: auto;
//   left: 0;
//   right: 0;
//   top: 0;
//   bottom: 0;
//   fill: ${({ theme }) => theme.newColors.black3};
// `

// const LinkButton = styled(Link)`
//   height: 36px;
//   color: ${({ theme }) => theme.newColors.black3};
//   background: ${({ theme }) => theme.newColors.blue2};
//   border-radius: 4px;
//   border: 1px solid transparent;
//   padding: 0.8rem 1rem 0.8rem 0.8rem;
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   text-decoration: none;
//   &:hover {
//     background: ${({ theme }) => theme.newColors.blue1};
//   }
//   & a {
//     text-decoration: none;
//   }
// `

// const Square = styled.div`
//   width: 16px;
//   height: 16px;
//   position: relative;
//   border-radius: 4px;
// `

type Props = {
  company: { verified: TCompany, guessed: GuessedCompany }
}

const formatter = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 1 })

function CompanyFacts({
  company,
}: Props) {
  const { t } = useTranslation()

  return (
    <StyledDiv>
      <StyledH4>
        {t('company:facts.title', { name: company.verified.Name })}
      </StyledH4>
      {/* <GreyContainer>
        <Row>
          <SectionLeft>
            <PlanIcon />
            <H5>{t('municipality:facts.climatePlan.title')}</H5>
          </SectionLeft>
          {/ * TODO: Link to original report * /}
          {/ * {hasClimatePlan ? (
            <SectionRight>
              <LinkButton href={climatePlan.Link} target="_blank">
                {t('common:actions.open')}
                <Square>
                  <ArrowIcon />
                </Square>
              </LinkButton>
            </SectionRight>
          ) : null} * /}
        </Row>
        {/ * TODO: Maybe show the company comment here instead * /}
        {/ * <FactSection
          heading={climatePlanYearFormatted}
          data=""
          info={t('municipality:facts.climatePlan.info', { comment: climatePlan.Comment })}
          className={!hasClimatePlan ? 'no-climate-plan' : undefined}
        /> * /}
      </GreyContainer> */}

      <ScorecardSection
        heading="Egna utsläpp"
        data={`${formatter.format(company.verified.Emissions.Scope1n2 as unknown as number)} ton CO₂e`}
        info="Scope 1 och 2"
      />
      <ScorecardSection
        heading="I värdekedjan"
        data={`${formatter.format(company.verified.Emissions.Scope3 as unknown as number)} ton CO₂e`}
        info="Scope 3"
      />

    </StyledDiv>
  )
}

export default CompanyFacts
