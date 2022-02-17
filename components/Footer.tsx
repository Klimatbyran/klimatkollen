import styled from 'styled-components'
import { Paragraph, H5 } from './Typography'
import { devices } from '../utils/devices'
import WWF from '../public/icons/wwf.svg'
import ClimateView from '../public/icons/climateview.svg'
import VBK from '../public/icons/vbk.svg'
import WeDontHaveTime from '../public/icons/we-dont-have-time.svg'
import Klimatklubben from '../public/icons/klimatklubben.svg'
import Argand from '../public/icons/argand.svg'

const Wrapper = styled.div`
    background: ${({ theme }) => theme.dark};
    width: 100%;
    margin-top: 5rem;
    padding: 40px 20px;
    display: flex;

    @media only screen and (${devices.tablet}) {
        justify-content: center;
    }
`

const ContentWrapper = styled.div`
    width: 850px;
`

const TextSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 40px;
    max-width: 750px;
`

const FlexSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    justify-content: center;
    text-align: center;
    align-items: center;

    @media only screen and (${devices.tablet}) {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
    }
`

const IconSection = styled.div`
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;
    gap: 20px;
    margin-bottom: 40px;
    width: 350px;
`

const IconWrapper = styled.div`
    display: flex;
    align-items: center;

    @media only screen and (${devices.tablet}) {
        margin-top: 5px;
        height: 80px;
    }
`

const Footer = () => {
  return (
    <Wrapper>
        <ContentWrapper>
            <TextSection>
                <H5>Om klimatkollen</H5>
                <Paragraph>
                    Klimatkollen visar enkel fakta om klimatomställningen, anpassad för att delas i sociala kanaler och läsas i mobilen. Här kan du se hur det går med klimatutsläppen i varje kommun, hur stort utrymmet är enligt Parisavtalet för ytterligare utsläpp och hur stort glappet är till dagens nivåer. Du kan också se de största utsläppskällorna i din kommun och hur mycket (eller lite) utsläppen i din kommun minskar jämfört med andra.
                </Paragraph>
                <Paragraph>
                    Vi utvecklar Klimatkollen kontinuerligt. Mer fakta kommer. Skriv upp dig här så berättar vi när vi släpper något nytt.
                </Paragraph>
                <Paragraph>
                    Använd Klimatkollen för att dela fakta och kräva svar. Hur vill partierna minska utsläppen? Vilka lösningar finns? Klimatkollen hjälper dig att ställa rätt frågor.
                </Paragraph>
                <Paragraph>
                    All fakta på Klimatkollen kommer från offentliga källor. Vi redovisar alla källor tydligt så att du enkelt kan kolla upp och läsa mer. Om något blivit fel, mejla gärna oss på info@klimatkollen.se så att vi kan ändra.
                </Paragraph>
                <Paragraph>
                    Klimatkollen är utvecklad av Klimatbyrån ideell förening med hjälp av Iteam. Vi tror på kraften i att visualisera fakta på ett enkelt och tilltalande sätt. På det sättet vill vi bidra till en mer faktabaserad klimatdebatt och åtgärder som minskar utsläppen i linje med Parisavtalet.
                </Paragraph>
            </TextSection>
            <TextSection>
                <H5>Vad är Parisavtalet?</H5>
                <Paragraph>
                    Parisavtalet är ett juridiskt bindande avtal mellan världens länder om att begränsa den globala uppvärmningen till väl under två grader med sikte på 1,5 grader.
                </Paragraph>
                <Paragraph>
                    För att nå målet måste världen som helhet halvera växthusgasutsläppen till 2030 och nå nära noll utsläpp senast 2050.
                </Paragraph>
                <Paragraph>
                    Enligt Parisavtalet ska rika länder, som historiskt sett släppt ut mycket växthusgaser, ta ett större ansvar för att genomföra klimatomställningen. Där ingår Sverige, som både ska före när det gäller få ner utsläppen, men också hjälpa mer sårbara länder att ställa om. I Sverige stöds Parisavtalet av alla partier i riksdagen.
                </Paragraph>
                <Paragraph>
                    Läs mer om Parisavtalet hos vår samarbetspartner WWF.
                </Paragraph>
                <Paragraph>
                    En koldioxidbudget är den mängd koldioxid vi har kvar att släppa ut innan vi riskerar att öka temperaturen så mycket att det bryter mot Parisavtalet. Det är ett sätt att åskådliggöra utsläppsutrymmet som finns kvar om vi ska hålla uppvärmningen under 1,5 grader. FN:s klimatpanel, IPCC, beräknar en global koldioxidbudget, som sedan kan beräkas per land, region eller kommun. Klimatkollen visar koldioxidbudgetar för alla Sveriges kommuner som utgår ifrån Parisavtalets mål om 1,5 graders global uppvärmning.
                </Paragraph>
                <Paragraph>
                    Läs mer om hur koldioxidbudgetarna är beräknade hos vår samarbetspartner ClimateView.
                </Paragraph>
            </TextSection>
            <TextSection>
                <H5>Våra samarbetspartners</H5>
            </TextSection>
            <FlexSection>
                <IconSection>
                    <IconWrapper>
                        <WWF />
                    </IconWrapper>
                    <Paragraph>Världens största miljöorganisation med sex miljoner supportrar globalt och 200 000 i Sverige</Paragraph>
                </IconSection>
                <IconSection>
                    <IconWrapper>                
                        <ClimateView />
                    </IconWrapper>
                    <Paragraph>Ett internationellt teknikföretag som hjälper kommuner att planera och analysera klimatarbetet</Paragraph>
                </IconSection>
                <IconSection>
                    <IconWrapper>
                        <VBK />
                    </IconWrapper>
                    <Paragraph>Samlar föräldrar och andra vuxna för att lyfta fram barnens perspektiv i klimatfrågan</Paragraph>
                </IconSection>
                <IconSection>
                    <IconWrapper>
                        <WeDontHaveTime />
                    </IconWrapper>
                    <Paragraph>Världens största sociala nätverk för klimataktion. Skapa din egen kampanj här www.wedonthavetime.org</Paragraph>
                </IconSection>
                <IconSection>
                    <IconWrapper>
                        <Klimatklubben />
                    </IconWrapper>
                    <Paragraph>Ett nätverk som arbetar för att klimatfrågan ska lyftas högst upp på agendan</Paragraph>
                </IconSection>
                <IconSection>
                    <IconWrapper>
                        <Argand />
                    </IconWrapper>
                    <Paragraph>Investerar i klimatlösningar</Paragraph>
                </IconSection>
            </FlexSection>
        </ContentWrapper>
    </Wrapper>
  )
}

export default Footer
