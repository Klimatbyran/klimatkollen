/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import styled from 'styled-components'
import Graph from './Graph'
import { H1, H2, H3, ParagraphBold } from './Typography'
import ArrowRight from '../public/icons/arrow-right-green.svg'
import ArrowLeft from '../public/icons/arrow-left-green.svg'
import Button from './Button'
import ScoreCard from './ScoreCard'
import Back from './Back'
import { hasShareAPI } from '../utils/navigator'
import { EmissionPerYear, Municipality as TMunicipality } from '../utils/types'
import MetaTags from './MetaTags'

import { useMemo, useState } from 'react'
import PageWrapper from './PageWrapper'
import { useRouter } from 'next/router'
import DropDown from './DropDown'
import { devices } from '../utils/devices'

const GraphWrapper = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: column;
`

const Btn = styled.button`
  border: none;
  background-color: none;
  cursor: pointer;
  background-color: inherit;
  color: #fff;
  font-family: 'Roboto';
  font-weight: 300;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 1rem;
`

const Flex = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;

  > * {
    user-select: none;
  }
`

const Center = styled.div`
  width: 100%
  background-color: coral;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Box = styled.div`
  width: 195px;
  height: 34px;
  background-color: #fff;
  border-radius: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const InfoText = styled.p`
  color: black;
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
  display: grid;
  gap: 1rem;
  margin-top: 0.5rem;

  @media only screen and (${devices.tablet}) {
    gap: 0;
    grid-template-columns: 45% auto 40%;
  }
`

const AdjustmentsContainer = styled.div`
  grid-column: 1 / 2;
  margin-bottom: 1rem;

  @media only screen and (${devices.tablet}) {
    margin-bottom: 0;
  }
`

const TotalsContainer = styled.div`
  grid-column: 1 / 2;

  @media all and (${devices.tablet}) {
    grid-column: 3 / 4;
  }
`

const RangeContainer = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 1rem 0;
  flex-shrink: 0;
  flex-grow: 1;
  justify-content: space-between;

  @media only screen and (${devices.tablet}) {
    flex-grow: 0;
    justify-content: start;
  }
`

const Range = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40px;
`

const Slider = styled.input`
  width: 114px;
  height: 40px;
  margin-top: calc((114px - 20px) / 2);
  margin-bottom: calc((114px - 20px) / 2);
  appearance: none;
  background: transparent;
  transform: rotate(-90deg);

  &:focus {
    outline: none;
  }

  &::-webkit-slider-runnable-track {
    background: ${(props) => props.theme.grey};
    box-shadow: none;
    height: 6px;
    border-radius: 5px;
  }

  &::-moz-range-track {
    background: ${(props) => props.theme.grey};
    box-shadow: none;
    height: 6px;
    border-radius: 5px;
  }

  &::-webkit-slider-thumb {
    appearance: none;
    border-radius: 100%;
    background: rgb(239, 191, 23);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    margin-top: -8px;
    height: 24px;
    width: 24px;
  }

  &::-moz-range-thumb {
    appearance: none;
    border: none;
    border-radius: 100%;
    background: #f9fbff;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    margin-top: -8px;
    height: 24p;
    width: 24px;
  }
`

const Percentage = styled.label`
  font-size: 0.75rem;
  margin-top: 6px;
`

const StartYear = styled.div`
  font-size: 0.75rem;
  font-weight: 300;
  margin-bottom: 8px;
`
const EndYear = styled.div`
  font-weight: 300;
`

const TotalCo2 = styled.div`
  font-weight: 500;
  margin: 1rem 0 0 -5px;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  background-color: ${(props) => props.color};
  color: #2d2d2d;
`

const Help = styled.p`
  // margin-top: 2rem;
  line-height: 1.5rem;
  @media only screen and (${devices.tablet}) {
    max-width: 350px;
  }
`

const FactH2 = styled(H3)`
  // margin-bottom: 60px;
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

const BottomRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media only screen and (${devices.tablet}) {
    width: 50%;
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

const Line = styled.span`
  width: 14px;
  height: 4px;
  margin-bottom: 3px;
  margin-top: 3px;
  background-color: ${(props) => props.color};
  display: inline-block;
`

function makePeriods(startYear: number, endYear: number, increment: number) {
  const mandates = []
  for (let i = startYear; i <= endYear; i += increment) {
    mandates.push([i, i + increment])
  }
  return mandates
}

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
  // 3: {
  //   text: 'Utforska glappet',
  //   body: (_name) =>
  //     'Idag sjunker inte utsläppen tillräckligt fort för att vara i linje med Parisavtalet. Men hur mycket måste de sjunka de närmsta åren för att klara 1,5-gradersmålet?',
  //   shareText: (_name) =>
  //    `Se historiska utsläpp tills idag, vilken minskning som krävs för att klara Parisavtalet och utsläppen framåt med nuvarande trend.`,
  // },
  3: {
    text: 'Skapa din egen klimatplan',
    buttonText: 'Din plan',
    body: (_name) =>
      'När behöver vi göra våra utsläppminskningar, använd reglagen för att få till en utsläppsminskningsplan som uppfyller Parisavtalet mål på 1.5 grader.',
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
  placeholder: string
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
    placeholder,
  } = props
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

  const [userEmissions, userTotal] = useMemo(() => {
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

  const totalBudget = budgetedEmissions
    .filter((c) => c.Year >= 2020 && c.Year <= 2050)
    .reduce((acc, cur) => acc + cur.CO2Equivalent, 0)
  const totalTrend = trendingEmissions
    .filter((c) => c.Year >= 2020 && c.Year <= 2050)
    .reduce((acc, cur) => acc + cur.CO2Equivalent, 0)

  const stepConfig = STEPS[step]
  if (!stepConfig) {
    throw new Error('Render a sort of 500 page I guess')
  }

  const { text, shareText, body } = stepConfig
  // let shareUrl = window.location.toString()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  let shareUrl = `${baseUrl}${router.asPath}`
  if (step === 4) {
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

  const handleYearChange = (year: number, value: number) => {
    setMandateChanges((m) => {
      const copy = [...m]
      const index = copy.findIndex((c) => c.start === year)
      copy[index].change = value
      return copy
    })
  }

  function renderEmissionChangeRank(name: string, changeRank: number | null): string {
    switch (changeRank) {
      case null:
        return ''
      case 1:
        return (
          name +
          ' har placering ' +
          changeRank +
          ' av 290 kommuner när det gäller utsläppsminskingar sedan Parisavtalet 2015, det är bäst i Sverige!'
        )
      case 290:
        return (
          name +
          ' har placering ' +
          changeRank +
          ' av 290 kommuner när det gäller utsläppsminskningar sedan Parisavtalet 2015, det är sämst i Sverige :('
        )
      default:
        return (
          name +
          ' har placering ' +
          changeRank +
          ' av 290 kommuner när det gäller utsläppsminskningar sedan Parisavtalet 2015.'
        )
    }
  }

  return (
    <>
      <MetaTags
        title={`Klimatkollen — Hur går det med klimatutsläppen i ${municipality.Name}?`}
        description={shareText(municipality.Name)}
        url={shareUrl}
      />
      <PageWrapper backgroundColor="black">
        <Back />
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
              {step > 2 && (
                <Legend>
                  <Line color="rgb(239, 191, 23)" />
                  Din plan
                </Legend>
              )}
            </Legends>
            <Graph
              step={step}
              historical={historicalEmissions}
              trend={trendingEmissions}
              budget={budgetedEmissions}
              municipality={municipality.Name}
              user={userEmissions}
              maxVisibleYear={END_YEAR}
            />
          </GraphWrapper>
          <Flex>
            {onPreviousStep ? (
              <Btn onClick={onPreviousStep}>
                <ArrowLeft />
                {STEPS[step - 1].buttonText}
              </Btn>
            ) : (
              <div></div>
            )}
            <span style={{ textAlign: 'center' }}>
              {step + 1} / {Object.keys(STEPS).length}
            </span>
            {onNextStep && (
              <Btn onClick={onNextStep} style={{ justifyContent: 'flex-end' }}>
                {STEPS[step + 1]?.buttonText || 'Nästa'}
                <ArrowRight />
              </Btn>
            )}
          </Flex>
          {step > 1 && (
            <BottomContainer>
              {step > 2 && (
                <AdjustmentsContainer>
                  <H3>Din plan</H3>
                  <RangeContainer>
                    {mandateChanges
                      .filter((c) => c.start >= 2022 && c.end <= 2030)
                      .map((value, i) => (
                        <Range key={i}>
                          <Percentage
                          // style={{
                          //   color: value.change > 1 ? 'pink' : 'lightgreen',
                          // }}
                          >
                            {value.change > 1 ? '+' : ''}{' '}
                            {Math.round(100 * value.change) - 100}%
                          </Percentage>
                          <Slider
                            min={0.5}
                            max={1.5}
                            step={0.01}
                            value={value.change}
                            type="range"
                            onChange={(e) =>
                              handleYearChange(value.start, parseFloat(e.target.value))
                            }
                          />
                          <StartYear>{value.start}</StartYear>
                        </Range>
                      ))}
                  </RangeContainer>
                  <Help>
                    Med hjälp av reglagen kan du själv skapa en plan över hur stor årlig
                    utsläppsminskning man behöver genomföra i {municipality.Name}:
                  </Help>
                </AdjustmentsContainer>
              )}
              <TotalsContainer>
                <H3>Framtida utsläpp</H3>
                <TotalCo2 color="#EF3054">
                  Trend: {Math.round(totalTrend / 1000)} kt CO₂
                </TotalCo2>
                <TotalCo2 color="#6BA292">
                  Parisavtalet: {Math.round(municipality.Budget.CO2Equivalent / 1000)} kt
                  CO₂
                </TotalCo2>
                {step > 2 && (
                  <TotalCo2 color="rgb(239, 191, 23)">
                    Din plan: {Math.round(userTotal / 1000)} kt CO₂
                    {userTotal < municipality.Budget.CO2Equivalent && ' ✅'}
                  </TotalCo2>
                )}
              </TotalsContainer>
            </BottomContainer>
          )}
        </Top>
        <BottomShare>
          {hasShareAPI() && (
            <Button
              handleClick={handleClick}
              text="Dela i dina sociala medier"
              shareIcon
            />
          )}
        </BottomShare>
      </PageWrapper>
      <PageWrapper backgroundColor="dark">
        <BottomHeader>
          <H2>Fakta om {municipality.Name}</H2>
        </BottomHeader>
        <Bottom>
          {/* <BottomRight>
            <p>
              {renderEmissionChangeRank(
                municipality.Name,
                municipality.HistoricalEmission.AverageEmissionChangeRank,
              )}
            </p>
          </BottomRight> */}
          <BottomLeft>
            <ScoreCard
              population={municipality.Population}
              budget={municipality.Budget.CO2Equivalent}
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
      </PageWrapper>
    </>
  )
}

export default Municipality
