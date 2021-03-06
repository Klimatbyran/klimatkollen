import styled from 'styled-components'
import { Paragraph, H5, ParagraphBold } from './Typography'
import { devices } from '../utils/devices'
import ClimateView from '../public/icons/climateview.svg'
import VBK from '../public/icons/vbk.svg'
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

  :hover {
    cursor: pointer;
  }
`

const ToggleSection = styled.div`
  display: flex;
  flex-direction: column;

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
            <HeaderSection onClick={() => setToggleFirst(!toggleFirst)}>
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
                  Klimatkollen visar utsl??ppen i landets kommuner j??mf??rt med
                  Parisavtalet, anpassad f??r att delas i sociala medier och l??sas i
                  mobilen. H??r kan du se hur det g??r med koldioxidutsl??ppen f??r Sverige
                  som helhet och f??r enskilda kommuner, samt den m??ngd koldioxid vi har
                  kvar att sl??ppa ut enligt Parisavtalet. Du kan ocks?? se hur mycket
                  (eller lite) utsl??ppen i din kommun minskar j??mf??rt med andra.
                </Paragraph>
                <Paragraph>
                  Klimatkollen ??r en process och vi ??r bara i b??rjan. Sj??lvklart ??r
                  Klimatkollen utvecklad med ??ppen k??llkod. Det betyder att du kan vara
                  med och utveckla och f??rb??ttra sajten via{' '}
                  <a
                    href="https://github.com/Klimatbyran/klimatkollen"
                    target="_blank"
                    rel="noreferrer">
                    v??rt Github-repo.
                  </a>{' '}
                  Eller skriv upp dig <a href="#signup">h??r</a> s?? ber??ttar vi n??r vi
                  sl??pper n??got nytt.
                </Paragraph>
                <Paragraph>
                  <b>St??tta oss!</b> Skicka ett mejl till{' '}
                  <a href="mailto:hej@klimatkollen.se">hej@klimatkollen.se</a> s?? ber??ttar
                  vi hur du kan bidra.
                </Paragraph>
                <Paragraph>
                  Klimatkollen baseras p?? offentliga k??llor och annan fullt redovisad
                  data. Vi anger alla k??llor tydligt s?? att du enkelt kan kolla upp och
                  l??sa mer. Om n??got blivit fel, mejla oss g??rna p??{' '}
                  <a href="mailto:hej@klimatkollen.se">hej@klimatkollen.se</a> s?? att vi
                  kan ??ndra.
                </Paragraph>
                <Paragraph>
                  Klimatkollen ??r utvecklad av Klimatbyr??n ideell f??rening med hj??lp av{' '}
                  <a href="https://iteam.se/" target="_blank" rel="noreferrer">
                    Iteam
                  </a>{' '}
                  och{' '}
                  <a href="https://varabarnsklimat.se/" target="_blank" rel="noreferrer">
                    V??ra barns klimat.
                  </a>{' '}
                  Vi tror p?? kraften i att visualisera data p?? ett enkelt och tilltalande
                  s??tt. P?? det s??ttet vill vi bidra till en mer faktabaserad klimatdebatt
                  och ??tg??rder som minskar utsl??ppen i linje med Parisavtalet.
                </Paragraph>
              </ToggleSection>
            )}
          </TextSection>
          <TextSection>
            <HeaderSection onClick={() => setToggleSecond(!toggleSecond)}>
              <H5>
                We <Emoji symbol="??????" label="heart" /> Parisavtalet
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
                  Parisavtalet ??r ett juridiskt bindande avtal mellan v??rldens l??nder om
                  att begr??nsa den globala uppv??rmningen till v??l under 2 grader med sikte
                  p?? 1,5 grader.
                </Paragraph>
                <Paragraph>
                  F??r att n?? m??let m??ste v??rlden som helhet halvera v??xthusgasutsl??ppen
                  till 2030 och n?? n??ra noll utsl??pp senast 2050.
                </Paragraph>
                <Paragraph>
                  Enligt Parisavtalet ska rika l??nder, som historiskt sett sl??ppt ut
                  mycket v??xthusgaser, ta ett st??rre ansvar f??r att genomf??ra
                  klimatomst??llningen. D??r ing??r Sverige, som b??de ska g?? f??re n??r det
                  g??ller f?? ner utsl??ppen, men ocks?? hj??lpa mer s??rbara l??nder att st??lla
                  om. I Sverige st??ds Parisavtalet av alla partier i riksdagen.
                </Paragraph>
                <Paragraph>
                  L??s mer om Parisavtalet hos v??r samarbetspartner{' '}
                  <a href="https://www.wwf.se/rapport/ipcc/#parisavtalet" target="_blank" rel="noreferrer">
                    WWF
                  </a>
                  .
                </Paragraph>
              </ToggleSection>
            )}
          </TextSection>
          <TextSection>
            <HeaderSection onClick={() => setToggleThird(!toggleThird)}>
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
                  En koldioxidbudget ??r den m??ngd koldioxid vi har kvar att sl??ppa ut
                  innan vi riskerar att ??ka temperaturen s?? mycket att det bryter mot
                  Parisavtalet. Det ??r ett s??tt att ??sk??dligg??ra utsl??ppsutrymmet som
                  finns kvar om vi ska h??lla uppv??rmningen under 1,5 grader. FN:s
                  klimatpanel, IPCC har tagit fram koldioxidbudgetar f??r vilken m??ngd
                  utsl??pp som motsvarar vilka temperatur??kningar, med olika niv??er av
                  sannolikhet. Klimatkollen visar hur en s??dan budget kan f??rdelas f??r
                  Sverige och v??ra kommuner.
                </Paragraph>
                <Paragraph>
                  F??r att vara i linje med Parisavtalet och koldioxidbudgeten som
                  motsvarar 1,5 graders uppv??rmning kr??vs en ??rlig nationell
                  utsl??ppsminskning med 21 procent fr??n 2022. Sedan 1990 har Sveriges
                  utsl??pp minskat med 35 procent totalt, eller drygt en procent per ??r.
                  Lokalt skiljer sig utsl??ppen, trenden och d??rmed koldioxidbudgeten ??t
                  fr??n kommun till kommun, vilket g??r att den n??dv??ndiga minskningstakten
                  ocks?? varierar.
                </Paragraph>
                <Paragraph>
                  Vi har valt att visa en koldioxidbudget f??r utsl??pp inom Sveriges
                  gr??nser, f??r att det ??r s?? v??rldens l??nder rapporterar inom
                  klimatkonventionen. Sverige har ??ven h??g klimatbelastning fr??n de varor
                  som vi importerar fr??n andra l??nder och bidrar d??rf??r till utsl??pp i
                  andra delar av v??rlden. Dessa konsumtionsbaserade utsl??pp ??r inte
                  medr??knade i Klimatkollens koldioxidbudget.
                </Paragraph>
                <Paragraph>
                  Den nationella koldioxidbudgeten ber??knas av Uppsala Universitet med grund i den s?? 
                  kallade Tyndall-modellen och f??rdelas sedan ut p?? kommunerna av ClimateView. 
                  L??s mer om hur koldioxidbudgeten ??r ber??knad{' '}
                  <a
                    href="/Paris_compliant_Swedish_CO2_budgets-March_2022-Stoddard&Anderson.pdf"
                    target="_blank"
                    rel="noreferrer">
                    h??r.
                  </a>
                </Paragraph>
              </ToggleSection>
            )}
          </TextSection>
          <TextSection>
            <ParagraphBold>Vill du f?? nyheter om Klimatkollen?</ParagraphBold>
            <NewsletterSubscribe />
          </TextSection>
          <TextSection>
            <H5>V??ra samarbetspartners</H5>
          </TextSection>
          <FlexSection>
            <IconSection>
              <IconWrapper>
                <a href="https://www.wwf.se/" target="_blank" rel="noreferrer">
                  <Image src={'/WWF_Logo_Small_RGB_72dpi.jpg'} width={86} height={97} />
                </a>
              </IconWrapper>
              <LogoParagraph>
                Global milj??organisation med 200 000 svenska supportrar.
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
                Hj??lper kommuner och st??der att planera och analysera klimatarbetet.
              </LogoParagraph>
            </IconSection>
            <IconSection>
              <IconWrapper>
                <a href="https://varabarnsklimat.se/" target="_blank" rel="noreferrer">
                  <VBK />
                </a>
              </IconWrapper>
              <LogoParagraph>
                En ideell p??verkansorganisation som tar fajten f??r barns r??ttigheter i
                klimatomst??llningen.
              </LogoParagraph>
            </IconSection>
            <IconSection>
              <IconWrapper>
                <a href="https://www.klimatklubben.se/" target="_blank" rel="noreferrer">
                  <img src="/icons/klimatklubben.svg" alt="Klimatklubben logo" />
                </a>
              </IconWrapper>
              <LogoParagraph>
                Samlar m??nniskor f??r att skapa opinion och klimatengagemang.
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
                V??rldens st??rsta sociala n??tverk f??r klimataktion. Skapa din egen kampanj{' '}
                <a
                  href="https://www.wedonthavetime.org/"
                  target="_blank"
                  rel="noreferrer">
                  h??r
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
              <LogoParagraph>Investerar i klimatl??sningar.</LogoParagraph>
            </IconSection>
            <IconSection>
              <IconWrapper>
                <a href="https://www.stormgeo.com/" target="_blank" rel="noreferrer">
                  <StormGeo />
                </a>
              </IconWrapper>
              <LogoParagraph>
                Skandinaviens f??rsta privata v??derf??retag, en global leverant??r av
                v??dertj??nster.
              </LogoParagraph>
            </IconSection>
          </FlexSection>
          <Copyright>
            CC BY-NC-SA -{' '}
            <a
              href="http://creativecommons.org/licenses/by-nc-sa/4.0/"
              target="_blank"
              rel="noreferrer license">
              Attribution-NonCommercial-ShareAlike 4.0 International license
            </a>
          </Copyright>
          <GHLink>
            Klimatkollen ??r{' '}
            <a
              href="https://github.com/Klimatbyran/klimatkollen"
              target="_blank"
              rel="noreferrer">
              ??ppen k??llkod
            </a>
          </GHLink>
        </ContentWrapper>
      </Foot>
    </PageWrapper>
  )
}

export default Footer
