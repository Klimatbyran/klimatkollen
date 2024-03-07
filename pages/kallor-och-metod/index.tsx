/* eslint-disable no-trailing-spaces */
import { GetServerSideProps } from 'next'
import { ReactElement } from 'react'
import styled from 'styled-components'

import MetaTags from '../../components/MetaTags'
import { H2, Paragraph } from '../../components/Typography'
import { ClimateDataService } from '../../utils/climateDataService'
import PageWrapper from '../../components/PageWrapper'
import Layout from '../../components/Layout'
import Footer from '../../components/Footer/Footer'
import ToggleSection from '../../components/ToggleSection'

const Container = styled.section`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
`

const AiryParagraph = styled(Paragraph)`
  margin-bottom: 32px;
`

function KoM() {
  return (
    <>
      <MetaTags
        title="Källor och metod"
        description="Om Klimatkollens källor och metod"
      />
      <PageWrapper backgroundColor="black">
        <Container>
          <H2>Källor och metod</H2>
          <AiryParagraph>
            Vår utgångspunkt är Parisavtalets 1,5-gradersmål och våra datakällor är
            offentliga. Klicka på rubrikerna för att läsa mer.
          </AiryParagraph>
          <ToggleSection
            header="Klimatkollen utgår från Parisavtalet"
            text={(
              <>
                <Paragraph>
                  Parisavtalet är ett juridiskt bindande avtal mellan världens länder om
                  att vidta åtgärder för att begränsa den globala uppvärmningen till väl
                  under 2 grader, med sikte på 1,5 grader.
                </Paragraph>
                <Paragraph>
                  För att nå målet måste världens länder halvera växthusgasutsläppen till
                  2030 jämfört med 1990 och nå nära noll utsläpp senast 2050. I dag
                  {' '}
                  <a
                    href="https://www.iea.org/reports/co2-emissions-in-2022"
                    target="_blank"
                    rel="noreferrer"
                  >
                    ökar
                  </a>
                  {' '}
                  fortfarande utsläppen globalt.
                </Paragraph>
                <Paragraph>
                  Enligt Parisavtalet ska rika länder ta ett större ansvar, eftersom deras
                  stora historiska utsläpp innebär att de redan använt mycket av det
                  utsläppsutrymme som återstår för att hejda uppvärmningen. Bland dessa
                  länder ingår Sverige, som både ska gå före med att minska utsläppen och
                  även hjälpa andra mer sårbara länder att ställa om.
                </Paragraph>
                <Paragraph>
                  Läs mer om Parisavtalet på
                  {' '}
                  <a
                    href="https://www.naturvardsverket.se/parisavtalet"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Naturvårdsverkets webbplats
                  </a>
                  .
                </Paragraph>
              </>
            )}
          />
          <ToggleSection
            header="Om våra källor"
            text={(
              <>
                <Paragraph>
                  Klimatkollen baseras på offentliga källor och verifierad data. Vi anger
                  alla källor så att du enkelt kan kolla upp och läsa mer. Om något blivit
                  fel, mejla oss gärna på
                  {' '}
                  <a href="mailto:hej@klimatkollen.se">hej@klimatkollen.se</a>
                  {' '}
                  så att vi
                  kan ändra.
                </Paragraph>
                <Paragraph>
                  Statistik om koldioxidutsläpp hämtas från
                  {' '}
                  <a
                    href="https://nationellaemissionsdatabasen.smhi.se/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Nationella emissionsdatabasen
                  </a>
                  , som hanteras av SMHI och utgår från Sveriges officiella
                  utsläppsstatistik, med Naturvårdsverket som ansvarig myndighet. Kommunal
                  utsläppsdata har 1,5–2 års fördröjning, 2021 års siffror släpptes i juli 2023.
                </Paragraph>
                <Paragraph>
                  Uppgifter om politiskt styre i kommunerna hämtas från
                  {' '}
                  <a
                    href="https://skr.se/skr/demokratiledningstyrning/valmaktfordelning/valresultatstyren/styrekommunereftervalet2022.69547.html"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Sveriges Kommuner och Regioner
                  </a>
                  . Från
                  {' '}
                  <a
                    href="https://www.wikidata.org/wiki/Wikidata:Country_subdivision_task_force/Sweden/Municipalities"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Wikidata
                  </a>
                  {' '}
                  hämtar vi kommunernas invånarantal och kommunvapen. Statistiken om andel
                  laddbara bilar kommer från
                  {' '}
                  <a
                    href="https://www.trafa.se/vagtrafik/fordon/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Trafikanalys
                  </a>
                  .
                  Cykelvägsdata tas från Trafikverkets
                  {' '}
                  <a
                    href="https://nvdb2012.trafikverket.se/SeTransportnatverket"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Nationella vägdatabas
                  </a>
                  . För hushållens konsumtionsbaserade utsläpp kommer data från
                  {' '}
                  <a
                    href="https://www.sei.org/tools/konsumtionskompassen/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Stockholm Environment Institute
                  </a>
                  .
                </Paragraph>
              </>
            )}
          />
          <ToggleSection
            header="Om koldioxidbudgetar"
            text={(
              <>
                <Paragraph>
                  En koldioxidbudget anger hur mycket koldioxid som kan släppas ut innan koldioxidhalten
                  i atmosfären blir så hög att uppvärmningen överstiger Parisavtalets 1,5-gradersmål.
                </Paragraph>
                <Paragraph>
                  Enligt en ny
                  {' '}
                  <a
                    href="http://www.cemus.uu.se/wp-content/uploads/2023/12/Paris-compliant-carbon-budgets-for-Swedens-counties-.pdf"
                    target="_blank"
                    rel="noreferrer"
                  >
                    beräkning
                  </a>
                  {' '}
                  av forskare vid Uppsala universitet och Tyndall Centre i Storbritannien,
                  återstår globalt cirka 340 gigaton koldioxid från och med år 2024 för 50 procents chans att hålla
                  uppvärmningen under 1,5 grader. Med dagens utsläppstakt tar budgeten slut om cirka åtta år. 
                </Paragraph>
                <Paragraph>
                  Utifrån den globala budgeten har forskarna även gjort en beräkning av hur en nationel
                  koldioxidbudget för en rättvis klimatomställning skulle se ut för Sverige.
                </Paragraph>
                <Paragraph>
                  Beräkningen visar att från och med januari 2024 återstår ett utsläppsutrymme på 80 miljoner ton
                  för att ligga i linje med 1,5 grader. För 83 procents chans att inte överskrida 2 grader är budgeten 285 miljoner ton.
                  Som jämförelse var de territoriella utsläppen år 2022 51,1 miljoner ton (inklusive gasläckan i Nord Stream).
                </Paragraph>
                <Paragraph>
                  Det innebär att med Sveriges nuvarande utsläppstakt återstår 1,8 år av 1,5-gradersbudgeten, 6,4 år för 2 grader.
                  För att vara i linje med 1,5 grader skulle utsläppen i Sverige behöva minska med drygt 35 procent från och med 2024,
                  eller 13,5 procent för 2 grader.
                </Paragraph>
                <Paragraph>
                  Klimatkollen har fördelat ut den nya nationella koldioxidbudgeten på landets kommuner med
                  samma fördelningsnyckel som använts för att bryta ner den globala budgeten nationellt.
                </Paragraph>
                <Paragraph>
                  De lokala koldioxidbudgetarna gör det möjligt att jämföra hur det går med utsläppen med hur det borde gå.
                  På Klimatkollen visas koldioxidbudgetar för kommunerna både med siffror och som utvecklingskurva över hur utsläppen
                  behöver minska för att vara i linje med Parisavtalet.
                </Paragraph>
                <Paragraph>
                  Förutom Tyndall-modellen som Klimatkollen använder finns även andra sätt att beräkna en
                  nationell koldioxidbudget, se exempelvis
                  {' '}
                  <a
                    href="https://research.chalmers.se/publication/530543/file/530543_Fulltext.pdf"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Chalmers här
                  </a>
                  .
                </Paragraph>
              </>
            )}
          />
          <ToggleSection
            header="Om olika typer av utsläpp"
            text={(
              <>
                <Paragraph>
                  Klimatkollen är en oberoende faktaplattform som följer allmän och
                  vedertagen standard för hur utsläpp redovisas. Den klimatdata vi visar
                  speglar de avgränsningar som följer av hur koldioxidbudgeten är
                  beräknad. Exempelvis går det inte att rakt av koppla koldioxidbudgetar
                  till utsläpp av alla växthusgaser, där även metan, lustgas, vattenånga
                  med flera inkluderas.
                </Paragraph>
                <Paragraph>
                  Utsläpp från cementproduktion är exkluderat i IPCC:s globala
                  koldioxidbudget och därmed även i koldioxidbudgeten för Sverige och i
                  utsläppsstatistiken för de tre kommunerna Gotland, Skövde och
                  Mörbylånga, där cementproduktion sker idag eller skett tidigare under perioden.
                </Paragraph>
                <Paragraph>
                  Sverige har även hög klimatbelastning från varor vi importerar från
                  andra länder och orsakar därför utsläpp i andra delar av världen. Dessa
                  konsumtionsbaserade utsläpp inkluderas inte i koldioxidbudgeten.
                </Paragraph>
                <Paragraph>
                  Inte heller utsläpp från skog och mark (så kallade biogena utsläpp)
                  inkluderas i koldioxidbudgeten.
                </Paragraph>
                <Paragraph>
                  Egentligen är alltså de klimatpåverkande utsläppen mycket större än de
                  territoriella fossila koldioxidutsläpp som vanligtvis rapporteras av
                  myndigheter och i media och som idag visas på Klimatkollen.
                </Paragraph>
                <Paragraph>
                  Klimatkollen undersöker nu hur även andra växthusgasutsläpp skulle kunna
                  visas på webbplatsen framöver, samtidigt som möjligheten att jämföra
                  dagens utsläpp med koldioxidbudgetar behålls.
                </Paragraph>
              </>
            )}
          />
        </Container>
      </PageWrapper>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const municipalities = new ClimateDataService().getMunicipalities()
  if (municipalities.length < 1) throw new Error('No municipalities found')

  res.setHeader(
    'Cache-Control',
    `public, stale-while-revalidate=60, max-age=${60 * 60 * 24 * 7}`,
  )

  return {
    props: { municipalities },
  }
}

export default KoM

KoM.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
      <Footer />
    </>
  )
}
