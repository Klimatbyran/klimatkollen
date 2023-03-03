/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import styled from 'styled-components'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/router'

import ArrowRight from '../public/icons/arrow-right-white.svg'
import ArrowLeft from '../public/icons/arrow-left-white.svg'
import Info from '../public/icons/info.svg'
import { H1, H2, H3, ParagraphBold } from './Typography'
import Back from './Back'
import MetaTags from './MetaTags'
import InfoModal from './InfoModal'
import PageWrapper from './PageWrapper'
import DropDown from './DropDown'
import Graph from './Graph'
import ShareButton from './Button'
import ScoreCard from './ScoreCard'
import { IconButton } from './shared'
import { hasShareAPI } from '../utils/navigator'
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

const Flex = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;

  > * {
    user-select: none;
  }
`

const Top = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
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

const BottomContainer = styled.div`
  margin-top: 0.5rem;

  @media only screen and (${devices.tablet}) {
    gap: 0;
    grid-template-columns: 45% auto 40%;
  }

`

const TotalCo2 = styled.div`
  font-weight: 500;
  margin: 1rem 0 0 -5px;
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

const BottomHeader = styled.div`
  margin-bottom: 20px;
  width: 100%;
`

const BottomLeft = styled.div`
  @media only screen and (${devices.tablet}) {
    // width: 50%;
  }
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

const BottomShare = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 50px;
  margin-top: 3.5rem;

  @media only screen and (${devices.tablet}) {
    align-items: center;
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
    body: ShareTextFn
    shareText: ShareTextFn
  }
} = {
  0: {
    text: 'Historiska utsläpp',
    buttonText: 'Historiskt',
    body: (name) => `Koldioxidutsläppen i ${name} sedan 1990 är totalt X ton koldioxid`,
    shareText: (_name) =>
      `Se historiska utsläpp tills idag, vilken minskning som krävs för att klara Parisavtalet och utsläppen framåt med nuvarande trend.`,
  },
  1: {
    text: 'För att nå Parisavtalet',
    buttonText: 'Parisavtalet',
    body: (name) =>
      `För att vara i linje med Parisavtalet behöver ${name} minska sina utsläpp med X% per år.`,
    shareText: (_name) =>
      `Se historiska utsläpp tills idag, vilken minskning som krävs för att klara Parisavtalet och utsläppen framåt med nuvarande trend.`,
  },
  2: {
    text: 'Om vi fortsätter som idag',
    buttonText: 'Trend',
    body: (_name) =>
      'Om klimatutsläppen följer nuvarande trend kommer koldioxidbudgeten att ta slut 2024.',
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
  const [mandateChanges, setMandateChanges] = useState<typeof defaultPeriods>(() => {
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

  const [userEmissions] = useMemo(() => {
    const emissions: EmissionPerYear[] = []

    let acc = 1
    let total = 0
    mandateChanges.forEach((mandateChange) => {
      // Problem: This counts on budget to go at least all the way to 2050
      ;[...trendingEmissions, ...budgetedEmissions.slice(trendingEmissions.length)]
        .filter((e) => e.Year >= mandateChange.start && e.Year < mandateChange.end)
        .forEach((budgeted) => {
          acc = acc * mandateChange.change
          // Problem: This is a clone of the budget and we cannot go "above it"
          emissions.push({
            Year: budgeted.Year,
            CO2Equivalent: budgeted.CO2Equivalent * acc,
          })
          total += budgeted.CO2Equivalent * acc
        })
    })

    return [emissions, total]
  }, [mandateChanges, trendingEmissions, budgetedEmissions])

  const totalTrend = municipality.EmissionTrend.FutureCO2Emission

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

  const handleClick = async () => {
    async function share(name: string) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: `Klimatkollen ${name}`,
            text: shareText(name),
            url: shareUrl,
          })
        } catch {
          // Avoid unhandled promise rejection
          console.debug('Share cancelled')
        }
      } else {
        if (process.env.NODE_ENV !== 'production') {
          alert(
            'This is a fake share dialog. Visit using https:// on a mobile device to actually test it',
          )
        }
        // This should not be reached
        throw new Error('This should not be reached.')
      }
    }
    share(municipality.Name)
  }

  return (
    <>
      <MetaTags
        title={`Klimatkollen — Hur går det i ${municipality.Name}?`}
        description={shareText(municipality.Name)}
        url={shareUrl}
      />
      <PageWrapper backgroundColor='darkestGrey'>
        <Back route={'/kommuner'} />
        <Top>
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
            <H2>{text}</H2>
            <p>{body}</p>
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
              user={userEmissions}
              maxVisibleYear={END_YEAR}
            />
          </GraphWrapper>
          <Flex>
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
          </Flex>
          {step > 1 && (
            <BottomContainer>
              <H3>Framtida utsläpp</H3>
              <TotalCo2 color="#EF3054">
                Trend: {Math.round(totalTrend / 1000)} tusen ton CO₂
              </TotalCo2>
              <TotalCo2 color="#6BA292">
                Parisavtalet: {Math.round(municipality.Budget.CO2Equivalent / 1000)} tusen ton
                CO₂
              </TotalCo2>
            </BottomContainer>
          )}
        </Top>
        <BottomShare>
          {hasShareAPI() && (
            <ShareButton
              handleClick={handleClick}
              text="Dela i dina sociala medier"
              shareIcon
            />
          )}
        </BottomShare>
      </PageWrapper>
      <PageWrapper backgroundColor={'darkGrey'}>
        <BottomHeader>
          <H2>Fakta om {municipality.Name}</H2>
        </BottomHeader>
        <Bottom>
          <BottomLeft>
            <ScoreCard
              population={municipality.Population}
              budget={municipality.Budget.CO2Equivalent}
              budgetRunsOut={municipality.BudgetRunsOut}
              municipality={municipality.Name}
              politicalRule={municipality.PoliticalRule}
              rank={municipality.HistoricalEmission.AverageEmissionChangeRank}
            />
          </BottomLeft>
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
            text={`Koldioxidutsläpp i kommunen sedan ${historicalEmissions[0].Year}.`}
            scrollY={scrollY}
          />
        )}
        {step === 1 && isOpen && (
          <InfoModal
            close={toggleModal}
            text="Den minskning av koldioxidutsläpp som krävs för att vara i linje med Parisavtalet och den utsläppsbudget som motsvarar 1,5 graders uppvärmning, visad som exponentiellt avtagande, det vill säga där utsläppen minskar med en viss procent varje år."
            scrollY={scrollY}
          />
        )}
        {step === 2 && isOpen && (
          <InfoModal
            close={toggleModal}
            text="Trendlinjen är baserad på årliga utsläpp i kommunen sedan Parisavtalet 2015."
            scrollY={scrollY}
          />
        )}
      </PageWrapper>
    </>
  )
}

export default Municipality
