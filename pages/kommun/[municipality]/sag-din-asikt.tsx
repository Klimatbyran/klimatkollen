import loadMunicipalities from '../../../utils/_load_municipality'

export default function Page() {
  return <h1>Sag din asikt</h1>
}

export const getServerSideProps = loadMunicipalities
