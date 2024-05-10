/* eslint-disable react/jsx-props-no-spreading */
import Document, {
  DocumentContext, Head, Html, Main, NextScript,
} from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="/fonts/Anonymous_Pro/AnonymousPro-Regular.tff"
            rel="preload"
            as="font"
            type="font/tff"
            crossOrigin="anonymous"
          />
          <link
            href="/fonts/Anonymous_Pro/AnonymousPro-Italic.tff"
            rel="preload"
            as="font"
            type="font/tff"
            crossOrigin="anonymous"
          />
          <link
            href="/fonts/Anonymous_Pro/AnonymousPro-Bold.tff"
            rel="preload"
            as="font"
            type="font/tff"
            crossOrigin="anonymous"
          />
          <link
            href="/fonts/Source_Serif_4/SourceSerif4-VariableFont_opsz,wght.tff"
            rel="preload"
            as="font"
            type="font/tff"
            crossOrigin="anonymous"
          />
          <link
            href="/fonts/Source_Serif_4/SourceSerif4-Italic-VariableFont_opsz,wght.tff"
            rel="preload"
            as="font"
            type="font/tff"
            crossOrigin="anonymous"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }

  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () => originalRenderPage({
        enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
      })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }
}
