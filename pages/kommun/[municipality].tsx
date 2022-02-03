import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import Graph from '../../components/Graph'
import { H1 } from '../../components/Typography'
import { klimatData, data } from '../../data/stockholm'
import ArrowRight from '../../public/icons/arrow-right.svg'
import ArrowLeft from '../../public/icons/arrow-left-green.svg'
import { devices } from '../../utils/devices'
import Button from '../../components/Button'
import InfoBox from '../../components/InfoBox'
import Back from '../../components/Back'

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
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

type Co2Year = { year: number; co2: number }

const max = (array: Array<Co2Year>, key: 'year' | 'co2') => {
  return Math.max(...array.map((d) => d[key]))
}

const Municipality = () => {
  const router = useRouter()
  const { municipality } = router.query

  const handleClick = () => {
    // Function to handle click on share button
  }
  const stepFromRouter = router.query.step

  const maxCo2 = max(data, 'co2')

  const [currentStep, setCurrentStep] = useState<number>(0)
  const [text, setText] = useState('Historiska utsläpp')
  const [width, setWidth] = useState(500)

  useEffect(() => {
    switch (stepFromRouter) {
      case '0':
        setCurrentStep(0)
        break
      case '1':
        setCurrentStep(1)
        break
      case '2':
        setCurrentStep(2)
        break
      case '3':
        setCurrentStep(3)
        break
      default:
        break
    }
  }, [stepFromRouter])

  useEffect(() => {
    switch (currentStep) {
      case 0:
        setText('Historiska utsläpp')
        break
      case 1:
        setText('För att nå Parisavtalet')
        break
      case 2:
        setText('Framtida prognos')
        setWidth(500)
        break
      case 3:
        setText('Glappet')
        setWidth(800)
        break
      default:
        break
    }
  }, [currentStep])

  return (
    <>
      <Back />
      <Wrapper>
        <H1>{municipality}</H1>
        <InfoBox />

        <GraphWrapper>
          <Title>Koldioxidutsläpp</Title>
          <Center>
            <Box>{text}</Box>
          </Center>
          <Graph
            width={500}
            height={250}
            currentStep={currentStep}
            klimatData={klimatData}
            maxCo2={maxCo2}
          />
          <Flex>
            {currentStep != 0 ? (
              <Btn onClick={() => setCurrentStep((current) => current - 1)}>
                <ArrowLeft />
                Förgående
              </Btn>
            ) : (
              <div></div>
            )}
            {currentStep < 3 && (
              <Btn onClick={() => setCurrentStep((current) => current + 1)}>
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
