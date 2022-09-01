import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { ReactElement } from 'react'
import styled from 'styled-components'

import MetaTags from '../../components/MetaTags'
import { H2, Paragraph } from '../../components/Typography'
import { EmissionService } from '../../utils/emissionService'
import PageWrapper from '../../components/PageWrapper'
import Layout from '../../components/Layout'
import Footer from '../../components/Footer'
import { devices } from '../../utils/devices'

const Container = styled.section`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
`

const Figure = styled.figure`
  margin: 22.4px 2px;
  @media only screen and (${devices.tablet}) {
    width: 95%;
  }
`
const Figcaption = styled.figcaption`
  font-style: italic;
`

const Bold = styled.span`
  font-weight: bold;
`

const Partier = () => {
  return (
    <>
      <MetaTags
        title="Klimatkollen - Utsläppsberäkningar för partierna"
        description="Utsläppsberäkningar för partierna, gjord av Klimatkollen, Researchers' Desk, WWF, Våra barns klimat, ClimateView, PwC, Naturskyddsföreningen"
      />
      <PageWrapper backgroundColor="black">
        <Container>
          <H2>
            Unik utsläppsberäkning av partiernas politik: 30 miljoner ton klimatutsläpp
            skiljer
          </H2>
          <Paragraph>
            <Bold>
              Det skiljer 30 miljoner ton växthusgaser mellan partiernas klimatåtgärder
              för nästa mandatperiod, vilket motsvarar mer än hälften av Sveriges årliga
              utsläpp. Fem partier bidrar i varierande grad till utsläppsminskningar (Mp,
              V, L, S och C) medan två partiers åtgärder (SD och KD) ökar utsläppen. M har
              inte svarat.
            </Bold>
          </Paragraph>
          <Paragraph>
            <Bold>
              Det visar en unik analys av partiernas klimatpolitik som samordnats av
              Klimatkollen i samarbete med Researchers&apos; Desk, Världsnaturfonden WWF,
              ClimateView, Våra barns klimat, Naturskyddsföreningen och PwC.
            </Bold>
          </Paragraph>
          <Paragraph>
            Beräkningen är baserad på en enkät där riksdagspartierna svarat på frågor om
            åtgärder som är möjliga att både genomföra och ge effekt redan under nästa
            mandatperiod, såsom energiskatt, reduktionsplikt och Klimatklivet. Beräkningar
            har gjorts med stöd av det oberoende verktyget Panorama som utvecklats av
            bland andra Klimatpolitiska rådet och ClimateView.
          </Paragraph>
          <Paragraph>
            <Image
              src="/partier-totala-utslapp.png"
              alt="Utsläppsförändring med partiernas politik mandatperioden 2023-2026"
              layout="responsive"
              width={600}
              height={600}
            />
          </Paragraph>
          <Paragraph>
            Beräkningen anger sammanlagda utsläppsförändringar under mandatperioden
            2023-2026 med respektive partis politik jämfört med status quo. Miljöpartiet
            visar de största utsläppsminskningarna under mandatperioden (24,2 miljoner
            ton). Därefter kommer Vänsterpartiet (7,6 miljoner ton), Liberalerna (7,1
            miljoner ton), Socialdemokraterna (5,3 miljoner ton) och Centerpartiet (4,9
            miljoner ton). Sverigedemokraterna och Kristdemokraterna visar istället
            utsläppsökningar (3,6 respektive 6,2 miljoner ton). Skillnaden mellan partiet
            i botten (KD) och i toppen (MP) är 30 miljoner ton växthusgaser, vilket
            motsvarar mer än hälften av Sveriges årliga utsläpp.
          </Paragraph>
          <Paragraph>
            Urvalet av frågor som beräknats har främst gjorts utifrån Panorama. De
            åtgärder som analyserats har valts ut för att visa potentiell minskning av
            utsläppen under kommande mandatperiod 2023-2026. Enkäten skickades ut till
            partierna i maj. Partierna har även haft möjlighet att ta upp andra åtgärder
            som kan utsläppsberäknas. Baserat på svaren har totalt 13 åtgärder
            utsläppsberäknats av forskare och experter.
          </Paragraph>
          <Paragraph>
            Åtgärderna som beräknats är koldioxidskatt och energiskatt, (nivå och
            undantag), bonus-malus, reduktionsplikt, kilometerskatt, Klimatklivet, CCS i
            cementsektorn, energieffektivisering av flerbostadshus, flygskatt,
            konsumtionsskatt på livsmedel och återvätning av torvmarker.
          </Paragraph>
          <Paragraph>
            <a href="/utslappsberakning_klimatkollen.pdf">
              Läs hela rapporten med utsläppsberäkningar
            </a>
            .
          </Paragraph>
          <Paragraph>
            <Bold>Kvalitativ bedömning av Researchers&apos; Desk</Bold>
          </Paragraph>
          <Paragraph>
            Utöver utsläppsberäkningen har forskare i nätverket Researchers&apos; Desk
            gjort en egen kvalitativ analys av enkätsvaren och partiernas klimatpolitik
            som omfattar åtta olika perspektiv - övergripande resonemang, klimatmål och
            koldioxidbudget, rättviseaspekter, omställningspotential, energi, kolinlagring
            i skog och mark, samhällsekonomi och koldioxidlagring. Partiernas styrkor och
            svagheter har analyserats utifrån vad som krävs för att hantera klimatkrisen i
            enlighet med forskningsläget.
          </Paragraph>
          <Paragraph>
            Några resultat har överraskat forskarna, som att Socialdemokraterna lämnat
            svar som upprätthåller status quo snarare än att påskynda omställningen och
            att Kristdemokraterna och Sverigedemokraterna lägger ett stort klimatansvar på
            EU samtidigt som de avvisar EU:s politik för skog och mark. Liberalerna och
            Centerpartiet förlitar sig i hög grad på ännu ej utbyggda teknologier.
            Vänsterpartiet och Miljöpartiet ser betydelsen av livsstilsförändringar, men
            Vänsterpartiet skjuter omställningen på framtiden.
          </Paragraph>
          <Paragraph>
            <a href="/utslappsberakningar_kvalitativ_analys.pdf">
              Läs Researchers&apos; kvalitativa analys
            </a>
            .
          </Paragraph>
        </Container>
      </PageWrapper>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const municipalities = await new EmissionService().getMunicipalities()
  if (municipalities.length < 1) throw new Error('No municipalities found')

  res.setHeader(
    'Cache-Control',
    'public, stale-while-revalidate=60, max-age=' + 60 * 60 * 24 * 7,
  )

  return {
    props: { municipalities },
  }
}

export default Partier

Partier.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
      <Footer />
    </>
  )
}
