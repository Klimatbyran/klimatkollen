import { GetServerSideProps } from 'next'
import { ReactElement } from 'react'
import styled from 'styled-components'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import MetaTags from '../../components/MetaTags'
import { H2, Paragraph } from '../../components/Typography'
import PageWrapper from '../../components/PageWrapper'
import Layout from '../../components/Layout'
import Footer from '../../components/Footer/Footer'
import {
  Grid,
  GridImage,
  GridItem,
} from '../../components/shared'
import ToggleSection from '../../components/ToggleSection'
import Markdown from '../../components/Markdown'

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
  const { t } = useTranslation()
  return (
    <>
      <MetaTags title={t('about:title')} description={t('about:meta.description')} />
      <PageWrapper backgroundColor="black">
        <Container>
          <H2>{t('about:title')}</H2>
          <AiryParagraph>
            {t('about:intro')}
          </AiryParagraph>
          <ToggleSection
            header={t('about:what.title')}
            text={t('about:what.text')}
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
                      href="https://www.cemus.uu.se/wp-content/uploads/2023/12/Paris-compliant-carbon-budgets-for-Swedens-counties-.pdf"
                      target="_blank"
                      rel="noreferrer"
                    >
                      nationell koldioxidbudget
                    </a>
                    {' '}
                    som beräknats av forskare vid Uppsala universitet enligt
                    Tyndall-modellen och som sedan fördelats ut på kommunerna av
                    Klimatkollen. (
                    <a
                      href="https://klimatkollen.se/Paris_compliant_Swedish_CO2_budgets-March_2022-Stoddard&Anderson.pdf"
                      target="_blank"
                      rel="noreferrer"
                    >
                      2022 nationell koldioxidbudget
                    </a>
                    )
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
            header={t('about:content.title')}
            text={t('about:content.text')}
          />
          <ToggleSection
            header={t('about:who.title')}
            text={t('about:who.text')}
          />
          <ToggleSection
            header={t('about:problem.title')}
            text={t('about:problem.text')}
          />
          <ToggleSection
            header={t('about:support.title')}
            text={t('about:support.text')}
          />
          <ToggleSection
            header={t('about:team.title')}
            text={(
              <Grid>
                <GridItem>
                  <GridImage
                    src={Ola}
                    alt={t('about:bios.ola.name')}
                    width="200"
                    height="200"
                  />
                  <b>{t('about:bios.ola.name')}</b>
                  {t('about:bios.ola.text')}
                </GridItem>
                <GridItem>
                  <GridImage
                    src={Frida}
                    alt={t('about:bios.frida.name')}
                    width="200"
                    height="200"
                  />
                  <b>{t('about:bios.frida.name')}</b>
                  {t('about:bios.frida.text')}
                </GridItem>
                <GridItem>
                  <GridImage
                    src={Elvira}
                    alt={t('about:bios.elvira.name')}
                    width="200"
                    height="200"
                  />
                  <b>{t('about:bios.elvira.name')}</b>
                  {t('about:bios.elvira.text')}
                </GridItem>
              </Grid>
            )}
          />
          <ToggleSection
            header={t('about:board.title')}
            text={(
              <>
                <Paragraph>
                  {t('about:board.intro')}
                </Paragraph>
                <Grid>
                  <GridItem>
                    <GridImage
                      src={Christian}
                      alt={t('about:bios.christian.name')}
                      width="200"
                      height="200"
                    />
                    <b>{t('about:bios.christian.name')}</b>
                    {t('about:bios.christian.text')}
                  </GridItem>
                  <GridItem>
                    <GridImage
                      src={Anna}
                      alt={t('about:bios.anna.name')}
                      width="200"
                      height="200"
                    />
                    <b>{t('about:bios.anna.name')}</b>
                    {t('about:bios.anna.text')}
                  </GridItem>
                  <GridItem>
                    <GridImage
                      src={Maria}
                      alt={t('about:bios.maria.name')}
                      width="200"
                      height="200"
                    />
                    <b>{t('about:bios.maria.name')}</b>
                    {t('about:bios.maria.text')}
                  </GridItem>
                  <GridItem>
                    <GridImage
                      src={CJ}
                      alt={t('about:bios.carlJohan.name')}
                      width="200"
                      height="200"
                    />
                    <b>{t('about:bios.carlJohan.name')}</b>
                    {t('about:bios.carlJohan.text')}
                  </GridItem>
                  <GridItem>
                    <GridImage
                      src={Ola}
                      alt={t('about:bios.ola.name')}
                      width="200"
                      height="200"
                    />
                    <b>{t('about:bios.ola.name')}</b>
                    {t('about:bios.ola.text')}
                  </GridItem>
                  <GridItem>
                    <GridImage
                      src={Frida}
                      alt={t('about:bios.frida.name')}
                      width="200"
                      height="200"
                    />
                    <b>{t('about:bios.frida.name')}</b>
                    {t('about:bios.frida.text')}
                  </GridItem>
                </Grid>
                <Markdown>
                  {t('about:policies')}
                </Markdown>
              </>
            )}
          />
          <ToggleSection
            header={t('about:funding.title')}
            text={t('about:funding.text')}
          />
          <ToggleSection
            header={t('about:postcode.title')}
            text={t('about:postcode.text')}
          />
          <ToggleSection
            header={t('about:earlierProjects.title')}
            text={t('about:earlierProjects.text')}
          />
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
      ...await serverSideTranslations(locale as string, ['common', 'about']),
    },
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
