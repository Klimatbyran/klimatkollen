/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-restricted-globals */
/* eslint-disable max-len */
import styled from 'styled-components'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
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

function MunicipalityEmissionGraph({
  municipality,
  chart: step,
  onNextStep,
  onPreviousStep,
}: IssuesProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const q = router.query['g[]']

  const range = (start: number, end: number) =>
    Array.from({ length: end - start }, (_, i) => i + start)

  const adjustablePeriods = range(2020, 2051).map((i) => [i, i + 1])

  const defaultPeriods = useMemo(
    () => adjustablePeriods.map((f) => ({ start: f[0], end: f[1], change: 1 })),
    [adjustablePeriods],
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

  type ShareTextFn = (name: string) => string

  const CHARTS: {
    [index: number]: {
      text: string
      buttonText: string
      body: string
      shareText: ShareTextFn
    }
  } = {
    0: {
      text: 'Historiska utsläpp',
      buttonText: 'Historiskt',
      body: 'Koldioxidutsläpp i kommunen sedan 1990. 2022–2024 är baserat på prognos.',
      shareText: (_name) =>
        'Se historiska utsläpp tills idag, vilken minskning som krävs för att klara Parisavtalet och utsläppen framåt med nuvarande trend.',
    },
    1: {
      text: 'Om vi fortsätter som idag',
      buttonText: 'Trend',
      body: 'Utsläppen de kommande åren baserat på nuvarande trend.',
      shareText: (_name) =>
        'Se historiska utsläpp tills idag, vilken minskning som krävs för att klara Parisavtalet och utsläppen framåt med nuvarande trend.',
    },
    2: {
      text: 'För att nå Parisavtalet',
      buttonText: 'Parisavtalet',
      body: 'Så mycket skulle utsläppen behöva minska för att vara i linje med 1,5-gradersmålet.',
      shareText: (_name) =>
        'Se historiska utsläpp tills idag, vilken minskning som krävs för att klara Parisavtalet och utsläppen framåt med nuvarande trend.',
    },
  }

  const stepConfig = CHARTS[step]
  if (!stepConfig) {
    throw new Error('Render a sort of 500 page I guess')
  }

  const { text, shareText, body } = stepConfig
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  let shareUrl = `${baseUrl}${router.asPath}`
  if (step === 3) {
    const qry = mandateChanges.map((c) => `g[]=${c.change}`).join('&')
    shareUrl = `${shareUrl}?${qry}`
  }

  const toggleModal = () => {
    // eslint-disable-next-line no-shadow
    const { body } = document
    if (!isOpen) {
      body.style.overflow = 'hidden'
      setIsOpen(true)
    } else {
      body.style.overflow = ''
      setIsOpen(false)
    }
  }

  const lastYearWithData = municipality.HistoricalEmission.EmissionPerYear[municipality.HistoricalEmission.EmissionPerYear.length - 1]?.Year
  const lastYearWithApproximatedData = municipality.ApproximatedHistoricalEmission.EmissionPerYear[municipality.ApproximatedHistoricalEmission.EmissionPerYear.length - 1]?.Year
  const firstYearWithBudget = municipality.Budget.BudgetPerYear[0]?.Year

  const hasApproximatedData = lastYearWithApproximatedData != null

  return (
    <>
      <MetaTags
        title={`Klimatkollen — Hur går det i ${municipality.Name}?`}
        description={shareText(municipality.Name)}
        url={shareUrl}
      />
      <GraphWrapper>
        <H2>{text}</H2>
        <Paragraph>{body}</Paragraph>
        <InfoButtonWrapper>
          <InfoButton type="button" aria-label="Om grafen" onClick={toggleModal}>
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
      {step === 0 && isOpen && (
        <InfoModal
          close={toggleModal}
          text={
            hasApproximatedData
              ? `Koldioxidutsläpp i kommunen mellan 1990 och ${lastYearWithApproximatedData}, där ${lastYearWithData} är senast tillgängliga data. Basår för beräkningar av Sveriges klimatutsläpp är 1990. Den streckade linjen mellan åren ${lastYearWithData}-${lastYearWithApproximatedData} är approximerad data baserad på den genomsnittliga årliga utsläppsförändringen i kommunen sedan Parisavtalet 2015.`
              : `Koldioxidutsläpp i kommunen mellan 1990 och ${lastYearWithData}, vilket är senast tillgängliga data. Basår för beräkningar av Sveriges klimatutsläpp är 1990.`
          }
          scrollY={scrollY}
        />
      )}
      {step === 1 && isOpen && (
        <InfoModal
          close={toggleModal}
          text={`Trendlinjen är baserad på den genomsnittliga årliga utsläppsförändringen i kommunen sedan Parisavtalet 2015.${
            hasApproximatedData ? '' : ' Hacket i kurvan för vissa kommuner beror på att genomsnittet skiljer sig från det senaste årets nivå.'}`}
          scrollY={scrollY}
        />
      )}
      {step === 2 && isOpen && (
        <InfoModal
          close={toggleModal}
          text={`Den utsläppsminskning som krävs för att vara i linje med Parisavtalet och en koldioxidbudget som
          motsvarar 50% sannolikhet att hålla den globala uppvärmningen under 1,5 grader. Funktionen visas som exponentiellt avtagande,
          det vill säga utsläppen minskar med ett fast antal procent varje år. Startår är ${firstYearWithBudget}, vilket är från vilket år 
          budgeten är satt.`}
          scrollY={scrollY}
        />
      )}
    </>
  )
}

export default MunicipalityEmissionGraph
