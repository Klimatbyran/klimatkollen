export default async function loadMunicipalities(context) {
  const query = context.query.municipality
  const municipality = await fetch(
    `http://klimatkollen.vercel.app/api/municipality/${query}`,
  ).then((res) => res.json())

  console.log({ municipality })

  return {
    props: { municipality },
  }
}
