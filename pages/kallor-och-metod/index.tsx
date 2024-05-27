import { GetServerSideProps } from 'next'
import { ReactElement } from 'react'
import styled from 'styled-components'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import MetaTags from '../../components/MetaTags'
import { H2, Paragraph } from '../../components/Typography'
import { ClimateDataService } from '../../utils/climateDataService'
import PageWrapper from '../../components/PageWrapper'
import Layout from '../../components/Layout'
import Footer from '../../components/Footer/Footer'
import ToggleSection from '../../components/ToggleSection'
import { ONE_WEEK_MS } from '../../utils/shared'

const Container = styled.section`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
`

const AiryParagraph = styled(Paragraph)`
  margin-bottom: 32px;
`

function KoM() {
  const { t } = useTranslation()
  return (
    <>
      <MetaTags
        title={t('kallorMetod:title')}
        description={t('kallorMetod:meta.description')}
      />
      <PageWrapper backgroundColor="black">
        <Container>
          <H2>{t('kallorMetod:title')}</H2>
          <AiryParagraph>
            {t('kallorMetod:intro')}
          </AiryParagraph>
          <ToggleSection
            header={t('kallorMetod:paris.title')}
            text={t('kallorMetod:paris.text')}
          />
          <ToggleSection
            header={t('kallorMetod:sources.title')}
            text={t('kallorMetod:sources.text')}
          />
          <ToggleSection
            header={t('kallorMetod:co2budget.title')}
            text={t('kallorMetod:co2budget.text')}
          />
          <ToggleSection
            header={t('kallorMetod:emissionTypes.title')}
            text={t('kallorMetod:emissionTypes.text')}
          />
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
    props: {
      municipalities,
      ...await serverSideTranslations(locale as string, ['common', 'kallorMetod']),
    },
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
