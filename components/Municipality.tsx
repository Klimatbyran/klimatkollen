/* eslint-disable @typescript-eslint/ban-ts-comment */
import styled from 'styled-components'
import Graph from './Graph'
import { H1, H3 } from './Typography'
import ArrowRight from '../public/icons/arrow-right-green.svg'
import ArrowLeft from '../public/icons/arrow-left-green.svg'
import Button from './Button'
import ScoreCard from './ScoreCard'
import Back from './Back'
import { hasShareAPI } from '../utils/navigator'
import { EmissionPerYear, Municipality as TMunicipality } from '../utils/types'
import MetaTags from './MetaTags'

import { useState } from 'react'
import PageWrapper from './PageWrapper'
import { useRouter } from 'next/router'

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
  font-family: 'Helvetica Neue';
  font-weight: 300;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 1rem;
`

const Flex = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
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

const RangeContainer = styled.div`
  margin-top: 4rem;
  display: flex;
  justify-content: space-between;
  overflow-x: auto;
  padding-bottom: 1rem;
`

const Range = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Slider = styled.input`
  appearance: slider-vertical;
  writing-mode: bt-lr; // ie and edge
  width: 3rem;
  margin-top: 0.25rem;
`

const Percentage = styled.label`
  font-size: 0.75rem;
  margin-top: 6px;
`

const MandatePeriod = styled.div`
  font-size: 0.75rem;
`

const StartYear = styled.div`
  border-bottom: 1px solid white;
  font-weight: 300;
`
const EndYear = styled.div`
  font-weight: 300;
`

const Help = styled.p`
  margin-top: 2rem;
  line-height: 1.5rem;
`

const FactH2 = styled(H3)`
  // margin-bottom: 60px;
`

const Bottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`

const MANDATE_PERIODS = [
  [2022, 2026],
  [2026, 2030],
  [2030, 2034],
  [2034, 2038],
  [2038, 2042],
  [2042, 2046],
  [2046, 2050],
]

const MANDATE_MAX_CHANGE = 2
const MANDATE_MIN_CHANGE = 1

const DEFAULT_MANDATE_VALUES = MANDATE_PERIODS.map((f) => ({
  start: f[0],
  end: f[1],
  change: 1.0,
}))

type ShareTextFn = (name: string) => string
const STEPS: { [index: number]: { text: string; shareText: ShareTextFn } } = {
  0: {
    text: 'Historiska utsläpp',
    shareText: (_name) =>
      `Klimatutsläppen hittills. Om vi fortsätter som nu. Om vi ska klara Parisavtalet.`,
  },
  1: {
    text: 'För att nå Parisavtalet',
    shareText: (_name) =>
      `Klimatutsläppen hittills. Om vi fortsätter som nu. Om vi ska klara Parisavtalet.`,
  },
  2: {
    text: 'Framtida prognos',
    shareText: (_name) =>
      `Klimatutsläppen hittills. Om vi fortsätter som nu. Om vi ska klara Parisavtalet.`,
  },
  3: {
    text: 'Glappet',
    shareText: (_name) =>
      `Klimatutsläppen hittills. Om vi fortsätter som nu. Om vi ska klara Parisavtalet.`,
  },
  4: {
    text: 'Din plan',
    shareText: (_name) =>
      `Klimatutsläppen hittills. Om vi fortsätter som nu. Om vi ska klara Parisavtalet.`,
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
  } = props
  const router = useRouter()
  const q = router.query['g[]']

  const [mandateChanges, setMandateChanges] = useState<typeof DEFAULT_MANDATE_VALUES>(
    () => {
      if (typeof q === 'undefined') return DEFAULT_MANDATE_VALUES

      const g = (Array.isArray(q) ? q : [q])
        .map((v) => parseFloat(v))
        .map((f) => Math.max(MANDATE_MIN_CHANGE, Math.min(MANDATE_MAX_CHANGE, f)))

      if (g.length !== MANDATE_PERIODS.length) {
        console.debug('Incorrect number of g parameters')
        return DEFAULT_MANDATE_VALUES
      }

      if (g.some((v) => Number.isNaN(v))) {
        console.debug('Non-number values in g parameter')
        return DEFAULT_MANDATE_VALUES
      }

      return DEFAULT_MANDATE_VALUES.map((v, idx) => ({
        ...v,
        change: g[idx],
      }))
    },
  )

  const stepConfig = STEPS[step]
  if (!stepConfig) {
    throw new Error('Render a sort of 500 page I guess')
  }

  const { text, shareText } = stepConfig
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

  const handleYearChange = (index: number, value: number) => {
    setMandateChanges((m) => {
      const copy = [...m]
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
          ' av 290 kommuner när det gäller utsläppsminsking, det är bäst i Sverige!'
        )
      case 290:
        return (
          name +
          ' har placering ' +
          changeRank +
          ' av 290 kommuner när det gäller utsläppsminskning, det är sämst i Sverige :('
        )
      default:
        return (
          name +
          ' har placering ' +
          changeRank +
          ' av 290 kommuner när det gäller utsläppsminskning, det är bättre än ' +
          (290 - changeRank) +
          ' och sämre än ' +
          (changeRank - 1) +
          ' andra kommuner i Sverige.'
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

            {coatOfArmsImage && <CoatOfArmsImage src={coatOfArmsImage} alt="img" />}
          </HeaderSection>
          <GraphWrapper>
            <Center>
              <Box>
                <InfoText>{text}</InfoText>
              </Box>
            </Center>
            <Graph
              step={step}
              historical={historicalEmissions}
              trend={trendingEmissions}
              budget={budgetedEmissions}
              mandatePeriodChanges={mandateChanges}
            />
          </GraphWrapper>
          <Flex>
            {onPreviousStep ? (
              <Btn onClick={onPreviousStep}>
                <ArrowLeft />
                Förgående
              </Btn>
            ) : (
              <div></div>
            )}
            {onNextStep && (
              <Btn onClick={onNextStep}>
                Nästa <ArrowRight />
              </Btn>
            )}
          </Flex>
          {step > 3 && (
            <>
              <RangeContainer>
                {mandateChanges.map((value, i) => (
                  <Range
                    key={i}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}>
                    <MandatePeriod>
                      <StartYear>{value.start}</StartYear>
                      <EndYear>{value.end}</EndYear>
                    </MandatePeriod>
                    <Slider
                      min={1}
                      max={2}
                      step={0.01}
                      value={value.change}
                      type="range"
                      // @ts-ignore - this is for firefox :*(
                      orient="vertical"
                      onChange={(e) => handleYearChange(i, parseFloat(e.target.value))}
                    />
                    <Percentage>{100 - Math.round(100 / value.change)}%</Percentage>
                  </Range>
                ))}
              </RangeContainer>
              <Help>
                Med hjälp av reglagen så styr du hur stora utsläppsminskningar man behöver
                göra per mandatperiod för att nå Parisavtalet.
              </Help>
            </>
          )}
        </Top>
      </PageWrapper>
      <PageWrapper backgroundColor="dark">
        <Bottom>
          <FactH2>Fakta om klimatomställningen i {municipality.Name}</FactH2>
          <ScoreCard
            population={municipality.Population}
            budget={municipality.Budget.CO2Equivalent}
            municipality={municipality.Name}
            politicalRule={municipality.PoliticalRule}
          />
          <p>
            {renderEmissionChangeRank(
              municipality.Name,
              municipality.HistoricalEmission.AverageEmissionChangeRank,
            )}
          </p>
          {hasShareAPI() && (
            <Button
              handleClick={handleClick}
              text="Dela i dina sociala medier"
              shareIcon
            />
          )}
        </Bottom>
      </PageWrapper>
    </>
  )
}

export default Municipality
