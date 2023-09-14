import {
  Html, Head, Main, NextScript,
} from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href="/roboto/roboto-v29-latin-300.woff2"
          rel="preload"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          href="/roboto/roboto-v29-latin-regular.woff2"
          rel="preload"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          href="/roboto/roboto-v29-latin-500.woff2"
          rel="preload"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          href="/roboto/roboto-v29-latin-700.woff2"
          rel="preload"
          as="font"
          type="font/woff2"
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
