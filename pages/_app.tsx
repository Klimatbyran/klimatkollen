import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Theme from '../Theme'
import Ellipse from '../components/Ellipse'
import Layout from '../components/Layout'
import { Provider } from 'jotai'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <Theme>
        <Ellipse />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Theme>
    </Provider>
  )
}

export default MyApp
