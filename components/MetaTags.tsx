import Head from 'next/head'

type Props = {
  title?: string
  description?: string
  imageUrl?: string
  url?: string
}

export default function MetaTags({
  title, description, imageUrl, url,
}: Props) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />

      {/* <meta property="twitter:card" content="summary_large_image" /> */}
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />

      {url && (
        <>
          <meta property="og:url" content={url} />
          <meta property="twitter:url" content={url} />
          <link rel="canonical" href={url} />
        </>
      )}
      {imageUrl && (
        <>
          <meta property="twitter:image" content={imageUrl} />
          <meta property="og:image" content={imageUrl} />
        </>
      )}
    </Head>
  )
}
