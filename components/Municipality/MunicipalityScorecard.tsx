import styled from 'styled-components'
import { useTranslation } from 'next-i18next'

import ScorecardSection from './ScorecardSection'
import { ClimatePlan } from '../../utils/types'
import { H4, H5 } from '../Typography'
import Icon from '../../public/icons/boxedArrow.svg'
import PlanIcon from '../../public/icons/climatePlan.svg'
import FactSection from '../FactSection'
import { climatePlanMissing } from '../../utils/datasetDefinitions'
import Markdown from '../Markdown'

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
  padding: 16px 16px 0 16px;
  margin-bottom: 8px;
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

const LinkButton = styled.button`
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

const CementClarification = styled.div`
  margin: 0;

  & * {
    margin: 0
  }
`

type Props = {
  name: string
  rank: number | null
  budget: number | null
  budgetRunsOut: string
  neededEmissionChangePercent: number
  politicalRule: Array<string> | null
  climatePlan: ClimatePlan
}

const formatter = new Intl.NumberFormat('sv-SE', { maximumSignificantDigits: 8 })
const fractionFormatter = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 1 })

function Scorecard({
  name,
  rank,
  budget,
  budgetRunsOut,
  neededEmissionChangePercent,
  politicalRule,
  climatePlan,
}: Props) {
  const { t } = useTranslation()
  const climatePlanYearFormatted = climatePlan.YearAdapted !== climatePlanMissing
    ? t('municipality:facts.climatePlan.adaptedYear', { year: climatePlan.YearAdapted })
    : climatePlan.YearAdapted
  const politicalRuleFormatted = politicalRule ? politicalRule.join(', ') : t('common:dataMissing')

  const handleButtonClick = () => {
    if (climatePlan.Link !== climatePlanMissing) {
      window.open(climatePlan.Link, '_blank')
    }
  }

  return (
    <StyledDiv>
      <StyledH4>
        {t('municipality:facts.title', { name })}
      </StyledH4>
      <GreyContainer>
        <Row>
          <SectionLeft>
            <PlanIcon />
            <H5>{t('municipality:facts.climatePlan.title')}</H5>
          </SectionLeft>
          {climatePlan.Link !== climatePlanMissing ? (
            <SectionRight>
              <LinkButton onClick={handleButtonClick}>
                {t('common:actions.open')}
                <Square>
                  <ArrowIcon />
                </Square>
              </LinkButton>
            </SectionRight>
          ) : null}
        </Row>
        <FactSection
          heading={climatePlanYearFormatted}
          data=""
          info={t('municipality:facts.climatePlan.info', { comment: climatePlan.Comment })}
        />
      </GreyContainer>
      {rank && (
        <ScorecardSection
          heading={t('municipality:facts.rank.title')}
          data={t('municipality:facts.rank.rank', { rank })}
          info={t('municipality:facts.rank.info')}
        />
      )}
      {['Gotland', 'Skövde', 'Mörbylånga'].includes(name) && (
      <CementClarification>
        <Markdown>
          {t('municipality:facts.cementExcluded')}
        </Markdown>
      </CementClarification>
      )}
      {budget && (
        <ScorecardSection
          heading={t('municipality:facts.co2budget.title')}
          data={t('municipality:tonnes', { amount: formatter.format(Math.round(budget)) })}
          info={t('municipality:facts.co2budget.info')}
        />
      )}
      {budgetRunsOut && (
        <ScorecardSection
          heading={t('municipality:facts.budgetRunsOut.title')}
          data={
            budgetRunsOut === 'Håller budget'
              ? t('municipality:facts.budgetRunsOut.onTrack')
              : budgetRunsOut
          }
          info={t('municipality:facts.budgetRunsOut.info')}
        />
      )}
      <ScorecardSection
        heading={t('municipality:facts.emissionReduction.title')}
        data={t('municipality:facts.emissionReduction.percent', { percent: fractionFormatter.format(neededEmissionChangePercent) })}
        info={t('municipality:facts.emissionReduction.info')}
      />
      {politicalRule && (
        <ScorecardSection
          heading={t('municipality:facts.politicalRule.title')}
          data={politicalRuleFormatted}
          info={t('municipality:facts.politicalRule.info')}
        />
      )}
    </StyledDiv>
  )
}

export default Scorecard
