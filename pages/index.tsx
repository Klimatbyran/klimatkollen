import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import styled from 'styled-components'
import DropDown from '../components/DropDown'
import Map from '../components/Map'
import MetaTags from '../components/MetaTags'
import { H1, ParagraphBold, Paragraph } from '../components/Typography'
import { EmissionService } from '../utils/emissionService'
import { Municipality } from '../utils/types'

type PropsType = {
  municipalities: Array<Municipality>
}
const Box = styled.div`
  width: 195px;
  height: 100%;
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
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 34px;
`

const Dot = styled.div<{ color: string }>`
  background-color: ${(props) => props.color};
  width: 10px;
  height: 10px;
  border-radius: 50%;
`

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 1rem;
  height: 100px;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
`

const Label = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`
const FlexCenter = styled.div`
  width: 100%;
  display: flex;
`

const Home: React.FC<PropsType> = ({ municipalities }: PropsType) => {
  const [selected, setSelected] = useState('Utforska kartan')
  const municipalitiesName = municipalities.map((item) => item.Name)
  const emissionsLevels = municipalities.map((item) => ({
    name: item.Name,
    emissions: item.EmissionLevelChangeAverage,
  }))

  return (
    <>
      <MetaTags title="Klimatkollen" description="Enkel fakta om klimatomställningen" />
      <H1>Klimatkollen</H1>
      <Paragraph>Enkel fakta om klimatomställningen</Paragraph>
      <FlexCenter>
        <ParagraphBold>Utsläppsförändring sedan Parisavtalet 2015</ParagraphBold>
      </FlexCenter>
      <Wrapper>
        <Box>
          <InfoText>{selected}</InfoText>
        </Box>
      </Wrapper>
      <Map emissionsLevels={emissionsLevels} setSelected={setSelected} />
      <InfoBox>
        <Label>
          <Dot color="#EF3054" /> <Paragraph>Ökat mer än 0% </Paragraph>
        </Label>
        <Label>
          <Dot color="#EF5E30" /> <Paragraph> Minskat med 0-2%</Paragraph>
        </Label>
        <Label>
          <Dot color="#EF7F17" />
          <Paragraph>Minskat med 2-4%</Paragraph>
        </Label>
        <Label>
          <Dot color="#EF9917" /> <Paragraph>Minskat med 4-7%</Paragraph>
        </Label>
        <Label>
          <Dot color="#EFBF17" /> <Paragraph>Minskat med 7-10%</Paragraph>
        </Label>
        <Label>
          <Dot color="#91BFC8" /> <Paragraph>Minskat mer än 10% </Paragraph>
        </Label>
      </InfoBox>
      <FlexCenter>
        <DropDown municipalitiesName={municipalitiesName} />
      </FlexCenter>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const municipalities = await new EmissionService().getMunicipalities()
  if (municipalities.length < 1) throw new Error('No municipalities found')

  return {
    props: { municipalities },
  }
}

export default Home
