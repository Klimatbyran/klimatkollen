import loadMunicipalities from '../../../utils/_load_municipality'

export default function Page() {
  return <h1>Minska glappet</h1>
}

export const getServerSideProps = loadMunicipalities
