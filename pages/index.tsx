import { GetServerSideProps, GetStaticProps } from 'next'
import { useState } from 'react'
import styled from 'styled-components'
import DropDown from '../components/DropDown'
import Map from '../components/Map'
import MetaTags from '../components/MetaTags'
import { H1, ParagraphBold, Paragraph } from '../components/Typography'
import { EmissionService } from '../utils/emissionService'
import { Municipality } from '../utils/types'
import PageWrapper from '../components/PageWrapper'
import Icon from '../public/icons/arrow.svg'
import { devices } from '../utils/devices'

type PropsType = {
  municipalities: Array<Municipality>
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap 3rem;
  position: relative;
`

const Hero = styled.div`
  background: ${({ theme }) => theme.black};
`

const Square = styled.div<{ color: string }>`
  background-color: ${(props) => props.color};
  width: 20px;
  height: 20px;
  position: relative;
`

const ArrowIcon = styled(Icon)<{ rotateUp?: boolean }>`
  position: absolute;
  z-index: 1;
  margin: auto;
  left: 0;
  ${(props) => props.rotateUp && 'transform: rotate(-90deg)'};
  right: 0;
  top: 0;
  bottom: 0;
`

const MapContainer = styled.div`
  position: absolute;
  // TODO: Hardcoding this is not good.
  height: 900px;
  width: 100%;
  display: flex;
`

const MapLabels = styled.div`
  padding-left: 0.87rem;
  padding-top: 1.2rem;

`

const InfoBox = styled.div`
  padding-bottom: 0.5rem;
`

const Label = styled.div`
  flex-shrink: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &:first-child div {
    border-top-left-radius: 10%;
    border-top-right-radius: 10%;
  }
  &:last-child div {
    border-bottom-left-radius: 10%;
    border-bottom-right-radius: 10%;
  }
`

const FlexCenter = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

const StyledParagraph = styled(Paragraph)`
  z-index: 1;
`

const StartPageWrapper = styled.div`
  padding: 30px;
  background: ${({ theme }) => theme.black};
  height: 80vh;
  width: 40vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const Home: React.FC<PropsType> = ({ municipalities }: PropsType) => {
  const [selected, setSelected] = useState('Utforska kartan')
  const municipalitiesName = municipalities.map((item) => item.Name)
  const emissionsLevels = municipalities.map((item) => ({
    name: item.Name,
    emissions: item.HistoricalEmission.EmissionLevelChangeAverage,
  }))

  return (
    <>
      <MetaTags
        title="Klimatkollen — Enkel fakta om klimatomställningen"
        description="Hur går det med utsläppsminskningarna i Sverige och i din kommun? Minskar eller ökar klimatutsläppen? Klarar vi Parisavtalet?"
      />
      <MapContainer>
        

        <Map emissionsLevels={emissionsLevels} setSelected={setSelected}></Map>
      </MapContainer>

      <StartPageWrapper backgroundColor="gradient">
        <Container>
          <div>
            <H1>Klimatkollen</H1>
            <Paragraph>Enkel fakta om klimatomställningen</Paragraph>
          </div>
          <FlexCenter>
            <DropDown
              className="startpage"
              municipalitiesName={municipalitiesName}
              placeholder="Hur går det i din kommun?"
            />
          </FlexCenter>
          <FlexCenter>
            <Hero>
              <ParagraphBold>Utsläppsförändring sedan Parisavtalet</ParagraphBold>
              <p>
                För att klara Parisavtalet behöver koldioxidutsläppen i Sverige minska med
                X% per år. På kartan visas genomsnittlig årlig förändring av utsläppen i
                Sveriges kommuner sedan Parisavtalet 2015.
              </p>
            </Hero>

            <MapLabels>
              <InfoBox>
                <Label>
                  <Square color="#EF3054">
                    <ArrowIcon rotateUp={true} />
                  </Square>
                  <StyledParagraph>0% +</StyledParagraph>
                </Label>
                <Label>
                  <Square color="#EF5E30">
                    <ArrowIcon />
                  </Square>
                  <StyledParagraph>0–1%</StyledParagraph>
                </Label>
                <Label>
                  <Square color="#EF7F17">
                    <ArrowIcon />
                  </Square>
                  <StyledParagraph>1–2%</StyledParagraph>
                </Label>
                <Label>
                  <Square color="#EF9917">
                    <ArrowIcon />
                  </Square>
                  <StyledParagraph>2–3%</StyledParagraph>
                </Label>
                <Label>
                  <Square color="#EFBF17">
                    <ArrowIcon />
                  </Square>
                  <StyledParagraph>3–10%</StyledParagraph>
                </Label>
                <Label>
                  <Square color="#91BFC8">
                    <ArrowIcon />
                  </Square>
                  <StyledParagraph>10%–15%</StyledParagraph>
                </Label>
              </InfoBox>
              <InfoBox>
                <Label>
                  <Square color="#4ECB80"></Square>
                  <StyledParagraph>Parisavtalet</StyledParagraph>
                </Label>
              </InfoBox>
            </MapLabels>
          </FlexCenter>
        </Container>
      <div style={{ height: 200 }}></div>
      </StartPageWrapper>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  if ((await municipalities).length < 1) throw new Error('No municipalities found')

  return {
    props: { municipalities: await municipalities },
  }
}

const municipalities = new EmissionService().getMunicipalities()

export default Home
