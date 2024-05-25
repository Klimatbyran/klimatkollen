import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { ReactElement } from 'react'
import styled from 'styled-components'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import MetaTags from '../../components/MetaTags'
import { H2 } from '../../components/Typography'
import { ClimateDataService } from '../../utils/climateDataService'
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
`

function Utslappsberakningar() {
  const { t } = useTranslation()
  return (
    <>
      <MetaTags
        title={t('utslappsberakningar:meta.title')}
        description={t('utslappsberakningar:meta.description')}
        imageUrl="/images/totala-utslapp-alla-partier.jpg"
      />
      <PageWrapper backgroundColor="black">
        <Container>
          <H2>
            {t('utslappsberakningar:title')}
          </H2>

          <Markdown>{t('utslappsberakningar:part1')}</Markdown>

          <Figure>
            <Image
              src="/images/totala-utslapp-alla-partier.jpg"
              alt={t('utslappsberakningar:imgAlt1')}
              width={800}
              height={800}
            />
          </Figure>

          <Markdown>{t('utslappsberakningar:part2')}</Markdown>

          <Figure>
            <Image
              src="/images/utslapp-partiers-politik.jpg"
              alt={t('utslappsberakningar:imgAlt2')}
              width={800}
              height={800}
            />
          </Figure>

          <Markdown>{t('utslappsberakningar:part3')}</Markdown>
        </Container>
      </PageWrapper>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res, locale }) => {
  const municipalities = new ClimateDataService().getMunicipalities()
  if (municipalities.length < 1) throw new Error('No municipalities found')

  res.setHeader(
    'Cache-Control',
    `public, stale-while-revalidate=60, max-age=${ONE_WEEK_MS}`,
  )

  return {
    props: { municipalities, ...await serverSideTranslations(locale as string, ['common', 'utslappsberakningar']) },
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
