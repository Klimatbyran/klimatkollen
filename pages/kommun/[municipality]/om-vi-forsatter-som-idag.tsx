import loadMunicipalities from '../../../utils/_load_municipality'

export default function Page() {
  return <h1>Om vi fortsatter som idag</h1>
}

export const getServerSideProps = loadMunicipalities
