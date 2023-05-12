import { GetServerSideProps } from 'next'
import { ReactElement } from 'react'
import styled from 'styled-components'

import MetaTags from '../../components/MetaTags'
import { H2, Paragraph } from '../../components/Typography'
import { ClimateDataService } from '../../utils/climateDataService'
import PageWrapper from '../../components/PageWrapper'
import Layout from '../../components/Layout'
import Footer from '../../components/Footer'
import ToggleSection from '../../components/ToggleSection'

const Container = styled.section`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
`

const AiryParagraph = styled(Paragraph)`
  margin-bottom: 32px;
`

const KoM = () => {
  return (
    <>
      <MetaTags
        title='Källor och metod'
        description='Om Klimatkollens källor och metod'
      />
      <PageWrapper backgroundColor="darkestGrey">
        <Container>
          <H2>
            Källor och metod
          </H2>
          <AiryParagraph>
            Vår utgångspunkt är Parisavtalets 1,5-gradersmål och våra datakällor är offentliga. Klicka på rubrikerna för att läsa mer.
          </AiryParagraph>
          <ToggleSection
            header='Klimatkollen utgår från Parisavtalet'
            text={
              <>
                <Paragraph>
                  Parisavtalet är ett juridiskt bindande avtal mellan världens länder om att vidta åtgärder för att begränsa den
                  globala uppvärmningen till väl under 2 grader, med sikte på 1,5 grader.
                </Paragraph>
                <Paragraph>
                  För att nå målet måste världens länder halvera växthusgasutsläppen till 2030 jämfört med 1990 och nå nära noll utsläpp senast 2050.
                  I dag{' '}
                  <a href='https://www.iea.org/news/global-co2-emissions-rebounded-to-their-highest-level-in-history-in-2021'
                    target='_blank'
                    rel='noreferrer'>
                    ökar</a>{' '}
                  fortfarande utsläppen globalt.
                </Paragraph>
                <Paragraph>
                  Enligt Parisavtalet ska rika länder ta ett större ansvar, eftersom deras stora historiska utsläpp innebär att de redan använt
                  mycket av det utsläppsutrymme som återstår för att hejda uppvärmningen. Bland dessa länder ingår Sverige, som både ska gå före med att minska
                  utsläppen och även hjälpa andra mer sårbara länder att ställa om.
                </Paragraph>
                <Paragraph>
                  Läs mer om Parisavtalet hos{' '}
                  <a href='https://www.wwf.se/rapport/ipcc/#parisavtalet'
                    target='_blank'
                    rel='noreferrer'>
                    Världsnaturfonden WWF
                  </a>.
                </Paragraph>
              </>}
          />
          <ToggleSection
            header='Om våra källor'
            text={
              <>
                <Paragraph>
                  Klimatkollen baseras på offentliga källor och verifierad data. Vi anger alla källor så att du enkelt kan kolla upp och läsa mer.
                  Om något blivit fel, mejla oss gärna på{' '}
                  <a href="mailto:hej@klimatkollen.se">hej@klimatkollen.se</a> så att vi kan ändra.
                </Paragraph>
                <Paragraph>
                  Statistik om koldioxidutsläpp hämtas från{' '}
                  <a href='https://nationellaemissionsdatabasen.smhi.se/'
                    target='_blank'
                    rel='noreferrer'>
                    Nationella emissionsdatabasen
                  </a>,
                  som hanteras av SMHI och utgår från Sveriges officiella utsläppsstatistik, med Naturvårdsverket som ansvarig myndighet.
                  Kommunal utsläppsdata har 1,5–2 års fördröjning, 2020 års siffror släpptes i september 2022.
                </Paragraph>
                <Paragraph>
                  Uppgifter om politiskt styre i kommunerna hämtas från{' '}
                  <a href='https://skr.se/skr/demokratiledningstyrning/valmaktfordelning/valresultatstyren/styreikommunereftervalet2018.26791.html'
                    target='_blank'
                    rel='noreferrer'>
                    Sveriges Kommuner och Regioner
                  </a>. 
                  Från{' '}
                  <a href='https://www.wikidata.org/wiki/Wikidata:Country_subdivision_task_force/Sweden/Municipalities'
                    target='_blank'
                    rel='noreferrer'>
                    Wikidata</a>{' '}
                  hämtar vi kommunernas invånarantal och kommunvapen. 
                  Statistiken om andel laddbara bilar kommer från{' '}
                  <a href='https://www.trafa.se/vagtrafik/fordon/'
                    target='_blank'
                    rel='noreferrer'>
                    Trafikanalys
                  </a>.
                </Paragraph>
              </>}
          />
          <ToggleSection
            header='Om koldioxidbudgetar'
            text={
              <>
                <Paragraph>
                  En koldioxidbudget anger hur mycket koldioxid som kan släppas ut innan koldioxidhalten i atmosfären blir så hög att
                  uppvärmningen bryter mot Parisavtalets 1,5-gradersmål.
                </Paragraph>
                <Paragraph>
                  FN:s klimatpanel (IPCC) beräknade i början av 2020 att den återstående globala koldioxidbudgeten,
                  för en 50/50 chans att hålla världen under 1,5 graders uppvärmning, var ca{' '}
                  <a href='https://www.carbonbrief.org/in-depth-qa-the-ipccs-sixth-assessment-report-on-climate-science/'
                    target='_blank'
                    rel='noreferrer'>
                    500 gigaton
                  </a>.
                  När de faktiska utsläppen 2020–2022 räknats bort återstod{' '}
                  <a href='https://www.carbonbrief.org/guest-post-what-the-tiny-remaining-1-5c-carbon-budget-means-for-climate-policy/'
                    target='_blank'
                    rel='noreferrer'>
                    380 gigaton
                  </a>{' '}
                  koldioxid i januari 2023. Det motsvarar nio år med nuvarande utsläppstakt.
                </Paragraph>
                <Paragraph>
                  Klimatkollen utgår ifrån en nationell koldioxidbudget för Sverige, baserad på IPCC:s uträkning globalt.
                  Den svenska budgeten är beräknad 2022 av forskare vid Uppsala Universitet, enligt Tyndall-modellen. Läs mer{' '}
                  <a href='https://klimatkollen.se/Paris_compliant_Swedish_CO2_budgets-March_2022-Stoddard&Anderson.pdf'
                    target='_blank'
                    rel='noreferrer'>
                    här
                  </a>.
                </Paragraph>
                <Paragraph>
                  Sveriges koldioxidbudget var i början av 2022 170 miljoner ton, motsvarande 3,5 år med nuvarande utsläppstakt.
                </Paragraph>
                <Paragraph>
                  Den nationella koldioxidbudgeten har sedan fördelats enligt Tyndall-modellen på kommunerna av företaget ClimateView för Klimatkollens räkning.
                </Paragraph>
                <Paragraph>
                  De lokala koldioxidbudgetarna gör det möjligt att jämföra hur det går, med hur det borde gå.
                  På Klimatkollen visas koldioxidbudgetar för kommunerna både med siffror och som utvecklingskurva över
                  hur utsläppen behöver minska för att vara i linje med Parisavtalet.
                </Paragraph>
                <Paragraph>
                  Förutom Tyndall-modellen finns även andra sätt att beräkna en nationell koldioxidbudget, se exempel från{' '}
                  <a href='https://research.chalmers.se/publication/530543/file/530543_Fulltext.pdf'
                    target='_blank'
                    rel='noreferrer'>
                    Chalmers här
                  </a>.
                </Paragraph>
              </>}
          />
          <ToggleSection
            header='Om olika typer av utsläpp'
            text={
              <>
                <Paragraph>
                  Klimatkollen är en oberoende faktaplattform som följer allmän och vedertagen standard för hur utsläpp redovisas.
                  Den klimatdata vi visar speglar de avgränsningar som följer av hur koldioxidbudgeten är beräknad.
                  Exempelvis går det inte att rakt av koppla koldioxidbudgetar till utsläpp av alla växthusgaser,
                  där även metan, lustgas, vattenånga med flera inkluderas.
                </Paragraph>
                <Paragraph>
                  Utsläpp från cementproduktion är exkluderat i IPCC:s globala koldioxidbudget och därmed även i koldioxidbudgeten för Sverige 
                  och i utsläppsstatistiken för de tre kommunerna Gotland, Skövde och Mörbylånga, där cementproduktion sker idag.
                </Paragraph>
                <Paragraph>
                  Sverige har även hög klimatbelastning från varor vi importerar från andra länder och orsakar därför utsläpp i andra delar av världen.
                  Dessa konsumtionsbaserade utsläpp inkluderas inte i koldioxidbudgeten.
                </Paragraph>
                <Paragraph>
                  Inte heller  utsläpp från skog och mark (så kallade biogena utsläpp) inkluderas i koldioxidbudgeten.
                </Paragraph>
                <Paragraph>
                  Egentligen är alltså de klimatpåverkande utsläppen mycket större än de territoriella fossila koldioxidutsläpp som vanligtvis
                  rapporteras av myndigheter och i media och som idag visas på Klimatkollen. Journalisten Alexandra Urisman Otto beskriver detta i{' '}
                  <a href='https://www.dn.se/sverige/sverige-ska-ga-fore-anda-ar-klimatmalen-langt-ifran-tillrackliga/'
                    target='_blank'
                    rel='noreferrer'>
                    Dagens Nyheter
                  </a>{' '}
                  och i ett kapitel av{' '}
                  <a href='https://www.bokforlagetpolaris.se/klimatboken/t-1/9789177956525'
                    target='_blank'
                    rel='noreferrer'>
                    Klimatboken
                  </a>.
                </Paragraph>
                <Paragraph>
                  Klimatkollen undersöker nu hur även andra växthusgasutsläpp skulle kunna visas på webbplatsen framöver,
                  samtidigt som möjligheten att jämföra dagens utsläpp med koldioxidbudgetar behålls.
                </Paragraph>
              </>}
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
    'public, stale-while-revalidate=60, max-age=' + 60 * 60 * 24 * 7,
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
