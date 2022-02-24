import Head from 'next/head'
import styled from 'styled-components'
import Graph from './Graph'
import { H1 } from './Typography'
import { klimatData, data } from '../data/stockholm'
import ArrowRight from '../public/icons/arrow-right.svg'
import ArrowLeft from '../public/icons/arrow-left-green.svg'
import { devices } from '../utils/devices'
import Button from './Button'
import ScoreCard from './ScoreCard'
import Back from './Back'
import { hasShareAPI } from '../utils/navigator'
import { Municipality as TMunicipality } from '../utils/types'
import MetaTags from './MetaTags'

const GraphWrapper = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: column;
  @media only screen and (${devices.tablet}) {
    width: 600px;
  }
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

type Co2Year = { year: number; co2: number }

const max = (array: Array<Co2Year>, key: 'year' | 'co2') => {
  return Math.max(...array.map((d) => d[key]))
}

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
}

type Props = {
  municipality: TMunicipality
  step: number
  onNextStep: (() => void) | undefined
  onPreviousStep: (() => void) | undefined
}

const Municipality = (props: Props) => {
  const { step, municipality, onNextStep, onPreviousStep } = props
  const maxCo2 = max(data, 'co2')

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

  console.log(municipality)

  return (
    <>
      <Back />
      <MetaTags
        title={`Klimatkollen - ${municipality.Name}`}
        description={shareText(municipality.Name)}
      />
      <Wrapper>
        <H1>{municipality.Name}</H1>
        <ScoreCard population={municipality.Population} />

        <GraphWrapper>
          <Title>Koldioxidutsläpp</Title>
          <Center>
            <Box>
              <InfoText>{text}</InfoText>
            </Box>
          </Center>
          <Graph
            width={500}
            height={250}
            currentStep={step}
            klimatData={klimatData}
            maxCo2={maxCo2}
          />
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
        </GraphWrapper>
        {hasShareAPI() && (
          <Button handleClick={handleClick} text="Dela i dina sociala medier" shareIcon />
        )}
      </Wrapper>
    </>
  )
}

export default Municipality
