import { useRouter } from 'next/router'
import Municipality from '../../../components/Municipality'
import loadMunicipalities from '../../../utils/_load_municipality'

type Props = {
  municipality: {
    Name: string
  }
}

export default function Page(props: Props) {
  const router = useRouter()
  return (
    <Municipality
      municipality={props.municipality.Name}
      step={0}
      onNextStep={() => {
        router.replace(
          `/kommun/${router.query.municipality}/for-att-klara-parisavtalet`,
          undefined,
          { scroll: false },
        )
      }}
    />
  )
}

export const getServerSideProps = loadMunicipalities
