import { GetServerSideProps } from 'next'
import { ReactElement } from 'react'
import styled from 'styled-components'

import MetaTags from '../../components/MetaTags'
import { H2, Paragraph } from '../../components/Typography'
import { EmissionService } from '../../utils/emissionService'
import PageWrapper from '../../components/PageWrapper'
import Layout from '../../components/Layout'
import Footer from '../../components/Footer'
import { devices } from '../../utils/devices'

const Container = styled.section`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
`

const OmOss = () => {
  return (
    <>
      <MetaTags
        title="Om oss"
        description="Om Klimatkollen"
      />
      <PageWrapper backgroundColor="black">
        <Container>
          <H2>
            Om oss
          </H2>

          <Paragraph>
            Velit placeat reiciendis quia dolorum quaerat minus at sed. Hic sint vero fugiat qui neque impedit. 
            Repellendus ipsum magnam non. Molestias est voluptatum et enim ut maxime saepe. 
            Laboriosam dolorem atque porro perferendis.
          </Paragraph>
        </Container>
      </PageWrapper>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const municipalities = new EmissionService().getMunicipalities()
  if (municipalities.length < 1) throw new Error('No municipalities found')

  res.setHeader(
    'Cache-Control',
    'public, stale-while-revalidate=60, max-age=' + 60 * 60 * 24 * 7,
  )

  return {
    props: { municipalities },
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
