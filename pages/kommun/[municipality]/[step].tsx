import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import Municipality from '../../../components/Municipality'

export const STEPS = ['historiska-utslapp', 'parisavtalet', 'framtida-prognos', 'glappet']

type Props = {
  municipality: {
    id: string
    title: string
  }
}

export default function Step({ municipality }: Props) {
  const router = useRouter()
  const { step } = router.query
  const stepString = typeof step === 'string' ? step : STEPS[0]
  const stepIndex = STEPS.indexOf(stepString) > -1 ? STEPS.indexOf(stepString) : 0
  const stepNum = stepIndex

  const onNext = () => {
    const next = STEPS[stepIndex + 1]
    if (!next) throw new Error(`Assertion failed: No step with index ${stepIndex + 1}`)
    router.replace(`/kommun/${municipality.id}/${next}`, undefined, {
      shallow: true,
      scroll: false,
    })
  }

  const onPrevious = () => {
    const prev = STEPS[stepIndex - 1]
    if (!prev) throw new Error(`Assertion failed: No step with index ${stepIndex - 1}`)
    router.replace(`/kommun/${municipality.id}/${prev}`, undefined, {
      shallow: true,
      scroll: false,
    })
  }

  return (
    <Municipality
      municipality={municipality.title}
      step={stepNum}
      onNextStep={stepIndex < STEPS.length - 1 ? onNext : undefined}
      onPreviousStep={stepIndex > 0 ? onPrevious : undefined}
    />
  )
}

interface Params extends ParsedUrlQuery {
  id: string
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = (params as Params).municipality as string
  const title = id[0].toUpperCase() + id.slice(1)

  return {
    props: {
      municipality: {
        id,
        title,
      },
    },
  }
}
