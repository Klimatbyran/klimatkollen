import loadMunicipalities from '../../../utils/_load_municipality'

export default function Page() {
  return <h1>Va e glappet</h1>
}

export const getServerSideProps = loadMunicipalities
