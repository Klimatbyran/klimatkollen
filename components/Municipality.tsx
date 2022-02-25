/* eslint-disable @typescript-eslint/ban-ts-comment */
import styled from 'styled-components'
import Graph from './Graph'
import { H1 } from './Typography'
import ArrowRight from '../public/icons/arrow-right.svg'
import ArrowLeft from '../public/icons/arrow-left-green.svg'
import { devices } from '../utils/devices'
import Button from './Button'
import ScoreCard from './ScoreCard'
import Back from './Back'
import { hasShareAPI } from '../utils/navigator'
import { Municipality as TMunicipality } from '../utils/types'
import MetaTags from './MetaTags'

import {
  data as historicalEmissions,
  pledges as pledgedEmissions,
  paris as parisEmissions,
} from '../data/stockholm'
import { useState } from 'react'

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
  padding: 0 1.25rem;
`

const Title = styled.h3`
  font-family: 'Helvetica Neue';
  font-size: 20px;
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 1rem;
`

const CoatOfArmsImage = styled.img`
  width: 60px;
`

const HeaderSection = styled.div`
  display: flex;
  height: 150px;
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

const P = styled.p`
  margin-top: 1.5rem;
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

type ShareTextFn = (name: string) => string
const STEPS: { [index: number]: { text: string; shareText: ShareTextFn } } = {
  0: {
    text: 'Historiska utsläpp',
    shareText: (name) => `Kolla de historiska utsläppen för ${name}`,
  },
  1: {
    text: 'För att nå Parisavtalet',
    shareText: (name) =>
      `Hur behöver utsläppen ändras i ${name} för att nå Parisavtalet?`,
  },
  2: {
    text: 'Framtida prognos',
    shareText: (name) => `Se den framtida prognosen för ${name}`,
  },
  3: {
    text: 'Glappet',
    shareText: (name) => `Hur stort är glappet i ${name} från nu och framtiden?`,
  },
  4: {
    text: 'Din plan',
    shareText: (name) => `Här är min plan för att ${name} ska hålla sin klimatbudget.`,
  },
}

type Props = {
  municipality: TMunicipality
  step: number
  onNextStep: (() => void) | undefined
  onPreviousStep: (() => void) | undefined
  coatOfArmsImage: string | null
}

const Municipality = (props: Props) => {
  const { step, municipality, onNextStep, onPreviousStep, coatOfArmsImage } = props

  const [mandateChanges, setMandateChanges] = useState(
    MANDATE_PERIODS.map((f) => ({
      start: f[0],
      end: f[1],
      change: 1.0,
    })),
  )

  const stepConfig = STEPS[step]
  if (!stepConfig) {
    throw new Error('Render a sort of 500 page I guess')
  }

  const { text, shareText } = stepConfig

  const handleClick = async () => {
    async function share(name: string) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: `Klimatkollen ${name}`,
            text: shareText(name),
            url: window.location.toString(),
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

  return (
    <>
      <Back />
      <MetaTags
        title={`Klimatkollen - ${municipality.Name}`}
        description={shareText(municipality.Name)}
      />
      <Wrapper>
        <HeaderSection>
          <H1>{municipality.Name}</H1>

          {coatOfArmsImage && <CoatOfArmsImage src={coatOfArmsImage} alt="img" />}
        </HeaderSection>
        <GraphWrapper>
          <Title>Koldioxidutsläpp</Title>
          <Center>
            <Box>
              <InfoText>{text}</InfoText>
            </Box>
          </Center>
          <Graph
            step={step}
            historical={historicalEmissions}
            pledged={pledgedEmissions}
            paris={parisEmissions}
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
            <P>Dela din graf på sociala medier.</P>
          </>
        )}
        <ScoreCard
          population={municipality.Population}
          budget={municipality.Budget.CO2Equivalent}
          municipality={municipality.Name}
          politicalRule={municipality.PoliticalRule}
        />
        {hasShareAPI() && (
          <Button handleClick={handleClick} text="Dela i dina sociala medier" shareIcon />
        )}
      </Wrapper>
    </>
  )
}

export default Municipality
