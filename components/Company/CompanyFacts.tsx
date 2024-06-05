import styled from 'styled-components'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'

import ScorecardSection from '../ScorecardSection'
import { H4, H5 } from '../Typography'
import Icon from '../../public/icons/boxedArrow.svg'
import PlanIcon from '../../public/icons/climatePlan.svg'
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

const GreyContainer = styled.div`
  background: ${({ theme }) => theme.newColors.black2};
  border-radius: 8px;
  padding: 1rem;

  .no-climate-plan h3 {
    color: ${({ theme }) => theme.newColors.orange3};
  }
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 36px;
`

const SectionLeft = styled.section`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 90%;
`

const SectionRight = styled.section`
  text-align: right;
`

const ArrowIcon = styled(Icon)`
  width: 32px;
  height: 32px;
  position: absolute;
  z-index: 1;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  fill: ${({ theme }) => theme.newColors.black3};
`

const LinkButton = styled(Link)`
  height: 36px;
  color: ${({ theme }) => theme.newColors.black3};
  background: ${({ theme }) => theme.newColors.blue2};
  border-radius: 4px;
  border: 1px solid transparent;
  padding: 0.8rem 1rem 0.8rem 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  &:hover {
    background: ${({ theme }) => theme.newColors.blue1};
  }
  & a {
    text-decoration: none;
  }
`

const Square = styled.div`
  width: 16px;
  height: 16px;
  position: relative;
  border-radius: 4px;
`

type Props = {
  company: { verified: TCompany, guessed: GuessedCompany }
}

// const formatter = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 1 })

function CompanyFacts({
  company,
}: Props) {
  const { t } = useTranslation()

  return (
    <StyledDiv>
      <StyledH4>
        {t('company:facts.title', { name: company.verified.Name })}
      </StyledH4>
      <GreyContainer>
        <Row>
          <SectionLeft>
            <PlanIcon />
            <H5>Hållbarhetsrapport</H5>
          </SectionLeft>
          <SectionRight>
            <LinkButton href={company.verified.Url} target="_blank">
              {t('common:actions.open')}
              <Square>
                <ArrowIcon />
              </Square>
            </LinkButton>
          </SectionRight>
        </Row>
      </GreyContainer>

      <ScorecardSection
        heading="Bransch GICS"
        data={JSON.stringify(company.guessed.industryGics, null, 2)}
        // eslint-disable-next-line
        info="The Global Industry Classification Standard (GICS) is an industry taxonomy consists of 11 sectors, 25 industry groups, 74 industries and 163 sub-industries."
      />
      <ScorecardSection
        heading="Bransch NACE"
        data={JSON.stringify(company.guessed.industryNace, null, 2)}
        // eslint-disable-next-line
        info={`The Statistical Classification of Economic Activities in the European Community, commonly referred to as NACE (for the French term "nomenclature statistique des activités économiques dans la Communauté européenne"), is the industry standard classification system used in the European Union.`}
      />
      <ScorecardSection
        heading="Omsättning"
        data={JSON.stringify(company.guessed.turnover, null, 2)}
        info="Siffror från hållbarhetsrapport"
      />

    </StyledDiv>
  )
}

export default CompanyFacts
