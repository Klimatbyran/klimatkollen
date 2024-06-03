import { useEffect, useState } from 'react'
import router from 'next/router'
import styled from 'styled-components'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'

import { H1, H5 } from '../components/Typography'
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
  margin-top: 32px;
  &:hover {
    background: ${({ theme }) => theme.lightGreen};
  }
`

function FourOhFour() {
  const handleClick = () => {
    router.push('/')
  }

  const { t } = useTranslation()
  const [timeLeft, setTimeLeft] = useState(4)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval)
          router.push('/')
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Layout>
      <PageWrapper backgroundColor="black">
        <H1>{t('common:errors.notFound')}</H1>
        <H5>
          {t('common:errors.notFoundSubtitle')}
          {' '}
          {timeLeft >= 0 ? timeLeft : 0}
          ...
        </H5>
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
