
import { GetServerSideProps } from 'next'
import { ReactElement, useMemo, useState } from 'react'
import styled from 'styled-components'
import { ColumnDef } from '@tanstack/react-table'

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
import Footer from '../../components/Footer'
import ComparisonTable from '../../components/ComparisonTable'

type PropsType = {
  municipalities: Array<Municipality>
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const InfoText = styled.div`
  margin-top: 3rem;
`

const Square = styled.div<{ color: string }>`
  background-color: ${(props) => props.color};
  width: 20px;
  height: 20px;
  position: relative;
`

const ArrowIcon = styled(Icon) <{ rotateUp?: boolean }>`
  position: absolute;
  z-index: 1;
  margin: auto;
  left: 0;
  ${(props) => props.rotateUp && 'transform: rotate(-90deg)'};
  right: 0;
  top: 0;
  bottom: 0;
`

const ToggleButton = styled.button`
  width: 100%;
  margin-top: 3rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.paperWhite};
  background: ${({ theme }) => theme.dark};
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

const MunicipalityContainer = styled.div`
  position: relative;
  overflow-y: scroll;
  // TODO: Hardcoding this is not good.
  height: 380px;
  border: 1px solid ${({ theme }) => theme.paperWhite};
  border-radius: 8px;
  display: flex;
  @media only screen and (${devices.tablet}) {
    height: 500px;
  }
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  ::-webkit-scrollbar {  /* Chrome, Safari and Opera */
    display: none;
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

const Row = styled.a`
  text-decoration: none; 
`

const Kommuner = ({ municipalities }: PropsType) => {
  const [, setSelected] = useState('Utforska kartan')
  const [toggleViewMode, setToggleViewMode] = useState(true);
  const municipalitiesName = municipalities.map((item) => item.Name)
  const emissionsLevels = municipalities.map((item) => ({
    name: item.Name,
    emissions: item.HistoricalEmission.EmissionLevelChangeAverage,
  }))

  type MuniciplaityItem = {
    name: string,
    emissions: number;
  }

  const cols = useMemo<ColumnDef<MuniciplaityItem>[]>(
    () => [
      {
        header: 'Ranking',
        cell: (row) => row.cell.row.index + 1,
        accessorKey: 'index',
      },
      {
        header: 'Kommun',
        cell: (row) => row.renderValue(),
        accessorKey: 'name',
      },
      {
        header: 'Utsläppsförändring', // Fixme inforuta
        cell: (row) => (row.renderValue() * 100).toFixed(1) + '%',
        accessorKey: 'emissions',
      },
    ],
    []
  )

  return (
    <>
      <MetaTags
        title="Klimatkollen — Få koll på Sveriges klimatomställning"
        description="Hur går det med utsläppsminskningarna i Sverige och i din kommun? Minskar eller ökar klimatutsläppen? Klarar vi Parisavtalet?"
      />
      <PageWrapper backgroundColor="black">
        <Container>
          <DropDown
            className="startpage"
            municipalitiesName={municipalitiesName}
            placeholder="Hur går det i din kommun?"
          />
          <InfoText>
            <ParagraphBold>Utsläppsförändring sedan Parisavtalet</ParagraphBold>
            <p>
              På kartan visas genomsnittlig årlig förändring av utsläppen i Sveriges
              kommuner sedan Parisavtalet 2015.
            </p>
          </InfoText>
          <ToggleButton onClick={() => setToggleViewMode(!toggleViewMode)}>
            {toggleViewMode ? 'Visa lista' : 'Visa karta'}
          </ToggleButton>
          <MunicipalityContainer>
            <div style={{ display: toggleViewMode ? "block" : "none" }}>
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
            </div>
            <div style={{ display: toggleViewMode ? "none" : "block" }}>
              <ComparisonTable data={emissionsLevels} columns={cols} />
            </div>
          </MunicipalityContainer>
        </Container>
      </PageWrapper>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const municipalities = new EmissionService().getMunicipalities()
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

