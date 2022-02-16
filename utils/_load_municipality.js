const FIVE_MINUTES = 60 * 5

export default async function loadMunicipalities({ res, query }) {
  const path = query.municipality
  const municipality = await fetch(
    `https://klimatkollen.vercel.app/api/municipality/${path}`,
  ).then((res) => res.json())

  console.log({ municipality })

  res.setHeader('Cache-Control', `public, s-maxage=${FIVE_MINUTES}`)

  return {
    props: { municipality },
  }
}
