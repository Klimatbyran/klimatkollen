import { GetServerSideProps } from 'next'
import { ReactElement } from 'react'
import styled from 'styled-components'

import MetaTags from '../../components/MetaTags'
import { H2, Paragraph } from '../../components/Typography'
import { EmissionService } from '../../utils/emissionService'
import PageWrapper from '../../components/PageWrapper'
import Layout from '../../components/Layout'
import Footer from '../../components/Footer'
import { AiryH5, UnorderedList, ListItem, OrderedList } from '../../components/shared'

const Container = styled.section`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
`

const OmOss = () => {
  return (
    <>
      <MetaTags
        title='Om oss'
        description='Om Klimatkollen'
      />
      <PageWrapper backgroundColor='black'>
        <Container>
          <H2>
            Om oss
          </H2>
          <AiryH5>
            Vad är Klimatkollen?
          </AiryH5>
          <Paragraph>
            Klimatkollen är en medborgarplattform som tillgängliggör klimatdata och bygger stöd för minskade utsläpp
            i linje med Parisavtalet. Klimatkollen lanserades i mars 2022 och drivs av den ideella föreningen Klimatbyrån.
          </Paragraph>
          <Paragraph>
            I centrum står vår visualisering av hur det går med koldioxidutsläppen. För det som spelar roll på sista
            raden är om utsläppen sjunker i den takt som krävs för Parisavtalets 1,5-gradersmål, eller inte.
          </Paragraph>
          <Paragraph>
            Vi tror på kraften i att presentera data på ett enkelt och tilltalande sätt. Så bidrar vi till en mer faktabaserad
            klimatdebatt och till ökad kunskap och klimatengagemang.
          </Paragraph>
          <Paragraph>
            Läs mer om varför Klimatkollen behövs i{' '}
            <a href='https://www.aktuellhallbarhet.se/alla-nyheter/debatt/darfor-behovs-klimatkollen/'>
              vår debattartikel här
            </a>.
          </Paragraph>
          <Paragraph>
            I dag kan du på Klimatkollen se:
            <UnorderedList>
              <ListItem>
                Koldioxidbudgetar för landets alla 290 kommuner. Klimatkollen utgår ifrån en{' '}
                <a href='https://klimatkollen.se/Paris_compliant_Swedish_CO2_budgets-March_2022-Stoddard&Anderson.pdf'>
                  nationell koldioxidbudget
                </a>{' '}
                som beräknats av forskare vid Uppsala universitet enligt Tyndall-modellen och som sedan fördelats ut på kommunerna av ClimateView.
              </ListItem>
              <ListItem>
                En översikt i både kartvy och listvy över koldioxidutsläppen i landets kommuner. Kommunerna rankas baserat på
                genomsnittlig årlig utsläppsminskningstakt sedan Parisavtalet undertecknades 2015.
              </ListItem>
              <ListItem>
                En visualisering av hur det gått med koldioxidutsläppen för varje kommun från 1990 tills idag,
                hur det borde gå för att klara Parisavtalets 1,5-gradersmål och en prognos för hur det går om utsläppen
                i kommunen fortsätter att utvecklas som de senaste fem åren.
              </ListItem>
              <ListItem>
                För varje kommun finns även annan nyckelfakta, som koldioxidbudget, datum när budgeten tar slut med nuvarande
                utsläppstakt, politiskt styre och koldioxidutsläpp per invånare.
              </ListItem>
            </UnorderedList>
            Klimatkollen är utvecklad med öppen källkod. Det betyder att alla kan vara med och utveckla och förbättra
            sajten via vårt{' '}
            <a href='https://github.com/Klimatbyran/klimatkollen'>
              Github-repo
            </a>.
          </Paragraph>
          <AiryH5>
            Vilka står bakom?
          </AiryH5>
          <Paragraph>
            Initiativtagare är Ola Spännar och Frida Berry Eklund, båda med lång erfarenhet inom kommunikation och opinionsbildning.
            Vi tyckte att det var alldeles för svårt att veta vad Parisavtalet innebär konkret för den lokala klimatomställningen
            – och om det som görs räcker för att nå 1,5-gradersmålet. Därför startade vi Klimatkollen.
          </Paragraph>
          <Paragraph>
            Våra samarbetspartners under första året var Världsnaturfonden WWF, PwC, ClimateView, Iteam, Klimatklubben,
            Våra barns klimat, Argand Partners och We Don’t Have Time.
          </Paragraph>
          <AiryH5>
            Problemet vi löser
          </AiryH5>
          <Paragraph>
            Det finns mycket data därute som kan hjälpa oss att ta tempen på klimatomställningen, men den är ofta komplex,
            svårförståelig eller inlåst bakom betalvägg. Myndigheternas statistik om klimatutsläppen i kommunerna släpar efter
            med nästan två års fördröjning. Så kan vi inte ha det!
          </Paragraph>
          <Paragraph>
            Vi jobbar för att göra klimatdata lättillgänglig för medborgare. Det möjliggör ansvarsutkrävande och ger bränsle
            till nya digitala innovationer som snabbar på klimatomställningen. Vi behöver veta varifrån utsläppen kommer,
            vilka lösningar som genomförs i vilka kommuner och vilken effekt dessa åtgärder kan få på utsläppen.
            Läs mer om det i{' '}
            <a href='https://www.aktuellhallbarhet.se/alla-nyheter/debatt/med-battre-klimatdata-kan-vi-accelerera-klimatomstallningen/'>
              vår debattartikel
            </a>.
          </Paragraph>
          <AiryH5>
            Medborgardrivet – din hjälp behövs
          </AiryH5>
          <Paragraph>
            Klimatkollen finns till för – och drivs av – klimatintresserade medborgare.
            Hos oss kan alla bidra. Du kan exempelvis hjälpa oss att hitta data som saknas,
            förbättra sajten via vårt{' '}
            <a href='https://github.com/Klimatbyran/klimatkollen'>
              Github-repo</a>{' '}
            och sprida Klimatkollen i dina nätverk.
          </Paragraph>
          <Paragraph>
            <u>Skriv upp dig på vårt nyhetsbrev</u> så berättar vi när vi släpper något nytt.<br />
            <u>Skänk en slant!</u> Varje krona ger oss muskler att visa upp mer data. Vårt bankgiro: 5793-3178<br />
            <u>Ge av din kompetens?</u> Skicka ett mejl till <a href="mailto:hej@klimatkollen.se">hej@klimatkollen.se</a>.
          </Paragraph>
          <AiryH5>
            Vår styrelse
          </AiryH5>
          <Paragraph>
            Klimatkollen drivs av den ideella föreningen, Klimatbyrån. I styrelsen sitter:
            <UnorderedList>
              <ListItem>
                <b>Ola Spännar</b> – Opinionsbildare, medgrundare av Klimatkollen,
                tidigare kommunikationschef på Centerpartiet och kundansvarig på Forsman & Bodenfors.
              </ListItem>
              <ListItem>
                <b>Frida Berry Eklund</b> – Specialist på klimatkommunikation, föreläsare och medgrundare till Klimatkollen.
                Utsedd till en av Sveriges 101 hållbarhetsmäktigaste 2021. Initiativtagare till den
                internationella plattformen Our Kids’ Climate och författare till boken “Prata med barn om klimatet” (Natur & Kultur, 2020).
              </ListItem>
              <ListItem>
                <b>Christian Landgren</b> – Digital entreprenör och en av Sveriges mest inflytelserika personer inom tech.
                VD och grundare av Iteam och Öppna skolplattformen.
              </ListItem>
              <ListItem>
                <b>Anna Loverus</b> – Digital strateg och tidigare chef för sociala medier på Spotify och H&M.
                VD och grundare av Better Odds.
              </ListItem>
              <ListItem>
                <b>Maria Soxbo</b> – Journalist, författare, föreläsare och grundare av Klimatklubben.
                Utsedd till en av Sveriges 101 hållbarhetsmäktigaste 2021.
              </ListItem>
              <ListItem>
                <b>Carl-Johan Schultz</b> – Hållbarhetsstrateg på Doings, tidigare planner på Forsman & Bodenfors,
                författare till boken ”Hållbariseringen”, Årets marknadsföringsbok 2022.
              </ListItem>
            </UnorderedList>
          </Paragraph>
          <AiryH5>
            Så finansieras vi
          </AiryH5>
          <Paragraph>
            I dag drivs Klimatkollen med hjälp av ett{' '}
            <a href='https://www.mynewsdesk.com/se/klimatbyraan/pressreleases/klimatkollen-faar-stoed-av-postkodstiftelsen-och-rekryterar-toppnamn-3223979'>
              projektstöd från Postkodstiftelsen
            </a>.
            Mycket av arbetet är helt ideellt, därför välkomnar vi gärna fler samarbetspartners och ekonomiskt stöd!
          </Paragraph>
          <Paragraph>
            Uppstarten finansierades av Världsnaturfonden WWF, ClimateView, We Don’t Have Time och Argand Partners.
          </Paragraph>
          <AiryH5>
            Tidigare projekt
          </AiryH5>
          <Paragraph>
            Inför riksdagsvalet 2022 ansvarade Klimatkollen för två unika projekt som syftade till att ge medborgare bättre koll på
            utsläppseffekterna av partiernas klimatpolitik:
            <OrderedList>
              <ListItem>
                En{' '}
                <a href='https://klimatkollen.se/partier'>
                  analys av riksdagspartiernas klimatmål
                </a>,
                tillsammans med forskarnätverket Researchers’ Desk, Världsnaturfonden WWF, Våra barns klimat och ClimateView,
                i samarbete med PwC och Naturskyddsföreningen. Analysen visade att sex av åtta partier missar Parisavtalets 1,5-gradersmål.
              </ListItem>
              <ListItem>
                <a href='https://klimatkollen.se/utslappsberakningar'>
                  Utsläppsberäkning av riksdagspartiernas politik
                </a>{' '}
                gällande tolv centrala klimatåtgärder. Bakom uträkningarna står Klimatkollen, Världsnaturfonden WWF, ClimateView,
                Naturskyddsföreningen och Våra barns klimat. Beräkningarna visade att den nya regeringens politik kan öka utsläppen
                med 25 miljoner ton redan under mandatperioden 2022–2026.
              </ListItem>
            </OrderedList>
          </Paragraph>
        </Container>
      </PageWrapper>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const municipalities = new EmissionService().getMunicipalities()
  if (municipalities.length < 1) throw new Error('No municipalities found')

  res.setHeader(
    'Cache-Control',
    'public, stale-while-revalidate=60, max-age=' + 60 * 60 * 24 * 7,
  )

  return {
    props: { municipalities },
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
