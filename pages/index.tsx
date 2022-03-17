import { GetServerSideProps } from 'next'
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
import Image from 'next/image'

type PropsType = {
  municipalities: Array<Municipality>
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap 3rem;
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
`

const StyledParagraph = styled(Paragraph)`
  z-index: 1;
  max-width: 6.7em;
  @media only screen and (${devices.tablet}) {
    max-width: 20em;
  }
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
      <PageWrapper backgroundColor="black">
        <Container>
          <div>
            <Image src="/logo.png" width="268.06" height="52" />
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
            <div>
              <ParagraphBold>Utsläppsförändring sedan Parisavtalet</ParagraphBold>
              <p>
                För att klara Parisavtalet behöver koldioxidutsläppen i Sverige minska med
                21% per år. På kartan visas genomsnittlig årlig förändring av utsläppen i
                Sveriges kommuner sedan Parisavtalet 2015.
              </p>
            </div>
          </FlexCenter>
          <MapContainer>
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
                  <StyledParagraph>10–15%</StyledParagraph>
                </Label>
              </InfoBox>
              <InfoBox>
                <Label style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Square color="#4ECB80"></Square>
                  <StyledParagraph>21% (i nivå med Parisavtalet)</StyledParagraph>
                </Label>
              </InfoBox>
            </MapLabels>

            <Map emissionsLevels={emissionsLevels} setSelected={setSelected}></Map>
          </MapContainer>
        </Container>
      </PageWrapper>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const municipalities = await new EmissionService().getMunicipalities()
  if (municipalities.length < 1) throw new Error('No municipalities found')

  res.setHeader(
    'Cache-Control',
    'public, stale-while-revalidate=60, max-age=' + 60 * 60 * 24 * 7,
  )

  return {
    props: { municipalities },
  }
}

export default Home
