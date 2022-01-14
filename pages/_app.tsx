import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Theme from '../Theme'
import Layout from '../components/Layout'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Theme>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Theme>
  )
}

export default MyApp
