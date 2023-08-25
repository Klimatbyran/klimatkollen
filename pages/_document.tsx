import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
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
