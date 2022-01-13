import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Theme from '../Theme'
import Ellipse from '../components/Ellipse';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Theme>
      <Ellipse />
      <Component {...pageProps} />
    </Theme>
  )
}

export default MyApp
