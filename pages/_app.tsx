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
        {/* https://favicon.io/favicon-converter/ */}
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicons/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/favicons/favicon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/favicons/favicon-512x512.png"
        />
        <meta property="og:image" content="https://klimatkollen.se/social-picture.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:image"
          content="https://klimatkollen.se/social-picture.png"
        />
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
