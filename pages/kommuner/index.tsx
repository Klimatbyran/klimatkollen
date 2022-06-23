import { GetServerSideProps } from 'next'
import { ReactElement, useState } from 'react'
import styled from 'styled-components'
import DropDown from '../../components/DropDown'
import Map from '../../components/Map'
import MetaTags from '../../components/MetaTags'
import { ParagraphBold, Paragraph } from '../../components/Typography'
import { EmissionService } from '../../utils/emissionService'
import { Municipality } from '../../utils/types'
import PageWrapper from '../../components/PageWrapper'
import Icon from '../../public/icons/arrow.svg'
import { devices } from '../../utils/devices'
import Layout from '../../components/Layout'

type PropsType = {
  municipalities: Array<Municipality>
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
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
  width: 5em;
  font-size: 0.7em;
  margin: 0;
  line-height: 0;

  @media only screen and (${devices.tablet}) {
    font-size: 0.9em;
  }
`

const Kommuner = ({ municipalities }: PropsType) => {
  const [, setSelected] = useState('Utforska kartan')
  const municipalitiesName = municipalities.map((item) => item.Name)
  const emissionsLevels = municipalities.map((item) => ({
    name: item.Name,
    emissions: item.HistoricalEmission.EmissionLevelChangeAverage,
  }))

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

export default Kommuner

Kommuner.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  )
}
