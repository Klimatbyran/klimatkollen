import { GetServerSideProps } from 'next'
import { ReactElement, useState } from 'react'
import styled from 'styled-components'

import DropDown from '../components/DropDown'
import Map from '../components/Map'
import MetaTags from '../components/MetaTags'
import { ParagraphBold } from '../components/Typography'
import { ClimateDataService } from '../utils/climateDataService'
import { Municipality } from '../utils/types'
import PageWrapper from '../components/PageWrapper'
import { devices } from '../utils/devices'
import Layout from '../components/Layout'
import Footer from '../components/Footer'
import MapLabel from '../components/MapLabel'

type PropsType = {
  municipalities: Array<Municipality>
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`

const RadioContainer = styled.div`
  display: flex;
  column-gap: 200px;
  justify-content: center;
  border-bottom: 1px solid white;
`

const RadioLabel = styled.label`
  display: inline-block;
  vertical-align: top;
  font-weight: bolder;
  cursor: pointer;
  margin-bottom: 8px;
  &:hover {
    color: ${({ theme }) => theme.greenGraphTwo};
`

const RadioInput = styled.input`
  display: none;
`

const MapContainer = styled.div`
  position: relative;
  // TODO: Hardcoding this is not good.
  height: 380px;
  border: 1px solid #f9fbff;
  border-radius: 8px;
  display: flex;

  @media only screen and (${devices.tablet}) {
    height: 500px;
  }
`

const MapLabels = styled.div`
  padding-left: 0.87rem;
  padding-top: 1.2rem;

  @media only screen and (${devices.tablet}) {
    position: absolute;
    left: 0;
    top: 0;
  }
`

const InfoBox = styled.div`
  padding-bottom: 0.5rem;
`

const FlexCenter = styled.div`
  width: 100%;
  /* display: flex; */
`

type SelectedData = 'Utsläppen' | 'Elbilarna'

const Kommuner = ({ municipalities }: PropsType) => {
  const [selectedData, setSelectedData] = useState<SelectedData>('Elbilarna')
  const municipalitiesName = municipalities.map((item) => item.Name)
  const data = municipalities.map((item) => ({
    name: item.Name,
    emissions: selectedData == 'Utsläppen' ? item.HistoricalEmission.EmissionLevelChangeAverage : item.ElectricCars,
  }))
  const boundaries = {
    'Utsläppen': [0, -0.01, -0.02, -0.03, -0.1],
    'Elbilarna': [30, 40, 50, 60, 70]
  }

  const dataLabels = {
    'Utsläppen': ['0% +', '0–1%', '1–2%', '2–3%', '3–10%', '10–15%'],
    'Elbilarna': ['30% -', '30-40%', '40-50%', '50-60%', '60-70%', '70% +']
  }
  const labelColors = ['#EF3054', '#EF5E30', '#EF7F17', '#EF9917', '#EFBF17', '#91BFC8']

  const handleSelectData = (selection: SelectedData) => {
    if (selectedData == 'Elbilarna') {
      setSelectedData('Utsläppen')
    } else {
      setSelectedData('Elbilarna')
    }
  }

  return (
    <>
      <MetaTags
        title="Klimatkollen — Få koll på Sveriges klimatomställning"
        description="Hur går det med utsläppsminskningarna i Sverige och i din kommun? Minskar eller ökar klimatutsläppen? Klarar vi Parisavtalet?"
      />
      <PageWrapper backgroundColor="black">
        <Container>
          <ParagraphBold>
            Hur går det med...?
          </ParagraphBold>
          <RadioContainer>
            <RadioLabel>
              <RadioInput
                type="radio"
                value='Utsläppen'
                checked={selectedData === 'Utsläppen'}
                onChange={() => handleSelectData('Utsläppen')}
              />
              Utsläppen
            </RadioLabel>
            {/* fixne styla så att man ser vilken som är aktiv */}
            <RadioLabel>
              <RadioInput
                type="radio"
                value='Elbilarna'
                checked={selectedData === 'Elbilarna'}
                onChange={() => handleSelectData('Elbilarna')}
              />
              Elbilarna
            </RadioLabel>
          </RadioContainer>
          <FlexCenter>
            <div>
              <ParagraphBold>Utsläppsförändring sedan Parisavtalet</ParagraphBold>
              <p>
                På kartan visas genomsnittlig årlig förändring av utsläppen i Sveriges
                kommuner sedan Parisavtalet 2015.
              </p>
            </div>
          </FlexCenter>
          <MapContainer>
            <MapLabels>
              <InfoBox>
                {dataLabels[selectedData == 'Elbilarna' ? 'Elbilarna' : 'Utsläppen'].map((label, i) => (
                  <MapLabel color={labelColors[i]} label={label} key={i} />
                ))}
              </InfoBox>
            </MapLabels>
            <Map emissionsLevels={data} boundaries={boundaries[selectedData == 'Elbilarna' ? 'Elbilarna' : 'Utsläppen']}></Map>
          </MapContainer>
          <FlexCenter>
            <DropDown
              className="startpage"
              municipalitiesName={municipalitiesName}
              placeholder="Hur går det i din kommun?"
            />
          </FlexCenter>
        </Container>
      </PageWrapper>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const municipalities = new ClimateDataService().getMunicipalities()
  if (municipalities.length < 1) throw new Error('No municipalities found')

  res.setHeader(
    'Cache-Control',
    'public, stale-while-revalidate=60, max-age=' + 60 * 60 * 24 * 7,
  )

  return {
    props: { municipalities },
  }
}

export default Kommuner

Kommuner.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
      <Footer />
    </>
  )
}
