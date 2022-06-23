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
import VisuallyHidden from '../../components/VisuallyHidden'
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
const Hr = styled.hr`
  margin-bottom: 2rem;
`

const Partier = () => {
  return (
    <>
      <MetaTags
        title="Klimatkollen — Få koll på Sveriges klimatomställning"
        description=""
      />
      <PageWrapper backgroundColor="black">
        <VisuallyHidden>
          <H1>Klimatkollen</H1>
        </VisuallyHidden>
        <Container>
          <H2>Partiernas utsläppsmål jämfört med Sveriges koldioxidbudget</H2>
          <Paragraph>
            Här kommer en inledande text som summerar informationen på denna webbsida. Att
            vi analyserat riksdagspartiernas nettonollmål och jämfört det med den
            Parisavtalskompatibla koldioxidbudget vi använder på Klimatkollen och dels
            Naturvårdsverkets prognos för hur det faktiskt ser ut att gå med Sveriges
            utsläpp med dagens politik.
          </Paragraph>
          <Paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
            eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
            in culpa qui officia deserunt mollit anim id est laborum.
          </Paragraph>
          <Figure>
            <Image
              src="/graph-1.png"
              alt="Diagram gällande partiernas utsläppsmål jämfört med Sveriges koldioxidbudget."
              layout={'responsive'}
              width={1042}
              height={592}
            />
          </Figure>
          <Paragraph>
            Här förklarar vi diagrammet. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
            aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum.
          </Paragraph>
          <Paragraph>
            Sedan går vi igenom parti för parti. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
            aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum.
          </Paragraph>
          <Paragraph>
            Parti 2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
            esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
            non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </Paragraph>
          <Paragraph>
            Parti 3, 4 och 5. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
            do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
            esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
            non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </Paragraph>
          <Paragraph>
            Parti 6. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
            esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
            non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </Paragraph>
          <Paragraph>
            Parti 7-8. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
            esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
            non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </Paragraph>
          <Paragraph>
            Här kommer en samlad analys med slutsatser. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
            ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
            in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum.
          </Paragraph>
          <Figure>
            <Image
              src="/graph-2.jpeg"
              alt="Diagram gällande partiernas utsläppsmål jämfört med Sveriges koldioxidbudget."
              layout={'responsive'}
              width={830}
              height={593}
            />
          </Figure>
          <Paragraph>
            Ovan läggs ett diagram som illustrerar en internationell utblick där vi sätter
            de svenska partiernas nettonollmål i ett sammanhang. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
            et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
            ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
            in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum.
          </Paragraph>
          <Paragraph>
            Till sist berättar vi om metoden. Vilka frågor vi ställt till partierna, hur
            vi analyserat svaren och vilka forskare som gjort det. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
            et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
            ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
            in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum.
          </Paragraph>
        </Container>
        <Container>
          <Hr />
          <H2>Runtom i landet</H2>
          <Paragraph>
            Hur går det med omställningen i din kommun?{' '}
            <Link href="/kommuner">
              <a href="/kommuner">Läs mer här</a>
            </Link>
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
