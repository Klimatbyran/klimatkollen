import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Theme from '../Theme'
import Ellipse from '../components/Ellipse'
import Layout from '../components/Layout'
import { Provider } from 'jotai'
import Footer from '../components/Footer'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }: AppProps) {

  const router = useRouter()

  return (
    <Provider>
      <Head>
        <title>Klimatkollen</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Theme>
        <Ellipse />
        <Layout>
          <Component {...pageProps} />
        </Layout>
        {router.pathname.indexOf('/kommun') ? <Footer /> : null}
      </Theme>
    </Provider>
  )
}

export default MyApp
