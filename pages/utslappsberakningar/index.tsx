import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { ReactElement } from 'react'
import styled from 'styled-components'

import MetaTags from '../../components/MetaTags'
import { H2, Paragraph } from '../../components/Typography'
import { ClimateDataService } from '../../utils/climateDataService'
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

function Utslappsberakningar() {
  return (
    <>
      <MetaTags
        title="Unik utsläppsberäkning av riksdagspartiernas klimatåtgärder"
        description="Den nya regeringens politik kan öka utsläppen med 25 miljoner ton"
        imageUrl="/totala-utslapp-alla-partier.jpg"
      />
      <PageWrapper backgroundColor="darkestGrey">
        <Container>
          <H2>
            Unik utsläppsberäkning av riksdagspartiernas klimatåtgärder - den nya
            regeringens politik kan öka utsläppen med 25 miljoner ton
          </H2>

          <Paragraph>
            Den nya regeringens klimatåtgärder kan leda till ökade utsläpp av växthusgaser
            med uppemot 25 miljoner ton under mandatperioden åren 2023-2026, jämfört med
            nuvarande klimatpolitik. Det motsvarar hälften av de årliga svenska utsläppen.
            Det handlar framförallt om sänkningar av reduktionsplikten. Hela 33 miljoner
            ton utsläpp skiljer Sverigedemokraternas och Liberalernas politik åt.
          </Paragraph>

          <Paragraph>
            Det visar unika beräkningar av riksdagspartiernas politik för tolv centrala
            klimatåtgärder. Bakom uträkningarna står Klimatkollen, Världsnaturfonden WWF,
            ClimateView, Naturskyddsföreningen och Våra barns klimat.
            {' '}
            <a href="/utslappsberakningar.pdf" target="_blank">
              Rapporten finns här
            </a>
            .
          </Paragraph>

          <Paragraph>
            Beräkningarna är den andra delen i Klimatkollens partigranskning. Under
            Almedalsveckan i juli 2022 presenterades del ett, en
            {' '}
            <a href="https://klimatkollen.se/partier">analys av partiernas klimatmål</a>
            {' '}
            som visade att endast två av riksdagens åtta partier (MP och V) har klimatmål
            i närheten av Parisavtalets 1,5-gradersmål.
          </Paragraph>

          <Paragraph>
            De nya uträkningarna beskriver hur olika politiska åtgärder påverkar utsläppen
            av växthusgaser i praktiken, med fokus på åtgärder som kan ha effekt under
            mandatperioden. Resultatet visar att den nya regeringens politik kan komma att
            öka utsläppen av växthusgaser kraftigt, men också att det finns stora
            skillnader mellan Liberalerna och de andra partierna i regeringsunderlaget.
          </Paragraph>

          <Paragraph>
            Utsläppsberäkningarna är baserade på samtliga riksdagspartiers
            ställningstaganden till 12 utvalda klimatåtgärder, som tillsammans har stor
            effekt på utsläppen av växthusgaser. Uträkningen visar alltså effekten av hur
            partierna ställer sig till olika åtgärder. Det handlar bland annat om
            partiernas inställning till reduktionsplikten, bonus-malus, återställande av
            torvmarker och Klimatklivet.
          </Paragraph>

          <Figure>
            <Image
              src="/totala-utslapp-alla-partier.jpg"
              alt="Potentiell kumulativ utsläppsminskning eller utsläppsökning med partiernas politik under nästa mandatperiod, jämfört med en fortsättning av redan beslutade åtgärder. Positiva värden (SD, KD och M) innebär att utsläppen riskerar att öka under mandatperioden 2023–2026. Streckad area avser effekten av återvätning av torvmarker samt av konsumtionsbaserade utsläpp från livsmedelsproduktion och flyg som delvis äger rum utanför Sveriges gränser."
              layout="responsive"
              width={800}
              height={800}
            />
          </Figure>

          <Paragraph>
            Den klimatåtgärd som har störst betydelse för slutresultatet givet de
            förändringar partierna föreslår är reduktionsplikten. Med de förändringar av
            reduktionsplikten som Sverigedemokraterna, Kristdemokraterna och Moderaterna
            vill göra bedöms utsläppen öka med 23-24 miljoner ton, medan utsläppen med
            MP:s föreslagna skärpning istället skulle minska med ytterligare 7 miljoner
            ton jämfört med nuvarande plan. Beräkningen baseras på de positioner om
            reduktionsplikten som partierna gick till val på.
          </Paragraph>

          <Paragraph>
            Samtidigt som reduktionsplikten är ett styrmedel med stor potential att
            påverka utsläppen så är det långt ifrån oproblematiskt. Hållbart producerade
            biodrivmedel är en knapp resurs och reduktionsplikten kan därför enbart
            fungera om vägtrafiken samtidigt minskar och elektrifieringen av
            fordonsflottan påskyndas. Reduktionspliktens genomslag i beräkningarna är
            främst en indikation på att åtgärder inom transportsektorn kan ha stor effekt
            på utsläppen i närtid.
          </Paragraph>

          <Paragraph>
            Skillnaden mellan Liberalernas och Sverigedemokraternas politik är mer än 33
            miljoner ton vid en jämförelse av deras egna positioner i granskningens
            utvalda frågor. Det motsvarar nästan tre fjärdedelar av Sveriges årliga
            utsläpp. Sedan Tidöavtalet slöts finns det dock inte lika stora skillnader
            mellan partierna i regeringsunderlaget, eftersom även Liberalerna gått med på
            en sänkning av reduktionsplikten till EU:s miniminivåer. Beräkningarna syftar
            dock till att jämföra partiernas egna ambitioner på klimatområdet och därför
            har valet gjorts att inte utgå från kompromissen i Tidöavtalet.
          </Paragraph>

          <Figure>
            <Image
              src="/utslapp-partiers-politik.jpg"
              alt="Potential för kumulativ utsläppsminskning eller utsläppsökning med partiernas politik under nästa mandatperiod, jämfört med en fortsättning av redan beslutade åtgärder. Positivt värde betyder att utsläppen ökar, negativt värde betyder att utsläppen minskar."
              layout="responsive"
              width={800}
              height={800}
            />
          </Figure>

          <Paragraph>
            De åtgärder som beräknats är: koldioxidskatt och energiskatt, (nivå på och
            undantag från), bonus-malus, reduktionsplikt, kilometerskatt, Klimatklivet,
            energieffektivisering av flerbostadshus, flygskatt, konsumtionsskatt på
            livsmedel, samt återvätning av torvmarker. Dessa åtgärder utgör viktiga
            klimatpolitiska styrmedel samtidigt som det självklart behövs mer politik än
            dessa styrmedel för att Sverige ska leva upp till Parisavtalet. Urvalet av
            åtgärder har gjorts utifrån klimatnytta och vilka åtgärder som anses
            beräkningsbara.
          </Paragraph>

          <Paragraph>
            Åtgärderna som beräknats har i huvudsak valts ut från
            {' '}
            <a href="https://www.klimatpolitiskaradet.se/panorama/">Panorama</a>
            , ett
            oberoende analysverktyg som utvecklats av bland andra Klimatpolitiska rådet
            och ClimateView. Det är befintliga åtgärder och nya förslag som både kan
            genomföras och ge effekt under mandatperioden 2023-2026.
          </Paragraph>

          <Paragraph>
            I en enkät har alla riksdagspartier utom Moderaterna svarat på hur de ställer
            sig till åtgärderna. Baserat på svaren, samt kompletterande information från
            partierna och offentliga ställningstaganden, har totalt tolv åtgärder
            beräknats. I frågor där partiernas svar varit otydliga har deras ståndpunkter
            bedömts som status quo, även om de offentligt uttalat en viljeinriktning som
            skulle kunna leda till förändringar av åtgärderna. Partierna har också haft
            möjlighet att föreslå egna åtgärder, under förutsättning att de själva
            beräknat effekten av dessa på ett transparent sätt, men inga förslag har
            inkommit som kunnat inkluderas i analysen. Moderaternas positioner har
            istället hämtats från externa källor och genom egna antaganden. Partiet har
            givits möjlighet att ändra Klimatkollens antaganden, men valt att inte göra
            det.
          </Paragraph>

          <Paragraph>
            Utsläppseffekten av partiernas politik utgörs av skillnaden jämfört med
            beslutad politik, både åtgärder och förslag på nya styrmedel. Status quo är
            således redan beslutade nivåer på styrmedel såsom koldioxidskatt och
            reduktionsplikt (för nya styrmedel räknas status quo som att det inte finns).
            För partier som föreslår en försvagning av en beslutad utsläppsminskande
            åtgärd redovisas effekten som en utsläppsökning. Partier som istället vill
            skärpa en åtgärd, eller införa en ny, krediteras en utsläppsminskning.
          </Paragraph>

          <Paragraph>
            <a href="/utslappsberakningar.pdf" target="_blank">
              Här finns hela analysen: “Utsläppsberäkning av riksdagspartiernas politik för
              kommande mandatperiod, åren 2023-2026”.
            </a>
          </Paragraph>
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

export default Utslappsberakningar

Utslappsberakningar.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
      <Footer />
    </>
  )
}
