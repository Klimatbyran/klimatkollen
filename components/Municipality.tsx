import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import Graph from './Graph'
import { H1 } from './Typography'
import { klimatData, data } from '../data/stockholm'
import ArrowRight from '../public/icons/arrow-right.svg'
import ArrowLeft from '../public/icons/arrow-left-green.svg'
import { devices } from '../utils/devices'
import Button from './Button'
import InfoBox from './InfoBox'
import Back from './Back'

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

const STEPS: { [index: number]: { text: string } } = {
  0: {
    text: 'Historiska utsläpp',
  },
  1: {
    text: 'För att nå Parisavtalet',
  },
  2: {
    text: 'Framtida prognos',
  },
  3: {
    text: 'Glappet',
  },
}

type Props = {
  municipality: string
  step: number
  onNextStep: (() => void) | undefined
  onPreviousStep: (() => void) | undefined
}

const Municipality = (props: Props) => {
  const { step, municipality, onNextStep, onPreviousStep } = props

  // https://github.com/vercel/next.js/discussions/11484
  if (!municipality) return null

  const handleClick = () => {
    // Function to handle click on share button
  }

  const maxCo2 = max(data, 'co2')

  const stepConfig = STEPS[step]
  if (!stepConfig) {
    throw new Error('Render a sort of 500 page I guess')
  }

  const text = stepConfig ? stepConfig.text : 'Ajabaja'

  return (
    <>
      <Back />
      <Wrapper>
        <H1>{municipality}</H1>
        <InfoBox />

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
        <Button handleClick={handleClick} text="Dela" shareIcon />
      </Wrapper>
    </>
  )
}

export default Municipality
