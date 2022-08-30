import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { ReactElement } from 'react'
import styled from 'styled-components'
import Link from 'next/link'

import MetaTags from '../../components/MetaTags'
import { H1, H2, Paragraph } from '../../components/Typography'
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

const Hr = styled.hr`
  margin-bottom: 2rem;
`

const Bold = styled.span`
  font-weight: bold;
`

const Partier = () => {
  return (
    <>
      <MetaTags
        title="Klimatkollen - Analys av partiernas klimatmål"
        description="Granskning av partiernas klimatmål och Parisavtalet, gjord av Klimatkollen, Researchers' Desk, WWF, Våra barns klimat, ClimateView, PwC, Naturskyddsföreningen"
      />
      <PageWrapper backgroundColor="black">
        <Container>
          <H2>
            Unik utsläppsberäkning av partiernas politik: 27 miljoner ton klimatutsläpp
            skiljer
          </H2>
          <Paragraph>
            <Bold>
              27 miljoner ton växthusgaser - så mycket skiljer det mellan partiernas
              politik i en ny unik utsläppsberäkning för nästa mandatperiod. Fyra partiers
              politik kan i varierande grad bidra till utsläppsminskningar Mp (-21,1), V
              (-7,6), L (-7,1), S (-5,3), C (-4,9), medan två partier riskerar att öka
              utsläppen SD (+3,6), KD (+6,2). M har inte svarat. Analysen är samordnad av
              Klimatkollen i samarbete med Researchers&apos; Desk, Världsnaturfonden WWF,
              ClimateView, Våra barns klimat och Naturskyddsföreningen.
            </Bold>
          </Paragraph>
          <Paragraph>
            - Att de flesta partierna inte själva utsläppsberäknar sin politik är
            oacceptabelt och borde vara en självklarhet. Den här beräkningen ger väljarna
            en chans att på riktigt få en uppfattning om hur ambitiös partiernas
            klimatpolitik är, säger Madeleine van der Veer, ansvarig för samhällspolitik,
            Världsnaturfonden WWF
          </Paragraph>
          <Paragraph>
            Beräkningen är baserad på partiernas egna svar på frågor om åtgärder som både
            är möjliga att genomföra och ge effekt redan under nästa mandatperiod, såsom
            energiskatt, reduktionsplikt och Klimatklivet. Svaren har sedan analyserats av
            forskare och experter med stöd av det oberoende verktyget Panorama som
            utvecklats av bland annat Klimatpolitiska rådet.
          </Paragraph>
          <Paragraph>
            <Bold>Tabell: Utsläppsförändring med partiernas politik 2023-2026</Bold>
            <Figure>
              <Image
                src="/partier-totala-utslapp.png"
                alt=""
                layout="responsive"
                width={936}
                height={452}
              />
            </Figure>
            <Figcaption>
              Figuren visar potentialen för utsläppsminskning eller ökning med partiernas
              politik under nästa mandatperiod, jämfört med en fortsättning av redan
              beslutade åtgärder. Positiva värden (KD och SD) betyder att utsläppen
              riskerar att öka under mandatperioden. Streckad area avser effekten av
              återvätning av torvmarker som brukar särskiljas från andra utsläppsminskande
              åtgärder. Moderaterna svarade inte på enkäten och har därför inte kunnat tas
              med i beräkningarna.
            </Figcaption>
          </Paragraph>
          <Paragraph>
            - Det räcker inte med en gradvis förändring för att undvika klimatkatastrof.
            De flesta partierna vill förbättra dagens system på marginalen, men det som
            krävs enligt vetenskapen är en systemförändring av hela samhället, säger
            Kimberly Nicholas, docent i miljövetenskap vid Lunds Universitet och medlem i
            Researchers&apos; Desk.
          </Paragraph>
          <Paragraph>
            Miljöpartiet är det parti i analysen som visar på de största
            utsläppsminskningarna under mandatperioden (21,1 miljoner ton). Därefter
            kommer Vänsterpartiet (7,6 miljoner ton), Liberalerna (7,1 miljoner ton),
            Socialdemokraterna (5,3 miljoner ton) och Centerpartiet (4,9 miljoner ton).
            Kristdemokraterna och Sverigedemokraterna visade istället på utsläppsökningar
            (6,2 miljoner ton och 3,6 miljoner ton). Skillnaden mellan partiet i botten
            (KD) och det i toppen (MP) är 27 miljoner ton växthusgaser, vilket motsvarar
            mer än hälften av Sveriges årliga utsläpp. 2021 släppte Sverige ut 48 miljoner
            ton växthusgaser, vilket var en ökning med fyra procent jämfört med 2020,
            enligt siffror från SCB.
          </Paragraph>
          <Paragraph>
            - En klimatpolitik utan vare sig budget eller utsläppsberäkningar är som att
            gå och handla mat utan varken prislappar eller att veta vad jag har i
            plånboken. Det är alla medborgares rätt att veta vad partiernas politik leder
            till i utsläppsminskningar i närtid. Våra unga förtjänar politiker som tar
            klimatpolitiken på allvar, säger Frida Berry Eklund, talesperson för Våra
            barns klimat.
          </Paragraph>
          <Paragraph>
            Beräkningarna kompletterar den analys av partiernas klimatmål som
            presenterades i Almedalen i juli i år. Den visade att endast två av riksdagens
            åtta partier (MP och V) står bakom klimatmål som är i närheten av att leverera
            på Parisavtalets 1,5-gradersmål.
          </Paragraph>
          <Paragraph>
            - I vår vetenskapliga bedömning av partiernas svar är det tydligt att alla
            partier bör skärpa sin politik för att ligga i linje med Parisavtalets
            1,5-gradersmål. Alla partier bör kunna presentera vad deras politik leder till
            i utsläppsminskningar, säger Erik Pihl, PhD, sakkunnig på
            Naturskyddsföreningen.
          </Paragraph>
          <Paragraph>
            - Vi har redan det vi behöver för att göra bra bedömningar av vilka effekter
            olika klimatåtgärder har. Självklart bör alla partier presentera en politik
            som utsläppsberäknas, säger Tomer Shalit, grundare av ClimateView.
          </Paragraph>
          <Paragraph>
            <Bold>För mer information:</Bold>
          </Paragraph>
          <Paragraph>
            <Bold>Om projektet:</Bold> Ola Spännar, medgrundare av Klimatkollen,{' '}
            <a href="tel:070-710 74 14">070-710 74 14</a>,{' '}
            <a href="mailto:hej@klimatkollen.se">hej@klimatkollen.se</a> <br />
            <Bold>Om beräkningarna:</Bold> Madeleine van der Veer, Världsnaturfonden WWF,
            <a href="tel:070-292 44 12">070-292 44 12</a>,{' '}
            <a href="mailto:Madeleine.vanderVeer@wwf.se">Madeleine.vanderVeer@wwf.se</a>{' '}
            <br />
            <Bold>Om den kvalitativa analysen:</Bold> Kimberly Nicholas, Researchers&apos;
            Desk, <a href="tel:076-307 50 37">076-307 50 37</a>,{' '}
            <a href="mailto:kimberly.nicholas@LUCSUS.lu.se">
              kimberly.nicholas@LUCSUS.lu.se
            </a>{' '}
            <br />
          </Paragraph>
          <Paragraph>
            <Bold>Om Klimatkollens utsläppsberäkning</Bold>
          </Paragraph>
          <Paragraph>
            Partigranskningen har samordnats av initiativet Klimatkollen, vars syfte är
            att tillgängliggöra fakta om klimatomställningen och verka för minskade
            klimatutsläpp i linje med Parisavtalet. Partigranskningen består av en
            kvantitativ analys (LÄNK HÄR) och en kvalitativ utsläppsberäkning (LÄNK HÄR)
            av riksdagspartiernas svar på en enkät som skickades ut i maj i år.
          </Paragraph>
          <Paragraph>
            <Bold>Om den kvantitativa utsläppsberäkningen</Bold>
          </Paragraph>
          <Paragraph>
            Urvalet av frågor som beräknats i den här analysen har främst gjorts utifrån
            det oberoende verktyget Panorama som utvecklats av ClimateCiew för bland annat
            Klimatpolitiska rådet. De åtgärder som analyserats har valts ut för att visa
            på potentiell minskning av utsläppen under kommande mandatperiod år 2023-2026.
            I en enkät till riksdagspartierna har de fått svara på hur de ställer sig till
            åtgärderna. Enkäten skickades ut till partierna i maj. Moderaterna valde att
            inte delta i analysen. Partierna har även haft möjlighet att ta upp andra
            åtgärder som kan utsläppsberäknas. Baserat på svaren har totalt 13 åtgärder
            utsläppsberäknats av forskare och experter.
          </Paragraph>
          <Paragraph>
            <Bold>Åtgärderna som har beräknats</Bold>
          </Paragraph>
          <Paragraph>
            Koldioxidskatt och energiskatt, (nivå och undantag), bonus-malus,
            reduktionsplikt, kilometerskatt, Klimatklivet, CCS i cementsektorn,
            energieffektivisering av flerbostadshus, flygskatt, konsumtionsskatt på
            livsmedel, återvätning av torvmarker
          </Paragraph>
          <Paragraph>
            <Bold>Om den kvalitativa analysen</Bold>
          </Paragraph>
          <Paragraph>
            Enkäten till partierna omfattade även av icke-beräkningsbara frågor, vilka
            tillsammans med utsläppsberäkningen, legat till grund för en kvalitativ analys
            av partiernas klimatpolitik. Analysen är gjord av forskarnätverket
            Researchers&apos; Desk och täcker in åtta olika perspektiv - klimatmål och
            koldioxidbudget, Parisavtalets rättviseaspekt, konsumtion, energi,
            kolinlagring i skog och mark, samhällsekonomi och koldioxidlagring.
          </Paragraph>
          <Paragraph>
            <Bold>Om Klimatkollen.se</Bold>
          </Paragraph>
          <Paragraph>
            Klimatkollen.se är ett nytt digitalt verktyg som presenterar klimatfakta och
            utsläppsdata för Sverige och alla kommuner. Syftet är att visualisera fakta på
            ett enkelt och tilltalande sätt, för att på det sättet bidra till en mer
            faktabaserad klimatdebatt och åtgärder som minskar utsläppen i linje med
            Parisavtalet. Klimatkollen.se är utvecklad av Klimatbyrån och Våra barns
            klimat i samarbete med bland andra digitaliseringsföretaget Iteam,
            Världsnaturfonden WWF, Klimatklubben och klimatteknikbolaget ClimateView.
          </Paragraph>
          <H2>
            Analys av riksdagspartiernas klimatmål - sex av åtta partier missar helt
            Parisavtalets 1,5-gradersmål
          </H2>
          <Paragraph>
            Inför valet genomför Klimatkollen en granskning av riksdagspartiernas
            klimatpolitik. Nu är första delen klar, en analys av partiernas klimatmål
            jämfört med Parisavtalets 1,5-gradersmål, där hänsyn tagits till avtalets
            rättviseaspekt.
          </Paragraph>
          <Paragraph>
            Bakom projektet står forskarnätverket Researchers&apos; Desk,
            Världsnaturfonden WWF, Våra barns klimat och ClimateView, i samarbete med PwC
            och Naturskyddsföreningen.
          </Paragraph>
          <Paragraph>
            Analysen visar att två partiers klimatmål, Miljöpartiets och Vänsterpartiets,
            är nära Parisavtalets 1,5-gradersmål. Ytterligare två partier, Centerpartiet
            och Liberalerna, går längre än Sveriges klimatmål, men når inte lika långt.
            Kristdemokraterna, Moderaterna, Socialdemokraterna och Sverigedemokraterna har
            mål i linje med det svenska klimatmålet, men är längre ifrån Parisavtalets
            1,5-gradersmål.
          </Paragraph>
          <Figure>
            <Image
              src="/image1-31.png"
              alt="Diagram gällande partiernas utsläppsmål jämfört med Sveriges koldioxidbudget."
              layout={'responsive'}
              width={936}
              height={452}
            />
          </Figure>
          <Paragraph>
            För att vara i linje med Parisavtalets 1,5-gradersmål bör Sverige maximalt
            släppa ut cirka 170 miljoner ton koldioxid. Det utgör Sveriges andel av den
            globala utsläppsbudgeten för Parisavtalets 1,5-gradersmål, med hänsyn tagen
            till avtalets rättviseaspekt, där rika och tidigt industrialiserade länder ska
            gå före.
          </Paragraph>
          <Paragraph>
            Den framräknade nationella koldioxidbudgeten ligger även till grund för
            jämförelsen på{' '}
            <Link href="/kommuner">
              <a href="/kommuner">kommunsidorna</a>
            </Link>{' '}
            på Klimatkollen. Läs mer om hur den är beräknad{' '}
            <a
              href="/Paris_compliant_Swedish_CO2_budgets-March_2022-Stoddard&Anderson.pdf"
              target="_blank">
              här
            </a>
          </Paragraph>
          <Paragraph>
            Analysen baseras på två frågor i en enkät som skickats till samtliga
            riksdagspartier under våren. Den första frågan var ”Vilken utsläppsbudget
            eller klimatmål och takt för utsläppsminskningar vill ert parti se?”. Den
            andra frågan var ”Står ert parti bakom EU:s nya förslag till mål om att
            Sverige ska ha en nettoinbindning av kolinlagring från skog och mark på 47,3
            miljoner ton CO₂e årligen till 2030?”
          </Paragraph>
          <Paragraph>
            Alla partier utom Moderaterna har valt att svara på enkäten. Svaren har sedan
            analyserats av forskare från nätverket Researchers&apos; Desk och WWF.
            Moderaterna är dock med i analysen av klimatmålen, trots att de inte svarade
            på enkäten, eftersom de tidigare ställt sig bakom Sveriges nuvarande klimatmål
            och därmed beräknas utifrån det.
          </Paragraph>
          <Paragraph>
            Kristdemokraternas, Liberalernas, Moderaternas, Socialdemokraternas och
            Sverigedemokraternas ambitioner ligger i linje med Sveriges nuvarande
            klimatmål, som kräver en koldioxidbudget på 355 miljoner ton CO₂. Det är cirka
            2,1 gånger mer än Sveriges andel av den globala budgeten för Parisavtalets 1,5
            gradersmål, med hänsyn tagen till avtalets rättviseaspekt.
          </Paragraph>
          <Paragraph>
            Centerpartiets klimatmål är ”netto noll år 2040”. Detta innebär utsläpp av 311
            miljoner ton CO₂, vilket är cirka 1,8 gånger mer än den nationella
            koldioxidbudgeten.
          </Paragraph>
          <Paragraph>
            Vänsterpartiets klimatmål är ”noll utsläpp till 2035”. Detta medför utsläpp av
            217 miljoner ton CO₂, vilket är cirka 1,3 gånger mer än den nationella
            koldioxidbudgeten.
          </Paragraph>
          <Paragraph>
            Miljöpartiets klimatmål är ”en koldioxidbudget på 180 miljoner ton CO₂”. Detta
            motsvarar att uppnå ”nollutsläpp” för CO₂ till 2034 vilket är cirka 1,1 gånger
            mer än Sveriges andel av den nationella koldioxidbudgeten.
          </Paragraph>
          <Paragraph>
            Inkluderar man partiernas mål för kompletterande åtgärder, där kolinlagring i
            skog och mark och även bio-CCS (lagring av koldioxid från biobränsle) ingår,
            så sticker fortfarande Miljöpartiet och Vänsterpartiet ut som mest
            långtgående, men även Liberalerna utmärker sig, med omfattande mål för
            bio-CCS.
          </Paragraph>
          <Paragraph>
            PM med analysen av partiernas klimatmål i sin helhet finns{' '}
            <a href="/Carbon_budgets-Analysis_final.pdf" target="_blank">
              här
            </a>{' '}
            och en fördjupning om skog och mark finns{' '}
            <a href="/Klimatkollen_LULUCF_final.pdf" target="_blank">
              här
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
