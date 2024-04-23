import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { ReactElement } from 'react'
import styled from 'styled-components'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import MetaTags from '../../components/MetaTags'
import { H2 } from '../../components/Typography'
import PageWrapper from '../../components/PageWrapper'
import Layout from '../../components/Layout'
import Footer from '../../components/Footer/Footer'
import { devices } from '../../utils/devices'
import Markdown from '../../components/Markdown'

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

  & img {
    width: 100%;
    height: auto;
  }
`

function Partier() {
  const { t } = useTranslation()
  return (
    <>
      <MetaTags
        title={t('partierna:meta.title')}
        description={t('partierna:meta.description')}
      />
      <PageWrapper backgroundColor="black">
        <Container>

          <H2>{t('partierna:title')}</H2>

          <Markdown>{t('partierna:part1')}</Markdown>

          <Figure>
            <Image
              src="/images/image1-31.png"
              alt="Diagram gällande partiernas utsläppsmål jämfört med Sveriges koldioxidbudget."
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
            jämförelsen på
            {' '}
            <Link href="/">
              startsidan
            </Link>
            {' '}
            på Klimatkollen. Läs mer om hur den är beräknad
            {' '}
            <a
              href="/Paris_compliant_Swedish_CO2_budgets-March_2022-Stoddard&Anderson.pdf"
              target="_blank"
              rel="noreferrer"
            >
              här
            </a>
            .
            {' '}
            <a
              href="https://www.cemus.uu.se/wp-content/uploads/2023/12/Paris-compliant-carbon-budgets-for-Swedens-counties-.pdf"
              target="_blank"
              rel="noreferrer"
            >
              (2023 dokument här)
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
            analyserats av forskare från nätverket Researchers’ Desk och WWF. Moderaterna
            är dock med i analysen av klimatmålen, trots att de inte svarade på enkäten,
            eftersom de tidigare ställt sig bakom Sveriges nuvarande klimatmål och därmed
            beräknas utifrån det.
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
            PM med analysen av partiernas klimatmål i sin helhet finns
            {' '}
            <a href="/Carbon_budgets-Analysis_final.pdf" target="_blank">
              här
            </a>
            {' '}
            och en fördjupning om skog och mark finns
            {' '}
            <a href="/Klimatkollen_LULUCF_final.pdf" target="_blank">
              här
            </a>
            .
          </Paragraph>

          <Markdown>{t('partierna:part2')}</Markdown>
        </Container>
      </PageWrapper>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res, locale }) => {
  res.setHeader(
    'Cache-Control',
    `public, stale-while-revalidate=60, max-age=${60 * 60 * 24 * 7}`,
  )

  return {
    props: {
      ...await serverSideTranslations(locale as string, ['common', 'partierna']),
    },
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
