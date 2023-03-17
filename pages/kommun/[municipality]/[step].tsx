import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import Municipality from '../../../components/Municipality'
import { ClimateDataService } from '../../../utils/climateDataService'
import { WikiDataService } from '../../../utils/wikiDataService'
import { Municipality as TMunicipality } from '../../../utils/types'
import { PolitycalRuleService } from '../../../utils/politicalRuleService'

export const STEPS = [
  'historiska-utslapp',
  'parisavtalet',
  'framtida-prognos',
]

type Props = {
  municipality: TMunicipality
  id: string
  municipalitiesName: Array<string>
  placeholder: string
}

export default function Step({
  id,
  municipality,
  municipalitiesName,
  placeholder,
}: Props) {
  const router = useRouter()
  const { step } = router.query
  const stepString = typeof step === 'string' ? step : STEPS[0]
  const stepIndex = STEPS.indexOf(stepString) > -1 ? STEPS.indexOf(stepString) : 1
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
      municipalitiesName={municipalitiesName}
      placeholder={placeholder}
    />
  )
}

interface Params extends ParsedUrlQuery {
  id: string
}

const cache = new Map()

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  res.setHeader('Cache-Control', 'public, stale-while-revalidate=60, max-age=' + ((60*60)*24)*7)


  const id = (params as Params).municipality as string

  if (cache.get(id)) return cache.get(id)

  const climateDataService = new ClimateDataService()

  const [municipality, municipalities, wikiDataMunicipality] = await Promise.all([
    climateDataService.getMunicipality(id),
    climateDataService.getMunicipalities(),
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

  // Fill the gap between budget/trend and historical emissions by putting
  // historical data into budget and trend emissions
  const maxHistorical = Math.max(
    ...municipality.HistoricalEmission.EmissionPerYear.map((e) => e.Year),
  )
  const minBudget = Math.min(...municipality.Budget.BudgetPerYear.map((f) => f.Year))
  const needed = minBudget - maxHistorical
  
  if (needed > 0) {
    municipality.HistoricalEmission.EmissionPerYear.slice(municipality.HistoricalEmission.EmissionPerYear.length-needed).forEach((emission) => {
      municipality.Budget.BudgetPerYear.unshift(emission)
      municipality.EmissionTrend.TrendPerYear.unshift(emission)
    })
  }

  const municipalitiesName = municipalities.map((item) => item.Name)

  const result = {
    props: {
      municipality,
      id,
      municipalitiesName,
    },
  }

  cache.set(id, result)

  return result
}
