/* eslint-disable no-console */
/* eslint-disable max-len */
import styled from 'styled-components'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import Graph from '../Graph'
import { H2, Paragraph } from '../Typography'
import InfoModal from '../InfoModal'
import MetaTags from '../MetaTags'
import { IconButton } from '../shared'
import { Municipality as TMunicipality } from '../../utils/types'
import { devices } from '../../utils/devices'
import ArrowRight from '../../public/icons/arrow-right-white.svg'
import ArrowLeft from '../../public/icons/arrow-left-white.svg'
import Info from '../../public/icons/info.svg'

const GraphWrapper = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: column;
`

const InfoButton = styled(IconButton)`
  height: 21px;
`

const InfoButtonWrapper = styled.div`
  @media only screen and (${devices.tablet}) {
    display: flex;
    justify-content: start;
    width: 100%;
    margin-top: -50px;
    margin-right: 1rem;
    justify-content: end;
  }
`

const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;

  > * {
    user-select: none;
  }
`

const END_YEAR = 2050

const MANDATE_MAX_CHANGE = 2
const MANDATE_MIN_CHANGE = 1

type IssuesProps = {
  municipality: TMunicipality
  chart: number
  onNextStep: (() => void) | undefined
  onPreviousStep: (() => void) | undefined
}

function range(start: number, end: number) {
  return Array.from({ length: end - start }, (_, i) => i + start)
}

const adjustablePeriods = range(2020, 2051).map((i) => [i, i + 1])

function MunicipalityEmissionGraph({
  municipality,
  chart: step,
  onNextStep,
  onPreviousStep,
}: IssuesProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const q = router.query['g[]']

  const defaultPeriods = useMemo(
    () => adjustablePeriods.map((f) => ({ start: f[0], end: f[1], change: 1 })),
    [],
  )

  // Load mandate change values from ?g[] parameter in URL
  const [mandateChanges] = useState<typeof defaultPeriods>(() => {
    if (typeof q === 'undefined') return defaultPeriods

    const g = (Array.isArray(q) ? q : [q])
      .map((v) => parseFloat(v))
      .map((f) => Math.max(MANDATE_MIN_CHANGE, Math.min(MANDATE_MAX_CHANGE, f)))

    if (g.length !== adjustablePeriods.length) {
      console.debug('Incorrect number of g parameters')
      return defaultPeriods
    }

    if (g.some((v) => Number.isNaN(v))) {
      console.debug('Non-number values in g parameter')
      return defaultPeriods
    }

    return defaultPeriods.map((v, idx) => ({
      ...v,
      change: g[idx],
    }))
  })

  const lastYearWithData = municipality.HistoricalEmission.EmissionPerYear[municipality.HistoricalEmission.EmissionPerYear.length - 1]?.Year
  const lastYearWithApproximatedData = municipality.ApproximatedHistoricalEmission.EmissionPerYear[municipality.ApproximatedHistoricalEmission.EmissionPerYear.length - 1]?.Year
  const firstYearWithBudget = municipality.Budget.BudgetPerYear[0]?.Year

  const hasApproximatedData = lastYearWithApproximatedData != null

  const CHARTS: {
    [index: number]: {
      text: string
      buttonText: string
      body: string
      info: string
    }
  } = {
    0: {
      text: t('municipality:graphs.historical.text'),
      buttonText: t('municipality:graphs.historical.buttonText'),
      body: t('municipality:graphs.historical.body'),
      info: hasApproximatedData
        ? t('municipality:graphs.historical.infoApproximated', { lastYearWithData, lastYearWithApproximatedData })
        : t('municipality:graphs.historical.info', { lastYearWithData }),
    },
    1: {
      text: t('municipality:graphs.trend.text'),
      buttonText: t('municipality:graphs.trend.buttonText'),
      body: t('municipality:graphs.trend.body'),
      info: `${t('municipality:graphs.trend.info')}${
        hasApproximatedData ? '' : ` ${t('municipality:graphs.trend.infoDifference')}`}`,
    },
    2: {
      text: t('municipality:graphs.paris.text'),
      buttonText: t('municipality:graphs.paris.buttonText'),
      body: t('municipality:graphs.paris.body'),
      info: t('municipality:graphs.paris.info', { firstYearWithBudget }),
    },
  }

  const stepConfig = CHARTS[step]
  if (!stepConfig) {
    throw new Error('Render a sort of 500 page I guess')
  }

  const { text, body } = stepConfig
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  let shareUrl = `${baseUrl}${router.asPath}`
  if (step === 3) {
    const qry = mandateChanges.map((c) => `g[]=${c.change}`).join('&')
    shareUrl = `${shareUrl}?${qry}`
  }

  const toggleModal = () => {
    if (!isOpen) {
      document.body.style.overflow = 'hidden'
      setIsOpen(true)
    } else {
      document.body.style.overflow = ''
      setIsOpen(false)
    }
  }

  return (
    <>
      <MetaTags
        title={t('municipality:shareTitle', { name: municipality.Name })}
        description={t('municipality:shareText')}
        url={shareUrl}
      />
      <GraphWrapper>
        <H2>{text}</H2>
        <Paragraph>{body}</Paragraph>
        <InfoButtonWrapper>
          <InfoButton type="button" aria-label={t('municipality:aboutGraph')} onClick={toggleModal}>
            <Info />
          </InfoButton>
        </InfoButtonWrapper>
        <Graph
          step={step}
          historical={municipality.HistoricalEmission.EmissionPerYear}
          approximated={municipality.ApproximatedHistoricalEmission.EmissionPerYear}
          trend={municipality.EmissionTrend.TrendPerYear}
          budget={municipality.Budget.BudgetPerYear}
          maxVisibleYear={END_YEAR}
        />
        <Grid>
          {onPreviousStep ? (
            <IconButton onClick={onPreviousStep}>
              <ArrowLeft />
              {CHARTS[step - 1].buttonText}
            </IconButton>
          ) : (
            <div />
          )}
          <span style={{ textAlign: 'center' }}>{CHARTS[step].buttonText}</span>
          {onNextStep && (
            <IconButton onClick={onNextStep} style={{ justifyContent: 'flex-end' }}>
              {CHARTS[step + 1]?.buttonText}
              <ArrowRight />
            </IconButton>
          )}
        </Grid>
      </GraphWrapper>

      {isOpen && (
        <InfoModal
          close={toggleModal}
          text={stepConfig.info}
          scrollY={window.scrollY}
        />
      )}
    </>
  )
}

export default MunicipalityEmissionGraph
