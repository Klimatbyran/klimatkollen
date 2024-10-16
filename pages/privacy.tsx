import styled from 'styled-components'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'

import Layout from '../components/Layout'
import PageWrapper from '../components/PageWrapper'
import Markdown from '../components/Markdown'
import { H1, H2 } from '../components/Typography'

function FourOhFour() {
  const { t } = useTranslation()

  return (
    <Layout>
      <PageWrapper>
        <Markdown components={{
          h1: styled(H1)`
            margin-bottom: 1rem;
          `,
          h2: styled(H2)`
            margin: 2rem 0 1rem;
          `,
        }}
        >
          {t('privacy:privacyPolicy')}
        </Markdown>
      </PageWrapper>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale as string, ['common', 'privacy']),
  },
})

export default FourOhFour
