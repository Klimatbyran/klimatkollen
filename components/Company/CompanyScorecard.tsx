import styled from 'styled-components'
import { H4 } from '../Typography'

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

type ScorecardProps = {
  name: string
}

function CompanyScorecard({ name }: ScorecardProps) {
  return (
    <StyledDiv>
      <StyledH4>
        Fakta om
        {' '}
        {name}
      </StyledH4>
      {/* {rank && (
        <ScorecardSection
          heading="Kommunens plats i utsläppsrankning"
          data={rankFormatted}
          info={(
            <>
              Rankning av Sveriges 290 kommuner baserat på genomsnittlig årlig procentuell
              förändring av koldioxidutsläppen sedan Parisavtalet 2015.
            </>
          )}
        />
      )}
      {['Gotland', 'Skövde', 'Mörbylånga'].includes(name) && (
        <ParagraphItalic>
          Utsläpp från cementproduktion exkluderad, i enlighet med IPCC:s koldioxidbudget,
          läs mer
          {' '}
          <a href="/kallor-och-metod">här</a>
        </ParagraphItalic>
      )} */}
    </StyledDiv>
  )
}

export default CompanyScorecard
