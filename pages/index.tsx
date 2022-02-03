import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import DropDown from '../components/DropDown'
import Graph from '../components/Graph'
import { H1, Paragraph } from '../components/Typography'
import { Municipality } from '../utils/types'
import { klimatData } from '../data/stockholm'
import ArrowRight from '../public/icons/arrow-right.svg'
import ArrowLeft from '../public/icons/arrow-left-green.svg'

type PropsType = {
  municipalities: Array<Municipality>
}

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
  /* padding-right: 2rem; */
`

const Title = styled.h3`
  font-family: 'Helvetica Neue';
  /* font-weight: 300; */
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

const Home: React.FC<PropsType> = ({ municipalities }: PropsType) => {
  const router = useRouter()
  const stepFromRouter = router.query.step

  const municipalitiesName = municipalities.map((item) => item.Name)
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
      <Head>
        <title>Klimatkollen</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Title>Koldioxidutsläpp</Title>
      <Center>
        <Box>{text}</Box>
      </Center>
      <Graph width={500} height={250} currentStep={currentStep} klimatData={klimatData} />
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
      {/* <H1>Klimatkollen</H1>
      <Paragraph>
        Låt oss ta tempen på hur väl din kommun når upp till de mål som är uppsatta i
        parisavtalet.
      </Paragraph>
      <DropDown municipalitiesName={municipalitiesName} /> */}
    </>
  )
}

export async function getServerSideProps() {
  const municipalities = await fetch(
    'http://klimatkollen.vercel.app/api/municipalities',
  ).then((res) => res.json())
  return {
    props: { municipalities },
  }
}

export default Home
