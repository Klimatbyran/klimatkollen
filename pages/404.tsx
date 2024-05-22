import router from 'next/router'
import styled from 'styled-components'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'

import { H1 } from '../components/Typography'
import Layout from '../components/Layout'
import PageWrapper from '../components/PageWrapper'

const Button = styled.button`
  height: 56px;
  background: ${({ theme }) => theme.midGreen};
  border: 0;
  border-radius: 4px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  &:hover {
    background: ${({ theme }) => theme.lightGreen};
  }
`

function FourOhFour() {
  const handleClick = () => {
    router.push('/')
  }

  const { t } = useTranslation()

  return (
    <Layout>
      <PageWrapper>
        <H1>{t('common:errors.notFound')}</H1>
        <Button onClick={handleClick}>{t('common:actions.goHome')}</Button>
      </PageWrapper>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale as string, ['common']),
  },
})

export default FourOhFour
