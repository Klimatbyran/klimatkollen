import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import Municipality from '../../../components/Municipality'
import { EmissionService } from '../../../utils/emissionService'
import { WikiDataService } from '../../../utils/wikiDataService'
import { Municipality as TMunicipality } from '../../../utils/types'
import { PolitycalRuleService } from '../../../utils/politicalRuleService'

export const STEPS = [
  'historiska-utslapp',
  'parisavtalet',
  'framtida-prognos',
  'glappet',
  'min-plan',
]

type Props = {
  municipality: TMunicipality
  id: string
}

export default function Step({ id, municipality }: Props) {
  const router = useRouter()
  const { step } = router.query
  const stepString = typeof step === 'string' ? step : STEPS[0]
  const stepIndex = STEPS.indexOf(stepString) > -1 ? STEPS.indexOf(stepString) : 0
  const stepNum = stepIndex

  const onNext = () => {
    const next = STEPS[stepIndex + 1]
    if (!next) throw new Error(`Assertion failed: No step with index ${stepIndex + 1}`)
    router.replace(`/kommun/${id}/${next}`, undefined, {
      shallow: true,
      scroll: false,
    })
  }

  const onPrevious = () => {
    const prev = STEPS[stepIndex - 1]
    if (!prev) throw new Error(`Assertion failed: No step with index ${stepIndex - 1}`)
    router.replace(`/kommun/${id}/${prev}`, undefined, {
      shallow: true,
      scroll: false,
    })
  }

  return (
    <Municipality
      municipality={municipality}
      step={stepNum}
      onNextStep={stepIndex < STEPS.length - 1 ? onNext : undefined}
      onPreviousStep={stepIndex > 0 ? onPrevious : undefined}
      coatOfArmsImage={municipality.CoatOfArmsImage?.ImageUrl || null}
      historicalEmissions={municipality.HistoricalEmission.EmissionPerYear}
      budgetedEmissions={municipality.Budget.BudgetPerYear}
      trendingEmissions={municipality.EmissionTrend.TrendPerYear || []}
    />
  )
}

interface Params extends ParsedUrlQuery {
  id: string
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = (params as Params).municipality as string

  const emissionService = new EmissionService()

  const [municipality, municipalities, wikiDataMunicipality] = await Promise.all([
    emissionService.getMunicipality(id),
    emissionService.getMunicipalities(),
    new WikiDataService().getMunicipalityByName(id),
  ])

  municipality.Population = wikiDataMunicipality.Population
  municipality.CoatOfArmsImage = wikiDataMunicipality.CoatOfArmsImage
  municipality.Image = wikiDataMunicipality.Image

  municipality.HistoricalEmission.AverageEmissionChangeRank =
    municipalities.find((m) => {
      return m.Name == municipality.Name
    })?.HistoricalEmission.AverageEmissionChangeRank || null

  municipality.PoliticalRule = new PolitycalRuleService().getPoliticalRule(id)

  const maxHistorical = Math.max(
    ...municipality.HistoricalEmission.EmissionPerYear.map((e) => e.Year),
  )
  const minBudget = Math.min(...municipality.Budget.BudgetPerYear.map((f) => f.Year))

  // Fill the gap between budgeted and historical emissions by putting
  // budget data into historical emissions
  const needed = minBudget - maxHistorical
  if (needed > 0) {
    municipality.Budget.BudgetPerYear.slice(0, needed).forEach((emission) => {
      municipality.HistoricalEmission.EmissionPerYear.push(emission)
    })
  }

  return {
    props: {
      municipality,
      id,
    },
  }
}
