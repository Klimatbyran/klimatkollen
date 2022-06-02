import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Provider } from 'jotai'
import { useRouter } from 'next/router'
import Script from 'next/script'
import CookieConsent from 'react-cookie-consent'
import { NextPage } from 'next'
import { ReactElement, ReactNode } from 'react'

import '../styles/globals.css'
import Theme from '../Theme'
import Ellipse from '../components/Ellipse'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)
  return (
    <Provider>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />

      <Script strategy="lazyOnload">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
        page_path: window.location.pathname,
        });
    `}
      </Script>
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
        <CookieConsent
          location="bottom"
          buttonText="Ok"
          style={{ background: '#6C6C6C' }}
          buttonStyle={{
            backgroundColor: '#91DFC8',
            fontSize: '13px',
          }}
          expires={150}>
          Denna site använder cookies för att förbättra användarupplevelsen.
        </CookieConsent>
        {getLayout(<Component {...pageProps} />)}
      </Theme>
    </Provider>
  )
}

export default MyApp
