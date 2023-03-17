import { GetServerSideProps } from 'next'
import { ReactElement, useState } from 'react'
import styled from 'styled-components'

import DropDown from '../components/DropDown'
import Map from '../components/Map'
import MetaTags from '../components/MetaTags'
import { ParagraphBold, Paragraph } from '../components/Typography'
import { ClimateDataService } from '../utils/climateDataService'
import { Municipality } from '../utils/types'
import PageWrapper from '../components/PageWrapper'
import { devices } from '../utils/devices'
import Layout from '../components/Layout'
import Footer from '../components/Footer'
import MapLabel from '../components/MapLabel'

const ToggleButton = styled.button`
  width: 100%;
  margin-top: 3rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.paperWhite};
  background: ${({ theme }) => theme.darkGrey};
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 0;
  align-items: center;
  justify-content: center;
  padding: 0.8rem;
  cursor: pointer;
  fill: ${({ theme }) => theme.greenGraphTwo};
  &:hover {
    background: ${({ theme }) => theme.grey};
  }
`

type PropsType = {
  municipalities: Array<Municipality>
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
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

const Kommuner = ({ municipalities }: PropsType) => {
  const [toggleData, setToggleData] = useState('ElectricCars')
  const municipalitiesName = municipalities.map((item) => item.Name)
  const data = municipalities.map((item) => ({
    name: item.Name,
    emissions: toggleData == 'ChangeAverage' ? item.HistoricalEmission.EmissionLevelChangeAverage : item.ElectricCars,
  }))

  const handleToggle = () => {
    if (toggleData == 'ElectricCars') {
      setToggleData('ChangeAverage')
    } else {
      setToggleData('ElectricCars')
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
          <FlexCenter>
            <DropDown
              className="startpage"
              municipalitiesName={municipalitiesName}
              placeholder="Hur går det i din kommun?"
            />
          </FlexCenter>
          <FlexCenter>
            <div>
              <ParagraphBold>Utsläppsförändring sedan Parisavtalet</ParagraphBold>
              <p>
                På kartan visas genomsnittlig årlig förändring av utsläppen i Sveriges
                kommuner sedan Parisavtalet 2015.
              </p>
            </div>
          </FlexCenter>
          <ToggleButton onClick={handleToggle}>
            {toggleData == 'ElectricCars' ? 'Visa utsläpp' : 'Visa elbilsomställning'}
          </ToggleButton>
          <MapContainer>
            <MapLabels>
              <InfoBox>  {/* fixme elbilar <30%, 30-40, 40-50, 50-60, 60-70, 70< */}
                <MapLabel color={'#EF3054'} label={'0% +'} rotateUp={true} />
                <MapLabel color={'#EF5E30'} label={'0–1%'} />
                <MapLabel color={'#EF7F17'} label={'1–2%'} />
                <MapLabel color={'#EF9917'} label={'2–3%'} />
                <MapLabel color={'#EFBF17'} label={'3–10%'} />
                <MapLabel color={'#91BFC8'} label={'10–15%'} />
              </InfoBox>
            </MapLabels>
            <Map emissionsLevels={data}></Map>
          </MapContainer>
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
