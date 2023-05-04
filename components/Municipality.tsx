/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import styled from 'styled-components'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/router'

import ArrowRight from '../public/icons/arrow-right-white.svg'
import ArrowLeft from '../public/icons/arrow-left-white.svg'
import Info from '../public/icons/info.svg'
import EVCar from '../public/icons/ev_car.svg'
import { H1, H2, H3, H5, Paragraph, ParagraphBold } from './Typography'
import BackArrow from './BackArrow'
import MetaTags from './MetaTags'
import InfoModal from './InfoModal'
import PageWrapper from './PageWrapper'
import DropDown from './DropDown'
import Graph from './Graph'
import ScoreCard from './ScoreCard'
import FactSection from './FactSection'
import { IconButton } from './shared'
import { devices } from '../utils/devices'
import { EmissionPerYear, Municipality as TMunicipality } from '../utils/types'

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

const EmissionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 48px;
`

const CoatOfArmsImage = styled.img`
  width: 60px;
`

const HeaderSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`

const TotalCo2 = styled.div`
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  background-color: ${(props) => props.color};
  color: #2d2d2d;
`

const Bottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;

  @media only screen and (${devices.tablet}) {
    // flex-direction: row-reverse;
  }
`

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`

const StyledH2 = styled(H2)`
  margin-top: 32px;
  margin-bottom: 32px;
  width: 100%;
`

const StyledH5 = styled(H5)`
  margin: 32px 0 32px 16px;
`

const DropDownSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 30px;

  @media only screen and (${devices.tablet}) {
    margin-top: 50px;
    text-align: center;
    align-items: center;
    padding-right: 60px;
  }
`

const Legends = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;

  @media all and (${devices.tablet}) {
    justify-content: center;
  }
`

const Legend = styled.label`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3125rem;
  align-items: center;

  @media all and (${devices.tablet}) {
    flex-direction: column;
    justify-content: center;
  }
`

const Circle = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  display: inline-block;
`

const MANDATE_MAX_CHANGE = 2
const MANDATE_MIN_CHANGE = 1

const START_YEAR = 2020
const END_YEAR = 2050

type ShareTextFn = (name: string) => string
const STEPS: {
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
    body: 'Koldioxidutsläpp i kommunen sedan 1990.',
    shareText: (_name) =>
      `Se historiska utsläpp tills idag, vilken minskning som krävs för att klara Parisavtalet och utsläppen framåt med nuvarande trend.`,
  },
  1: {
    text: 'För att nå Parisavtalet',
    buttonText: 'Parisavtalet',
    body: 'Så mycket skulle utsläppen behöva minska för att vara i linje med 1,5-gradersmålet.',
    shareText: (_name) =>
      `Se historiska utsläpp tills idag, vilken minskning som krävs för att klara Parisavtalet och utsläppen framåt med nuvarande trend.`,
  },
  2: {
    text: 'Om vi fortsätter som idag',
    buttonText: 'Trend',
    body: 'Utsläppen de kommande åren baserat på nuvarande trend.',
    shareText: (_name) =>
      `Se historiska utsläpp tills idag, vilken minskning som krävs för att klara Parisavtalet och utsläppen framåt med nuvarande trend.`,
  },
}

type Props = {
  municipality: TMunicipality
  step: number
  onNextStep: (() => void) | undefined
  onPreviousStep: (() => void) | undefined
  coatOfArmsImage: string | null
  historicalEmissions: EmissionPerYear[]
  budgetedEmissions: EmissionPerYear[]
  trendingEmissions: EmissionPerYear[]
  municipalitiesName: Array<string>
}

const Municipality = (props: Props) => {
  const {
    step,
    municipality,
    onNextStep,
    onPreviousStep,
    coatOfArmsImage,
    historicalEmissions,
    budgetedEmissions,
    trendingEmissions,
    municipalitiesName,
  } = props
  const router = useRouter()
  const q = router.query['g[]']

  const [isOpen, setIsOpen] = useState(false)

  const emissionLastYear = municipality.HistoricalEmission.EmissionPerYear?.[municipality.HistoricalEmission.EmissionPerYear.length - 1]?.CO2Equivalent
  // FIXME replace with const emissionLastYear = municipality.HistoricalEmission.EmissionPerYear.at(-1)?.CO2Equivalent when Node has been updated >16.0.0

  let scrollY = 0
  if (typeof window !== 'undefined') {
    scrollY = window && window.scrollY
  }

  const toggleModal = () => {
    const body = document.body
    if (!isOpen) {
      body.style.overflow = 'hidden'
      setIsOpen(true)
    } else {
      body.style.overflow = ''
      setIsOpen(false)
    }
  }

  const range = (start: number, end: number) =>
    Array.from({ length: end - start }, (_, i) => i + start)

  const adjustablePeriods = range(2020, 2051).map((i) => [i, i + 1])

  const defaultPeriods = useMemo(
    () => adjustablePeriods.map((f) => ({ start: f[0], end: f[1], change: 1 })),
    [adjustablePeriods],
  )

  // Load mandate change values from ?g[] parameter in URL
  const [mandateChanges,] = useState<typeof defaultPeriods>(() => {
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

  const totalTrend = municipality.EmissionTrend.FutureCO2Emission / 1000

  const stepConfig = STEPS[step]
  if (!stepConfig) {
    throw new Error('Render a sort of 500 page I guess')
  }

  const { text, shareText, body } = stepConfig
  // let shareUrl = window.location.toString()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  let shareUrl = `${baseUrl}${router.asPath}`
  if (step === 3) {
    const qry = mandateChanges.map((c) => `g[]=${c.change}`).join('&')
    shareUrl = `${shareUrl}?${qry}`
  }

  return (
    <>
      <MetaTags
        title={`Klimatkollen — Hur går det i ${municipality.Name}?`}
        description={shareText(municipality.Name)}
        url={shareUrl}
      />
      <PageWrapper backgroundColor="darkestGrey">
        <BackArrow route={'/'} />
        <EmissionsContainer>
          <HeaderSection>
            <H1>{municipality.Name}</H1>
            {coatOfArmsImage && (
              <CoatOfArmsImage
                src={coatOfArmsImage}
                alt={`Kommunvapen för ${municipality.Name}`}
              />
            )}
          </HeaderSection>
          <GraphWrapper>
            <H2>
              {text}
            </H2>
            <Paragraph>
              {body}
            </Paragraph>
            <Legends>
              {step < 3 && (
                <Legend>
                  <Circle color="rgb(239, 94, 48)" />
                  Historiskt
                </Legend>
              )}
              {step > 0 && (
                <Legend>
                  <Circle color="#6BA292" />
                  Parisavtalet
                </Legend>
              )}
              {step > 1 && (
                <Legend>
                  <Circle color="#EF3054" />
                  Trend
                </Legend>
              )}
              <InfoButtonWrapper>
                <InfoButton type="button" aria-label="Om grafen" onClick={toggleModal}>
                  <Info />
                </InfoButton>
              </InfoButtonWrapper>
            </Legends>
            <Graph
              step={step}
              historical={historicalEmissions}
              trend={trendingEmissions}
              budget={budgetedEmissions}
              maxVisibleYear={END_YEAR}
            />
          </GraphWrapper>
          <Grid>
            {onPreviousStep ? (
              <IconButton onClick={onPreviousStep}>
                <ArrowLeft />
                {STEPS[step - 1].buttonText}
              </IconButton>
            ) : (
              <div></div>
            )}
            <span style={{ textAlign: 'center' }}>
              {step + 1} / {Object.keys(STEPS).length}
            </span>
            {onNextStep && (
              <IconButton onClick={onNextStep} style={{ justifyContent: 'flex-end' }}>
                {STEPS[step + 1]?.buttonText}
                <ArrowRight />
              </IconButton>
            )}
          </Grid>
          {step > 1 && (
            <>
              <H3>Totala framtida utsläpp</H3>
              <TotalCo2 color="#EF3054">
                Trend: {totalTrend.toFixed(1)} tusen ton CO₂
              </TotalCo2>
              <TotalCo2 color="#6BA292">
                Parisavtalet: {Math.round(municipality.Budget.CO2Equivalent / 1000)} tusen ton
                CO₂
              </TotalCo2>
            </>
          )}
        </EmissionsContainer>
        <StyledH2>
          Omställning
        </StyledH2>
        <Paragraph>
          Här visas nyckeltal för hur det går med klimatomställningen i kommunerna. Först ut är trafikutsläppen och övergången från
          fossilbilar till laddbara bilar. Fler nyckeltal tillkommer.
        </Paragraph>
        <FlexContainer>
          <EVCar />
          <StyledH5>
            Elbilarna
          </StyledH5>
        </FlexContainer>
        <FactSection
          heading='Ökning elbilar'
          data={(municipality.ElectricCarChangePercent * 100).toFixed(1) + '%'}
          info={
            <>
              Ökningstakten för andelen nyregistrerade laddbara bilar sedan Parisavtalet 2015 i procentenheter per år.
            </>}
        />
      </PageWrapper>
      <PageWrapper backgroundColor={'darkGrey'}>
        <StyledH2>
          <H2>Fakta om {municipality.Name}</H2>
        </StyledH2>
        <Bottom>
          <ScoreCard
            rank={municipality.HistoricalEmission.AverageEmissionChangeRank}
            budget={municipality.Budget.CO2Equivalent}
            budgetRunsOut={municipality.BudgetRunsOut}
            emissionChangePercent={municipality.EmissionChangePercent}
            emissionLastYear={emissionLastYear}
            population={municipality.Population}
            politicalRule={municipality.PoliticalRule}
            climatePlanLink={municipality.ClimatePlan.Link}
            climatePlanYear={municipality.ClimatePlan.YearAdapted}
          />
        </Bottom>
        <DropDownSection>
          <ParagraphBold>Hur ser det ut i andra kommuner?</ParagraphBold>
          <DropDown
            className="municipality-page"
            municipalitiesName={municipalitiesName}
            placeholder="Välj kommun"
          />
        </DropDownSection>
        {step === 0 && isOpen && (
          <InfoModal
            close={toggleModal}
            text={`Koldioxidutsläpp i kommunen mellan 1990 och 2020, vilket är senast tillgängliga data. 
            Basår för beräkningar av Sveriges klimatutsläpp är 1990.`}
            scrollY={scrollY}
          />
        )}
        {step === 1 && isOpen && (
          <InfoModal
            close={toggleModal}
            text="Den utsläppsminskning som krävs för att vara i linje med Parisavtalet och en koldioxidbudget som 
            motsvarar 50% sannolikhet att hålla den globala uppvärmningen under 1,5 grader. Funktionen visas som exponentiellt avtagande, 
            det vill säga utsläppen minskar med ett fast antal procent varje år. Startår är 2020, vilket är senast tillgängliga data."
            scrollY={scrollY}
          />
        )}
        {step === 2 && isOpen && (
          <InfoModal
            close={toggleModal}
            text="Trendlinjen är baserad på den genomsnittliga årliga utsläppsförändringen i kommunen sedan Parisavtalet 2015. 
            Hacket i kurvan för vissa kommuner beror på att genomsnittet är högre än det senaste årets nivå."
            scrollY={scrollY}
          />
        )}
      </PageWrapper>
    </>
  )
}

export default Municipality
