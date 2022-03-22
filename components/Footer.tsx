import styled from 'styled-components'
import { Paragraph, H5, ParagraphBold } from './Typography'
import { devices } from '../utils/devices'
import ClimateView from '../public/icons/climateview.svg'
import VBK from '../public/icons/vbk.svg'
import WeDontHaveTime from '../public/icons/we-dont-have-time.svg'
import Argand from '../public/icons/argand.svg'
import StormGeo from '../public/icons/stormgeo.svg'
import NewsletterSubscribe from './NewsletterSubscribe'
import Emoji from './Emoji'
import ArrowDown from '../public/icons/arrow-down-round.svg'
import ArrowUp from '../public/icons/arrow-up-green.svg'
import { useState, useEffect } from 'react'
import PageWrapper from './PageWrapper'
import { useRouter } from 'next/router'
import Image from 'next/image'

const Foot = styled.footer`
  width: 100%;
  display: flex;

  @media only screen and (${devices.tablet}) {
    justify-content: center;
  }
`

const ContentWrapper = styled.div`
  flex: 1 1 0;
`

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;

  & .arrow {
    display: block;
  }
`

const ToggleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;

  .mobile {
    background: black;
  }

  .desktop {
    background: yellow;
  }
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
  align-items: center;
  gap: 60px 28px;

  @media only screen and (${devices.tablet}) {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: space-between;
  }
`

const IconSection = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;
  gap: 15px;

  @media only screen and (${devices.tablet}) {
    flex: 0 1 350px;
  }
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
`

const LogoParagraph = styled(Paragraph)`
  max-width: 350px;
  text-align: center;
`

const Copyright = styled.p`
  color: ${({ theme }) => theme.lightGrey};
  font-size: 13px;
  text-align: center;
  margin-top: 4rem;
`

const GHLink = styled.p`
  color: ${({ theme }) => theme.lightGrey};
  font-size: 13px;
  text-align: center;
`

const Footer = () => {
  const router = useRouter()
  console.log(router)
  const [toggleFirst, setToggleFirst] = useState(false)
  const [toggleSecond, setToggleSecond] = useState(false)
  const [toggleThird, setToggleThird] = useState(
    router.asPath.includes('#source-budget-expl'),
  )
  const [toggleFourth, setToggleFourth] = useState()

  // const resizeHandler = () => {
  //   if (window.innerWidth >= 768) {
  //     setToggleFirst(true)
  //     setToggleSecond(true)
  //     setToggleThird(true)
  //   }
  // }

  // useEffect(() => {
  //   window.onresize = resizeHandler
  //   resizeHandler()
  // }, [])

  return (
    <PageWrapper backgroundColor="dark">
      <Foot>
        <ContentWrapper>
          <TextSection>
            <HeaderSection>
              <H5>Om Klimatkollen</H5>
              {toggleFirst ? (
                <ArrowUp className="arrow" onClick={() => setToggleFirst(!toggleFirst)} />
              ) : (
                <ArrowDown
                  className="arrow"
                  onClick={() => setToggleFirst(!toggleFirst)}
                />
              )}
            </HeaderSection>
            {toggleFirst && (
              <ToggleSection>
                <Paragraph>
                  Klimatkollen visar utsläppen i landets kommuner jämfört med
                  Parisavtalet, anpassad för att delas i sociala medier och läsas i
                  mobilen. Här kan du se hur det går med koldioxidutsläppen för Sverige
                  som helhet och för enskilda kommuner, samt den mängd koldioxid vi har
                  kvar att släppa ut enligt Parisavtalet. Du kan också se hur mycket
                  (eller lite) utsläppen i din kommun minskar jämfört med andra.
                </Paragraph>
                <Paragraph>
                  Klimatkollen är en process och vi är bara i början. Självklart är
                  Klimatkollen utvecklad med öppen källkod. Det betyder att du kan vara
                  med och utveckla och förbättra sajten via{' '}
                  <a
                    href="https://github.com/Klimatbyran/klimatkollen"
                    target="_blank"
                    rel="noreferrer">
                    vårt Github-repo.
                  </a>{' '}
                  Eller skriv upp dig <a href="#signup">här</a> så berättar vi när vi
                  släpper något nytt.
                </Paragraph>
                <Paragraph>
                  <b>Stötta oss!</b> Skicka ett mejl till{' '}
                  <a href="mailto:hej@klimatkollen.se">hej@klimatkollen.se</a> så berättar
                  vi hur du kan bidra.
                </Paragraph>
                <Paragraph>
                  Klimatkollen baseras på offentliga källor och annan fullt redovisad
                  data. Vi anger alla källor tydligt så att du enkelt kan kolla upp och
                  läsa mer. Om något blivit fel, mejla oss gärna på{' '}
                  <a href="mailto:hej@klimatkollen.se">hej@klimatkollen.se</a> så att vi
                  kan ändra.
                </Paragraph>
                <Paragraph>
                  Klimatkollen är utvecklad av Klimatbyrån ideell förening med hjälp av{' '}
                  <a href="https://iteam.se/" target="_blank" rel="noreferrer">
                    Iteam
                  </a>{' '}
                  och{' '}
                  <a href="https://varabarnsklimat.se/" target="_blank" rel="noreferrer">
                    Våra barns klimat.
                  </a>{' '}
                  Vi tror på kraften i att visualisera data på ett enkelt och tilltalande
                  sätt. På det sättet vill vi bidra till en mer faktabaserad klimatdebatt
                  och åtgärder som minskar utsläppen i linje med Parisavtalet.
                </Paragraph>
              </ToggleSection>
            )}
          </TextSection>
          <TextSection>
            <HeaderSection>
              <H5>
                We <Emoji symbol="❤️" label="heart" /> Parisavtalet
              </H5>
              {toggleSecond ? (
                <ArrowUp
                  className="arrow"
                  onClick={() => setToggleSecond(!toggleSecond)}
                />
              ) : (
                <ArrowDown
                  className="arrow"
                  onClick={() => setToggleSecond(!toggleSecond)}
                />
              )}
            </HeaderSection>
            {toggleSecond && (
              <ToggleSection>
                <Paragraph>
                  Parisavtalet är ett juridiskt bindande avtal mellan världens länder om
                  att begränsa den globala uppvärmningen till väl under 2 grader med sikte
                  på 1,5 grader.
                </Paragraph>
                <Paragraph>
                  För att nå målet måste världen som helhet halvera växthusgasutsläppen
                  till 2030 och nå nära noll utsläpp senast 2050.
                </Paragraph>
                <Paragraph>
                  Enligt Parisavtalet ska rika länder, som historiskt sett släppt ut
                  mycket växthusgaser, ta ett större ansvar för att genomföra
                  klimatomställningen. Där ingår Sverige, som både ska gå före när det
                  gäller få ner utsläppen, men också hjälpa mer sårbara länder att ställa
                  om. I Sverige stöds Parisavtalet av alla partier i riksdagen.
                </Paragraph>
                <Paragraph>
                  Läs mer om Parisavtalet hos vår samarbetspartner{' '}
                  <a href="https://wwf.se/klimat" target="_blank" rel="noreferrer">
                    WWF
                  </a>
                  .
                </Paragraph>
              </ToggleSection>
            )}
          </TextSection>
          <TextSection>
            <HeaderSection>
              <H5 id="source-budget-expl">Om koldioxidbudgetar</H5>
              {toggleThird ? (
                <ArrowUp className="arrow" onClick={() => setToggleThird(!toggleThird)} />
              ) : (
                <ArrowDown
                  className="arrow"
                  onClick={() => setToggleThird(!toggleThird)}
                />
              )}
            </HeaderSection>
            {toggleThird && (
              <ToggleSection>
                <Paragraph>
                  En koldioxidbudget är den mängd koldioxid vi har kvar att släppa ut
                  innan vi riskerar att öka temperaturen så mycket att det bryter mot
                  Parisavtalet. Det är ett sätt att åskådliggöra utsläppsutrymmet som
                  finns kvar om vi ska hålla uppvärmningen under 1,5 grader. FN:s
                  klimatpanel, IPCC har tagit fram koldioxidbudgetar för vilken mängd
                  utsläpp som motsvarar vilka temperaturökningar, med olika nivåer av
                  sannolikhet. Klimatkollen visar hur en sådan budget kan fördelas för
                  Sverige och våra kommuner.
                </Paragraph>
                <Paragraph>
                  För att vara i linje med Parisavtalet och koldioxidbudgeten som
                  motsvarar 1,5 graders uppvärmning krävs en årlig nationell
                  utsläppsminskning med 21 procent från 2022. Sedan 1990 har Sveriges
                  utsläpp minskat med 35 procent totalt, eller drygt en procent per år.
                  Lokalt skiljer sig utsläppen, trenden och därmed koldioxidbudgeten åt
                  från kommun till kommun, vilket gör att den nödvändiga minskningstakten
                  också varierar.
                </Paragraph>
                <Paragraph>
                  Vi har valt att visa en koldioxidbudget för utsläpp inom Sveriges
                  gränser, för att det är så världens länder rapporterar inom
                  klimatkonventionen. Sverige har även hög klimatbelastning från de varor
                  som vi importerar från andra länder och bidrar därför till utsläpp i
                  andra delar av världen. Dessa konsumtionsbaserade utsläpp är inte
                  medräknade i Klimatkollens koldioxidbudget.
                </Paragraph>
                <Paragraph>
                  Den nationella koldioxidbudgeten beräknas av Uppsala Universitet enligt
                  Tyndall-modellen och fördelas sedan ut på kommunerna av ClimateView. Läs
                  mer om hur koldioxidbudgeten är beräknad{' '}
                  <a
                    href="/Paris_compliant_Swedish_CO2_budgets-March_2022-Stoddard&Anderson.pdf"
                    target="_blank"
                    rel="noreferrer">
                    här.
                  </a>
                </Paragraph>
              </ToggleSection>
            )}
          </TextSection>
          <TextSection>
            <ParagraphBold>Vill du få nyheter om Klimatkollen?</ParagraphBold>
            <NewsletterSubscribe />
          </TextSection>
          <TextSection>
            <H5>Våra samarbetspartners</H5>
          </TextSection>
          <FlexSection>
            <IconSection>
              <IconWrapper>
                <a href="https://www.wwf.se/" target="_blank" rel="noreferrer">
                  <Image src={'/WWF_Logo_Small_RGB_72dpi.jpg'} width={86} height={97} />
                </a>
              </IconWrapper>
              <LogoParagraph>
                Global miljöorganisation med 200 000 svenska supportrar.
              </LogoParagraph>
            </IconSection>
            <IconSection>
              <IconWrapper>
                <a
                  href="https://www.climateview.global/"
                  target="_blank"
                  rel="noreferrer">
                  <ClimateView />
                </a>
              </IconWrapper>
              <LogoParagraph>
                Hjälper kommuner och städer att planera och analysera klimatarbetet.
              </LogoParagraph>
            </IconSection>
            <IconSection>
              <IconWrapper>
                <a href="https://varabarnsklimat.se/" target="_blank" rel="noreferrer">
                  <VBK />
                </a>
              </IconWrapper>
              <LogoParagraph>
                En ideell påverkansorganisation som tar fajten för barns rättigheter i
                klimatomställningen.
              </LogoParagraph>
            </IconSection>
            <IconSection>
              <IconWrapper>
                <a href="https://www.klimatklubben.se/" target="_blank" rel="noreferrer">
                  <img src="/icons/klimatklubben.svg" alt="Klimatklubben logo" />
                </a>
              </IconWrapper>
              <LogoParagraph>
                Samlar människor för att skapa opinion och klimatengagemang.
              </LogoParagraph>
            </IconSection>
            <IconSection>
              <IconWrapper>
                <a
                  href="https://www.wedonthavetime.org/"
                  target="_blank"
                  rel="noreferrer">
                  <img src="/icons/we-dont-have-time.svg" alt="Wedonthavetime logo" />
                </a>
              </IconWrapper>
              <LogoParagraph>
                Världens största sociala nätverk för klimataktion. Skapa din egen kampanj{' '}
                <a
                  href="https://www.wedonthavetime.org/"
                  target="_blank"
                  rel="noreferrer">
                  här
                </a>
                .
              </LogoParagraph>
            </IconSection>
            <IconSection>
              <IconWrapper>
                <a href="https://argandpartners.com/" target="_blank" rel="noreferrer">
                  <Argand />
                </a>
              </IconWrapper>
              <LogoParagraph>Investerar i klimatlösningar.</LogoParagraph>
            </IconSection>
            <IconSection>
              <IconWrapper>
                <a href="https://www.stormgeo.com/" target="_blank" rel="noreferrer">
                  <StormGeo />
                </a>
              </IconWrapper>
              <LogoParagraph>
                Skandinaviens första privata väderföretag, en global leverantör av
                vädertjänster.
              </LogoParagraph>
            </IconSection>
          </FlexSection>
          <Copyright>
            CC BY NC SA -{' '}
            <a
              href="http://creativecommons.org/licenses/by-nc-sa/4.0/"
              target="_blank"
              rel="noreferrer">
              Attribution-NonCommercial-ShareAlike 4.0 International license
            </a>
          </Copyright>
          <GHLink>
            Klimatkollen är{' '}
            <a
              href="https://github.com/Klimatbyran/klimatkollen"
              target="_blank"
              rel="noreferrer">
              öppen källkod
            </a>
          </GHLink>
        </ContentWrapper>
      </Foot>
    </PageWrapper>
  )
}

export default Footer
