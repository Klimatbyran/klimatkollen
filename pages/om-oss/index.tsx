import { GetServerSideProps } from 'next'
import { ReactElement } from 'react'
import styled from 'styled-components'

import MetaTags from '../../components/MetaTags'
import { H2, Paragraph } from '../../components/Typography'
import PageWrapper from '../../components/PageWrapper'
import Layout from '../../components/Layout'
import Footer from '../../components/Footer/Footer'
import {
  UnorderedList,
  ListItem,
  OrderedList,
  Grid,
  GridImage,
  GridItem,
} from '../../components/shared'
import ToggleSection from '../../components/ToggleSection'

const Ola = '/team/ola.jpg'
const Frida = '/team/frida.jpg'
const Elvira = '/team/elvira.jpg'
const Anna = '/board/anna.jpg'
const CJ = '/board/carl-johan.jpg'
const Christian = '/board/christian.jpg'
const Maria = '/board/maria.jpg'

const Container = styled.section`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
`

const AiryParagraph = styled(Paragraph)`
  margin-bottom: 32px;
`

function OmOss() {
  return (
    <>
      <MetaTags title="Om oss" description="Om Klimatkollen" />
      <PageWrapper backgroundColor="black">
        <Container>
          <H2>Om oss</H2>
          <AiryParagraph>
            Klimatkollen är en medborgarplattform som tillgängliggör klimatdata. Klicka på
            rubrikerna för att läsa mer.
          </AiryParagraph>
          <ToggleSection
            header="Vad är Klimatkollen?"
            text={(
              <>
                <Paragraph>
                  Klimatkollen är en medborgarplattform som tillgängliggör klimatdata och
                  bygger stöd för minskade utsläpp i linje med Parisavtalet.
                </Paragraph>
                <Paragraph>
                  Klimatkollen lanserades i mars 2022 och drivs av den ideella föreningen
                  Klimatbyrån.
                </Paragraph>
                <Paragraph>
                  I centrum står vår visualisering av hur det går med koldioxidutsläppen.
                  För det som spelar roll på sista raden är om utsläppen sjunker i den
                  takt som krävs för Parisavtalets 1,5-gradersmål, eller inte.
                </Paragraph>
                <Paragraph>
                  Vi tror på kraften i att presentera data på ett enkelt och tilltalande
                  sätt. Så bidrar vi till en mer faktabaserad klimatdebatt och till ökad
                  kunskap och klimatengagemang.
                </Paragraph>
                <Paragraph>
                  Läs mer om varför Klimatkollen behövs i
                  {' '}
                  <a
                    href="https://www.aktuellhallbarhet.se/alla-nyheter/debatt/darfor-behovs-klimatkollen/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    vår debattartikel här
                  </a>
                  .
                </Paragraph>
              </>
            )}
          />
          <ToggleSection
            header="Vad finns på Klimatkollen?"
            text={(
              <>
                <Paragraph>I dag kan du på Klimatkollen se:</Paragraph>
                <UnorderedList>
                  <ListItem>
                    Koldioxidbudgetar för landets alla 290 kommuner. Klimatkollen utgår
                    ifrån en
                    {' '}
                    <a
                      href="https://klimatkollen.se/Paris_compliant_Swedish_CO2_budgets-March_2022-Stoddard&Anderson.pdf"
                      target="_blank"
                      rel="noreferrer"
                    >
                      nationell koldioxidbudget
                    </a>
                    {' '}
                    som beräknats av forskare vid Uppsala universitet enligt
                    Tyndall-modellen och som sedan fördelats ut på kommunerna av
                    ClimateView.
                  </ListItem>
                  <ListItem>
                    En översikt i både kartvy och listvy över koldioxidutsläppen i landets
                    kommuner. Kommunerna rankas baserat på genomsnittlig årlig
                    utsläppsminskningstakt sedan Parisavtalet undertecknades 2015.
                  </ListItem>
                  <ListItem>
                    En visualisering av hur det gått med koldioxidutsläppen för varje
                    kommun från 1990 tills idag, hur det borde gå för att klara
                    Parisavtalets 1,5-gradersmål och en prognos för hur det går om
                    utsläppen i kommunen fortsätter att utvecklas som de senaste fem åren.
                  </ListItem>
                  <ListItem>
                    För varje kommun finns även annan nyckelfakta, som koldioxidbudget,
                    datum när budgeten tar slut med nuvarande utsläppstakt, politiskt
                    styre och koldioxidutsläpp per invånare.
                  </ListItem>
                </UnorderedList>
                Klimatkollen är utvecklad med öppen källkod. Det betyder att alla kan vara
                med och utveckla och förbättra sajten via vårt
                {' '}
                <a
                  href="https://github.com/Klimatbyran/klimatkollen"
                  target="_blank"
                  rel="noreferrer"
                >
                  Github-repo
                </a>
                .
              </>
            )}
          />
          <ToggleSection
            header="Vilka står bakom?"
            text={(
              <>
                <Paragraph>
                  Initiativtagare är Ola Spännar och Frida Berry Eklund, båda med lång
                  erfarenhet inom kommunikation och opinionsbildning. Vi tyckte att det
                  var alldeles för svårt att veta vad Parisavtalet innebär konkret för den
                  lokala klimatomställningen – och om det som görs räcker för att nå
                  1,5-gradersmålet. Därför startade vi Klimatkollen.
                </Paragraph>
                <Paragraph>
                  I Klimatkollens kärnteam idag finns förutom Ola och Frida även Elvira Boman,
                  Tech Lead. Många fler bidrar med stöd och råd på olika sätt.
                </Paragraph>
                <Paragraph>
                  Våra samarbetspartners under de första två åren har varit Världsnaturfonden WWF,
                  Postkodstiftelsen, PwC, ClimateView, Klimatklubben, Våra barns klimat,
                  Researchers’ Desk, Argand Partners och We Don’t Have Time.
                </Paragraph>
              </>
            )}
          />
          <ToggleSection
            header="Problemet vi löser"
            text={(
              <>
                <Paragraph>
                  Det finns mycket data därute som kan hjälpa oss att ta tempen på
                  klimatomställningen, men den är ofta komplex, svårförståelig eller
                  inlåst bakom betalvägg. Myndigheternas statistik om klimatutsläppen i
                  kommunerna släpar efter med nästan två års fördröjning. Så kan vi inte
                  ha det!
                </Paragraph>
                <Paragraph>
                  Vi jobbar för att göra klimatdata lättillgänglig för medborgare. Det
                  möjliggör ansvarsutkrävande och ger bränsle till nya digitala
                  innovationer som snabbar på klimatomställningen. . Vi behöver veta mer
                  om utsläppen, varifrån de kommer, vilka lösningar som genomförs i vilka
                  kommuner och vilken effekt dessa åtgärder kan få. Läs mer om det i
                  {' '}
                  <a
                    href="https://www.aktuellhallbarhet.se/alla-nyheter/debatt/med-battre-klimatdata-kan-vi-accelerera-klimatomstallningen/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    vår debattartikel
                  </a>
                  .
                </Paragraph>
              </>
            )}
          />
          <ToggleSection
            header="Stöd oss"
            text={(
              <>
                <Paragraph>
                  Klimatkollen finns till för – och drivs av – klimatintresserade
                  medborgare. Hos oss kan alla bidra. Du kan exempelvis hjälpa oss att
                  {' '}
                  <a
                    // eslint-disable-next-line max-len
                    href="https://www.linkedin.com/posts/ospannar_klimatkollens-kommundata-activity-7027238300889272320-wvS3?utm_source=share&utm_medium=member_desktop"
                    target="_blank"
                    rel="noreferrer"
                  >
                    hitta data
                  </a>
                  {' '}
                  som saknas, förbättra sajten via vårt
                  {' '}
                  <a
                    href="https://github.com/Klimatbyran/klimatkollen"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Github-repo
                  </a>
                  {' '}
                  och sprida Klimatkollen i dina nätverk.
                </Paragraph>
                <UnorderedList>
                  <ListItem>
                    Skriv upp dig på vårt nyhetsbrev (i formuläret längre ner på sidan)
                    så berättar vi när vi släpper något nytt.
                  </ListItem>
                  <ListItem>
                    Skänk en slant! Varje krona ger oss muskler att visa upp mer data.
                    Vårt bankgiro: 5793-3178
                  </ListItem>
                  <ListItem>
                    Ge av din kompetens? Skicka ett mejl till
                    {' '}
                    <a href="mailto:hej@klimatkollen.se">hej@klimatkollen.se</a>
                  </ListItem>
                </UnorderedList>
              </>
            )}
          />
          <ToggleSection
            header="Vårt team"
            text={(
              <Grid>
                <GridItem>
                  <GridImage
                    src={Ola}
                    alt="Ola Spännar"
                    width="200"
                    height="200"
                  />
                  <b>Ola Spännar</b>
                  {' '}
                  Opinionsbildare, medgrundare av Klimatkollen,
                  tidigare kommunikationschef på Centerpartiet och kundansvarig på
                  Forsman & Bodenfors.
                </GridItem>
                <GridItem>
                  <GridImage
                    src={Frida}
                    alt="Frida Berry Eklund"
                    width="200"
                    height="200"
                  />
                  <b>Frida Berry Eklund</b>
                  {' '}
                  Klimatspecialist och medgrundare till
                  Klimatkollen. Initiativtagare till Our Kids’ Climate och författare
                  till boken “Prata med barn om klimatet” (Natur & Kultur). EU Climate
                  Pact Ambassador och Climate Reality Leader.
                </GridItem>
                <GridItem>
                  <GridImage
                    src={Elvira}
                    alt="Elvira Boman"
                    width="200"
                    height="200"
                  />
                  <b>Elvira Boman</b>
                  Tech lead och teknisk fysiker på Klimatkollen
                  och Precisit. Lång erfarenhet av grön och cirkulär tech vid flera prisbelönta
                  startups och del av ledarteamet på IT-konsultbyrån Precisit.
                </GridItem>
              </Grid>
            )}
          />
          <ToggleSection
            header="Vår styrelse"
            text={(
              <>
                <Paragraph>
                  Klimatkollen drivs av den ideella föreningen, Klimatbyrån. I styrelsen
                  sitter:
                </Paragraph>
                <Grid>
                  <GridItem>
                    <GridImage
                      src={Christian}
                      alt="Christian Landgren"
                      width="200"
                      height="200"
                    />
                    <b>Christian Landgren</b>
                    {' '}
                    Digital entreprenör och en av Sveriges
                    mest inflytelserika personer inom tech. VD och grundare av Iteam och
                    Öppna skolplattformen.
                  </GridItem>
                  <GridItem>
                    <GridImage
                      src={Anna}
                      alt="Anna Loverus"
                      width="200"
                      height="200"
                    />
                    <b>Anna Loverus</b>
                    {' '}
                    Digital strateg och tidigare chef för sociala
                    medier på Spotify och H&M. VD och grundare av Better Odds.
                  </GridItem>
                  <GridItem>
                    <GridImage
                      src={Maria}
                      alt="Maria Soxbo"
                      width="200"
                      height="200"
                    />
                    <b>Maria Soxbo</b>
                    {' '}
                    Journalist, författare, föreläsare och grundare
                    av Klimatklubben. Utsedd till en av Sveriges 101
                    hållbarhetsmäktigaste 2021.
                  </GridItem>
                  <GridItem>
                    <GridImage
                      src={CJ}
                      alt="Carl-Johan Schultz"
                      width="200"
                      height="200"
                    />
                    <b>Carl-Johan Schultz</b>
                    {' '}
                    Hållbarhetsstrateg på Doings, tidigare
                    planner på Forsman & Bodenfors, författare till boken
                    ”Hållbariseringen”, Årets marknadsföringsbok 2022.
                  </GridItem>
                  <GridItem>
                    <GridImage
                      src={Ola}
                      alt="Ola Spännar"
                      width="200"
                      height="200"
                    />
                    <b>Ola Spännar</b>
                    {' '}
                    Opinionsbildare, medgrundare av Klimatkollen,
                    tidigare kommunikationschef på Centerpartiet och kundansvarig på
                    Forsman & Bodenfors.
                  </GridItem>
                  <GridItem>
                    <GridImage
                      src={Frida}
                      alt="Frida Berry Eklund"
                      width="200"
                      height="200"
                    />
                    <b>Frida Berry Eklund</b>
                    {' '}
                    Klimatspecialist och medgrundare till
                    Klimatkollen. Initiativtagare till Our Kids’ Climate och författare
                    till boken “Prata med barn om klimatet” (Natur & Kultur). EU Climate
                    Pact Ambassador och Climate Reality Leader.
                  </GridItem>
                </Grid>
                <Paragraph>
                  Här hittar du våra
                  {' '}
                  <a href="/stadgar.pdf" target="_blank" rel="noreferrer">
                    stadgar
                  </a>
                  {' '}
                  ,
                  {' '}
                  <a href="/uppforandekod.pdf" target="_blank" rel="noreferrer">
                    uppförandekod
                  </a>
                  {' '}
                  och
                  {' '}
                  <a href="antikorruptionspolicy.pdf" target="_blank" rel="noreferrer">
                    antikorruptionspolicy
                  </a>
                  .
                </Paragraph>
              </>
            )}
          />
          <ToggleSection
            header="Så finansieras vi"
            text={(
              <>
                <Paragraph>
                  Under 2023 har Klimatkollen drivits med
                  {' '}
                  <a
                    // eslint-disable-next-line max-len
                    href="https://www.mynewsdesk.com/se/klimatbyraan/pressreleases/klimatkollen-faar-stoed-av-postkodstiftelsen-och-rekryterar-toppnamn-3223979"
                    target="_blank"
                    rel="noreferrer"
                  >
                    stöd från Postkodstiftelsen
                  </a>
                  . Under 2024 och 2025 får Klimatkollen finansiell uppbackning av Google.org som en av två svenska mottagare av
                  {' '}
                  <a
                    // eslint-disable-next-line max-len
                    href="https://www.google.org/climate/impact-challenge/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Google.org Impact Challenge: Tech for Social Good
                  </a>
                  .
                </Paragraph>
                <Paragraph>
                  Mycket av arbetet är ideellt, därför välkomnar vi fler
                  samarbetspartners och ekonomiskt stöd för att kunna skala upp!
                </Paragraph>
                <Paragraph>
                  Uppstarten finansierades av Världsnaturfonden WWF, ClimateView, We Don’t
                  Have Time och Argand Partners.
                </Paragraph>
              </>
            )}
          />
          <ToggleSection
            header="Postkodprojektet"
            text={(
              <Paragraph>
                Under 2023 har Klimatkollen uppburit stöd av
                {' '}
                <a href="https://postkodstiftelsen.se/" target="_blank" rel="noreferrer">
                  Postkodstiftelsen
                </a>
                {' '}
                för att ta tempen på hur det går med klimatomställningen i kommunerna. I
                dag kan du se hur det går med koldioxidutsläppen. Nu visar vi även vad
                kommunerna gör för att minska dem. Vi utgår ifrån de största
                utsläppssektorerna och visar sedan hur det går med viktiga omställningar
                inom dessa sektorer, genom att presentera statistik om utvalda nyckeltal,
                ett nyckeltal per omställning.
              </Paragraph>
            )}
          />
          <ToggleSection
            header="Tidigare projekt"
            text={(
              <>
                <Paragraph>
                  Inför riksdagsvalet 2022 ansvarade Klimatkollen för två unika projekt för
                  att ge medborgare bättre koll på utsläppseffekterna av partiernas
                  klimatpolitik:
                </Paragraph>
                <OrderedList>
                  <ListItem>
                    <b>Klimatmål</b>
                    <br />
                    En
                    {' '}
                    <a href="/partierna">analys</a>
                    {' '}
                    av riksdagspartiernas klimatmål,
                    tillsammans med forskarnätverket Researchers’ Desk, Världsnaturfonden
                    WWF, Våra barns klimat och ClimateView, i samarbete med PwC och
                    Naturskyddsföreningen. Analysen visade att sex av åtta partier missar
                    Parisavtalets 1,5-gradersmål.
                  </ListItem>
                  <ListItem>
                    <b>Utsläppsberäkning</b>
                    <br />
                    <a href="/utslappsberakningar" rel="noreferrer">
                      Utsläppsberäkning
                    </a>
                    {' '}
                    av riksdagspartiernas politik gällande tolv centrala klimatåtgärder.
                    Bakom uträkningarna står Klimatkollen, Världsnaturfonden WWF,
                    ClimateView, Naturskyddsföreningen och Våra barns klimat.
                    Beräkningarna visade att den nya regeringens politik kan öka utsläppen
                    med 25 miljoner ton redan under mandatperioden 2022–2026.
                  </ListItem>
                </OrderedList>
              </>
            )}
          />
        </Container>
      </PageWrapper>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader(
    'Cache-Control',
    `public, stale-while-revalidate=60, max-age=${60 * 60 * 24 * 7}`,
  )

  return {
    props: {},
  }
}

export default OmOss

OmOss.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
      <Footer />
    </>
  )
}
