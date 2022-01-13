import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Theme from '../Theme'
import Ellipse from '../components/Ellipse'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="wrapper">
      <Theme>
        <Ellipse />
        <Component {...pageProps} />
      </Theme>
    </div>
  )
}

export default MyApp
