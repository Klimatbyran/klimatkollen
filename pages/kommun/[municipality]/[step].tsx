import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ReactElement } from 'react'
import styled from 'styled-components'

import { ClimateDataService } from '../../../utils/climateDataService'
import { WikiDataService } from '../../../utils/wikiDataService'
import { Municipality as TMunicipality } from '../../../utils/types'
import { PoliticalRuleService } from '../../../utils/politicalRuleService'
import { ONE_WEEK_MS } from '../../../utils/shared'
import Layout from '../../../components/Layout'
import Footer from '../../../components/Footer/Footer'
import Municipality from '../../../components/Municipality/Municipality'

export const CHARTS = [
  'historiska-utslapp',
  'framtida-prognos',
  'parisavtalet',
]

const StyledLayout = styled(Layout)`
  margin-top: 48px;
`

type Props = {
  municipality: TMunicipality
  id: string
  municipalitiesNames: Array<string>
}

export default function Step({
  id,
  municipality,
  municipalitiesNames: municipalitiesName,
}: Props) {
  const router = useRouter()
  const { step } = router.query
  const stepString = typeof step === 'string' ? step : CHARTS[0]
  const stepIndex = CHARTS.indexOf(stepString) > -1 ? CHARTS.indexOf(stepString) : 1
  const stepNum = stepIndex

  const onNext = () => {
    const next = CHARTS[stepIndex + 1]
    if (!next) {
      throw new Error(`Assertion failed: No step with index ${stepIndex + 1}`)
    }
    router.replace(`/kommun/${id}/${next}`, undefined, {
      shallow: true,
      scroll: false,
    })
  }

  const onPrevious = () => {
    const prev = CHARTS[stepIndex - 1]
    if (!prev) {
      throw new Error(`Assertion failed: No step with index ${stepIndex - 1}`)
    }
    router.replace(`/kommun/${id}/${prev}`, undefined, {
      shallow: true,
      scroll: false,
    })
  }

  return (
    <Municipality
      municipality={municipality}
      step={stepNum}
      onNextStep={stepIndex < CHARTS.length - 1 ? onNext : undefined}
      onPreviousStep={stepIndex > 0 ? onPrevious : undefined}
      coatOfArmsImage={municipality.CoatOfArmsImage?.ImageUrl || null}
      municipalitiesName={municipalitiesName}
    />
  )
}

Step.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <StyledLayout>{page}</StyledLayout>
      <Footer minimal />
    </>
  )
}

interface Params extends ParsedUrlQuery {
  id: string
}

const cache = new Map()

export const getServerSideProps: GetServerSideProps = async ({ params, res, locale }) => {
  res.setHeader('Cache-Control', `public, stale-while-revalidate=60, max-age=${ONE_WEEK_MS}`)

  const id = (params as Params).municipality as string
  if (cache.get(id)) {
    return cache.get(id)
  }

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

  municipality.HistoricalEmission.HistoricalEmissionChangeRank = municipalities.find(
    (m) => m.Name === municipality.Name,
  )?.HistoricalEmission.HistoricalEmissionChangeRank || null

  municipality.PoliticalRule = politicalRuleService.getPoliticalRule(id)

  const municipalitiesNames = municipalities.map((m) => m.Name)

  const result = {
    props: {
      municipality,
      id,
      municipalitiesNames,
      ...await serverSideTranslations(locale as string, ['common', 'municipality']),
    },
  }
  cache.set(id, result)

  return result
}
