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
import { Grid, GridImage, GridItem } from '../../components/shared'
import ToggleSection from '../../components/ToggleSection'
import Markdown from '../../components/Markdown'
import { ONE_WEEK_MS } from '../../utils/shared'

const Ola = '/team/ola.jpg'
const Frida = '/team/frida.jpg'
const Elvira = '/team/elvira.jpg'
const Samuel = '/team/samuel.png'
const Alex = '/team/alex.jpg'
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
      <PageWrapper>
        <Container>
          <H2>{t('about:title')}</H2>
          <AiryParagraph>{t('about:intro')}</AiryParagraph>
          <ToggleSection header={t('about:what.title')} text={t('about:what.text')} />
          <ToggleSection
            header={t('about:content.title')}
            text={t('about:content.text')}
          />
          <ToggleSection header={t('about:who.title')} text={t('about:who.text')} />
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
            text={
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
                <GridItem>
                  <GridImage
                    src={Samuel}
                    alt={t('about:bios.samuel.name')}
                    width="200"
                    height="200"
                  />
                  <b>{t('about:bios.samuel.name')}</b>
                  {t('about:bios.samuel.text')}
                </GridItem>
                <GridItem>
                  <GridImage
                    src={Alex}
                    alt={t('about:bios.alex.name')}
                    width="200"
                    height="200"
                  />
                  <b>{t('about:bios.alex.name')}</b>
                  {t('about:bios.alex.text')}
                </GridItem>
                <GridItem>
                  <GridImage
                    src={Christian}
                    alt={t('about:bios.christianTeam.name')}
                    width="200"
                    height="200"
                  />
                  <b>{t('about:bios.christianTeam.name')}</b>
                  {t('about:bios.christianTeam.text')}
                </GridItem>
              </Grid>
            }
          />
          <ToggleSection
            header={t('about:board.title')}
            text={
              <>
                <Paragraph>{t('about:board.intro')}</Paragraph>
                <Grid>
                  <GridItem>
                    <GridImage
                      src={Christian}
                      alt={t('about:bios.christianBoard.name')}
                      width="200"
                      height="200"
                    />
                    <b>{t('about:bios.christianBoard.name')}</b>
                    {t('about:bios.christianBoard.text')}
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
                <Markdown>{t('about:policies')}</Markdown>
              </>
            }
          />
          <ToggleSection
            header={t('about:funding.title')}
            text={t('about:funding.text')}
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
    `public, stale-while-revalidate=60, max-age=${ONE_WEEK_MS}`,
  )

  return {
    props: {
      ...(await serverSideTranslations(locale as string, ['common', 'about'])),
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
