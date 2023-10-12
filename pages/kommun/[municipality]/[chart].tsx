import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import { ParsedUrlQuery } from 'querystring'
import { ClimateDataService } from '../../../utils/climateDataService'
import { WikiDataService } from '../../../utils/wikiDataService'
import { Municipality as TMunicipality } from '../../../utils/types'
import { PolitycalRuleService as PoliticalRuleService } from '../../../utils/politicalRuleService'

const Municipality = dynamic(() => import('../../../components/Municipality/Municipality'))

type Props = {
  municipality: TMunicipality
  municipalitiesName: Array<string>
}

export default function Chart({
  municipality,
  municipalitiesName,
}: Props) {
  return (
    <Municipality
      municipality={municipality}
      coatOfArmsImage={municipality.CoatOfArmsImage?.ImageUrl || null}
      municipalitiesName={municipalitiesName}
    />
  )
}

interface Params extends ParsedUrlQuery {
  id: string
  chart: string
}

const cache = new Map()

export const getServerSideProps: GetServerSideProps = async ({ params, res, query }) => {
  res.setHeader('Cache-Control', `public, stale-while-revalidate=60, max-age=${((60 * 60) * 24) * 7}`)

  const id = (params as Params).municipality as string
  if (cache.get(id)) return cache.get(id)

  const climateDataService = new ClimateDataService()
  const wikiDataService = new WikiDataService()
  const politicalRuleService = new PoliticalRuleService()

  const [municipality, municipalities, wikiDataMunicipality] = await Promise.all([
    climateDataService.getMunicipality(id),
    climateDataService.getMunicipalities(),
    wikiDataService.getMunicipalityByName(id),
  ])

  municipality.Population = wikiDataMunicipality.Population
  municipality.CoatOfArmsImage = wikiDataMunicipality.CoatOfArmsImage
  municipality.Image = wikiDataMunicipality.Image

  municipality.HistoricalEmission.AverageEmissionChangeRank = municipalities.find(
    (m) => m.Name === municipality.Name,
  )?.HistoricalEmission.AverageEmissionChangeRank || null

  municipality.PoliticalRule = politicalRuleService.getPoliticalRule(id)

  // Fill the gap between budget/trend and historical emissions by putting
  // historical data into budget and trend emissions
  const maxHistorical = Math.max(
    ...municipality.HistoricalEmission.EmissionPerYear.map((e) => e.Year),
  )
  const minBudget = Math.min(...municipality.Budget.BudgetPerYear.map((f) => f.Year))
  const needed = minBudget - maxHistorical

  if (needed > 0) {
    municipality.HistoricalEmission.EmissionPerYear.slice(municipality.HistoricalEmission.EmissionPerYear.length - needed).forEach((emission) => {
      municipality.Budget.BudgetPerYear.unshift(emission)
      municipality.EmissionTrend.TrendPerYear.unshift(emission)
    })
  }

  const municipalitiesName = municipalities.map((m) => m.Name)
  const charts = (query.charts as string)?.split('+') || []

  const result = {
    props: {
      municipality,
      id,
      municipalitiesName,
      charts,
    },
  }
  cache.set(id, result)

  return result
}
