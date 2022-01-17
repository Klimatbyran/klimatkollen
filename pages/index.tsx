import type { NextPage } from 'next'
import Head from 'next/head'
import { H1 } from '../components/Typography'
import ShareButton from '../components/ShareButton'

const Home: NextPage = () => {
  function handleClick() {
    // Function to handle click on share button
  }

  return (
    <div>
      <Head>
        <title>Klimatkollen</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <H1>Klimatkollen</H1>
      <ShareButton handleClick={handleClick} />
    </div>
  )
}

export default Home
