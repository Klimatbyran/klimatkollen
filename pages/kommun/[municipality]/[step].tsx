import { useRouter } from 'next/router'
import Municipality from '../../../components/Municipality'

export const STEPS = ['historiska-utslapp', 'parisavtalet', 'framtida-prognos', 'glappet']

export default function Step() {
  const router = useRouter()
  const municipality = router.query.municipality as string
  const { step } = router.query
  const stepString = typeof step === 'string' ? step : STEPS[0]
  const stepIndex = STEPS.indexOf(stepString) > -1 ? STEPS.indexOf(stepString) : 0
  const stepNum = stepIndex

  const onNext = () => {
    const next = STEPS[stepIndex + 1]
    if (!next) throw new Error(`Assertion failed: No step with index ${stepIndex + 1}`)
    router.replace(`/kommun/${municipality}/${next}`, undefined, { scroll: false })
  }

  const onPrevious = () => {
    const prev = STEPS[stepIndex - 1]
    if (!prev) throw new Error(`Assertion failed: No step with index ${stepIndex - 1}`)
    router.replace(`/kommun/${municipality}/${prev}`, undefined, { scroll: false })
  }

  return (
    <Municipality
      municipality={municipality}
      step={stepNum}
      onNextStep={stepIndex < STEPS.length - 1 ? onNext : undefined}
      onPreviousStep={stepIndex > 0 ? onPrevious : undefined}
    />
  )
}

export async function getServerSideProps() {
  const municipalities = await fetch(
    'http://klimatkollen.vercel.app/api/municipalities',
  ).then((res) => res.json())
  return {
    props: { municipalities },
  }
}
