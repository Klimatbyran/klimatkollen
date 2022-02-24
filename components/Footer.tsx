import styled from 'styled-components'
import { Paragraph, H5, ParagraphBold } from './Typography'
import { devices } from '../utils/devices'
import WWF from '../public/icons/wwf.svg'
import ClimateView from '../public/icons/climateview.svg'
import VBK from '../public/icons/vbk.svg'
import WeDontHaveTime from '../public/icons/we-dont-have-time.svg'
import Klimatklubben from '../public/icons/klimatklubben.svg'
import Argand from '../public/icons/argand.svg'
import NewsletterSubscribe from './NewsletterSubscribe'
import Emoji from './Emoji'
import ArrowDown from '../public/icons/arrow-down-round.svg'
import ArrowUp from '../public/icons/arrow-up-green.svg'
import { useState } from 'react'

const Wrapper = styled.div`
    background: ${({ theme }) => theme.dark};
    width: 100%;
    margin-top: 5rem;
    padding: 40px 20px;
    display: flex;

    @media only screen and (${devices.tablet}) {
        justify-content: center;
        padding: 80px 20px;
    }
`

const ContentWrapper = styled.div`
    width: 840px;
`

const HeaderSection = styled.div`
    display: flex;
    justify-content: space-between;

    & .arrow {
        display: block;

        @media only screen and (${devices.tablet}) {
            display: none;
        }
    }
`

const ToggleSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
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
    text-align: center;
    align-items: center;

    @media only screen and (${devices.tablet}) {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        width: 90%;
    }
`

const IconSection = styled.div`
    display: flex;
    flex-direction: column;

    align-items: center;
    gap: 15px;
    margin-bottom: 60px;
    width: 350px;

    @media only screen and (${devices.tablet}) {
        height: 200px;
        width: 300px;
    }
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

    const [toggleFirst, setToggleFirst] = useState(false)
    const [toggleSecond, setToggleSecond] = useState(false)

  return (
    <Wrapper>
        <ContentWrapper>
            <TextSection>
                <HeaderSection>
                    <H5>Om klimatkollen</H5>
                    {toggleFirst ? <ArrowUp className="arrow" onClick={() => setToggleFirst(!toggleFirst)} /> : <ArrowDown className="arrow" onClick={() => setToggleFirst(!toggleFirst)} />}                
                </HeaderSection>
                {toggleFirst &&                 
                <ToggleSection>
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
                        All fakta på Klimatkollen kommer från offentliga källor. Vi redovisar alla källor tydligt så att du enkelt kan kolla upp och läsa mer. Om något blivit fel, mejla gärna oss på <a href="mailto:info@klimatkollen.se">info@klimatkollen.se</a> så att vi kan ändra.
                    </Paragraph>
                    <Paragraph>
                        Klimatkollen är utvecklad av Klimatbyrån ideell förening med hjälp av <a href="https://iteam.se/" target="_blank" rel="noreferrer">Iteam</a>. Vi tror på kraften i att visualisera fakta på ett enkelt och tilltalande sätt. På det sättet vill vi bidra till en mer faktabaserad klimatdebatt och åtgärder som minskar utsläppen i linje med Parisavtalet.
                    </Paragraph>
                </ToggleSection>}
            </TextSection>
            <TextSection>
                <HeaderSection>
                    <H5>We <Emoji symbol="❤️" label="heart" /> Parisavtalet</H5>
                    {toggleSecond ? <ArrowUp className="arrow" onClick={() => setToggleSecond(!toggleSecond)} /> : <ArrowDown className="arrow" onClick={() => setToggleSecond(!toggleSecond)} />}
                </HeaderSection>
                {toggleSecond &&                 
                <ToggleSection>
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
                        Läs mer om Parisavtalet hos vår samarbetspartner <a href="https://wwf.se/" target="_blank" rel="noreferrer">WWF</a>.
                    </Paragraph>
                    <Paragraph>
                        En koldioxidbudget är den mängd koldioxid vi har kvar att släppa ut innan vi riskerar att öka temperaturen så mycket att det bryter mot Parisavtalet. Det är ett sätt att åskådliggöra utsläppsutrymmet som finns kvar om vi ska hålla uppvärmningen under 1,5 grader. FN:s klimatpanel, IPCC, beräknar en global koldioxidbudget, som sedan kan beräkas per land, region eller kommun. Klimatkollen visar koldioxidbudgetar för alla Sveriges kommuner som utgår ifrån Parisavtalets mål om 1,5 graders global uppvärmning.
                    </Paragraph>
                    <Paragraph>
                        Läs mer om hur koldioxidbudgetarna är beräknade hos vår samarbetspartner <a href="https://www.climateview.global/" target="_blank" rel="noreferrer">ClimateView</a>.
                    </Paragraph>
                </ToggleSection>}
            </TextSection>
            <TextSection>
                <ParagraphBold>Intresseanmälan för nyhetsbrev</ParagraphBold>
                <NewsletterSubscribe />
            </TextSection>
            <TextSection>
                <H5>Våra samarbetspartners</H5>
            </TextSection>
            <FlexSection>
                <IconSection>
                    <IconWrapper>
                        <a href="https://www.wwf.se/" target="_blank" rel="noreferrer"><WWF /></a>
                    </IconWrapper>
                    <Paragraph>Världens största miljöorganisation med sex miljoner supportrar globalt och 200 000 i Sverige</Paragraph>
                </IconSection>
                <IconSection>
                    <IconWrapper>                
                        <a href="https://www.climateview.global/" target="_blank" rel="noreferrer"><ClimateView /></a>
                    </IconWrapper>
                    <Paragraph>Ett internationellt teknikföretag som hjälper kommuner att planera och analysera klimatarbetet</Paragraph>
                </IconSection>
                <IconSection>
                    <IconWrapper>
                        <a href="https://varabarnsklimat.se/" target="_blank" rel="noreferrer"><VBK /></a>
                    </IconWrapper>
                    <Paragraph>Samlar föräldrar och andra vuxna för att lyfta fram barnens perspektiv i klimatfrågan</Paragraph>
                </IconSection>
                <IconSection>
                    <IconWrapper>
                        <a href="https://www.wedonthavetime.org/" target="_blank" rel="noreferrer"><WeDontHaveTime /></a>
                    </IconWrapper>
                    <Paragraph>Världens största sociala nätverk för klimataktion. Skapa din egen kampanj här (<a href="https://www.wedonthavetime.org/" target="_blank" rel="noreferrer">www.wedonthavetime.org</a>)</Paragraph>
                </IconSection>
                <IconSection>
                    <IconWrapper>
                        <a href="https://www.klimatklubben.se/" target="_blank" rel="noreferrer"><Klimatklubben /></a>
                    </IconWrapper>
                    <Paragraph>Ett nätverk som arbetar för att klimatfrågan ska lyftas högst upp på agendan</Paragraph>
                </IconSection>
                <IconSection>
                    <IconWrapper>
                        <a href="https://argandpartners.com/" target="_blank" rel="noreferrer"><Argand /></a>
                    </IconWrapper>
                    <Paragraph>Investerar i klimatlösningar</Paragraph>
                </IconSection>
            </FlexSection>
        </ContentWrapper>
    </Wrapper>
  )
}

export default Footer
