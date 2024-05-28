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
import { ONE_WEEK_MS } from '../../utils/shared'

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

          <Markdown>{t('partierna:part2')}</Markdown>
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
