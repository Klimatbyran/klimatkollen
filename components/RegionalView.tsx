import dynamic from 'next/dynamic'
import styled from 'styled-components'
import { NextRouter } from 'next/router'
import ComparisonTable from '../components/ComparisonTable'
import MapLabels from '../components/Map/MapLabels'
import ListIcon from '../public/icons/list.svg'
import MapIcon from '../public/icons/map.svg'
import ToggleButton from '../components/ToggleButton'
import RadioButtonMenu from './RadioButtonMenu'
import DropDown from '../components/DropDown'
import { H2Regular, H5Regular, Paragraph } from './Typography'
import { devices } from '../utils/devices'
import {
  datasetDescriptions,
  currentData,
  defaultDataView,
  secondaryDataView,
} from '../utils/datasetDescriptions'
import { Municipality, SelectedData } from '../utils/types'
import { normalizeString } from '../utils/shared'
import { municipalityColumns, rankData } from '../utils/createMunicipalityList'

const Map = dynamic(() => import('../components/Map/Map'))

const InfoText = styled.div`
  padding: 0 16px;
`

const ParagraphSource = styled(Paragraph)`
  font-size: 13px;
  color: ${({ theme }) => theme.grey};
`

const InfoContainer = styled.div`
  width: 100%;
  position: relative;
  background: ${({ theme }) => theme.lightBlack};
  border-radius: 8px;
  margin-bottom: 32px;
  z-index: 15;
  ::-webkit-scrollbar {
    display: none;
  }
`

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const FloatingH5 = styled(H5Regular)`
  position: absolute;
  margin: 60px 0 0 16px;
  z-index: 200;

  @media only screen and (${devices.mobile}) {
    margin: 55px 0 0 16px;
  }
`

const ComparisonContainer = styled.div<{ $dataView: string }>`
  position: relative;
  overflow-y: scroll;
  z-index: 100;
  // TODO: Hardcoding this is not good.
  height: 400px;
  border-radius: 8px;
  display: flex;
  margin-top: ${({ $dataView }) => ($dataView === secondaryDataView ? '64px' : '0')};

  @media only screen and (${devices.tablet}) {
    height: 500px;
  }

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  ::-webkit-scrollbar {
    /* Chrome, Safari and Opera */
    display: none;
  }
`

type RegionalViewProps = {
  municipalities: Array<Municipality>
  selectedDataset: SelectedData
  setSelectedDataset: (newData: SelectedData) => void
  selectedDataView: string
  setSelectedDataView: (newData: string) => void
  router: NextRouter
}

function RegionalView({
  municipalities,
  selectedDataset,
  setSelectedDataset,
  selectedDataView,
  setSelectedDataView,
  router,
}: RegionalViewProps) {
  const handleDataChange = (newData: SelectedData) => {
    const newDataString = newData as string
    setSelectedDataset(newDataString)
    const normalizedDataset = normalizeString(newDataString)
    router.push(`/${normalizedDataset}/${selectedDataView}`, undefined, {
      shallow: true,
      scroll: false,
    })
  }

  const municipalityNames = municipalities.map((item) => item.Name) // get all municipality names for drop down
  const municipalityData = currentData(municipalities, selectedDataset) // get all municipality names and data points for map and list
  const datasetDescription = datasetDescriptions[selectedDataset] // get description of selected dataset

  const handleToggleView = () => {
    const newDataView = selectedDataView === defaultDataView ? secondaryDataView : defaultDataView
    setSelectedDataView(newDataView)
    router.replace(
      `/${normalizeString(selectedDataset as string)}/${newDataView}`,
      undefined,
      {
        shallow: true,
        scroll: false,
      },
    )
  }

  const cols = municipalityColumns(selectedDataset, datasetDescription.columnHeader)
  const rankedData = rankData(municipalities, selectedDataset)

  const isDefaultDataView = selectedDataView === defaultDataView

  const routeString = 'kommun'

  return (
    <>
      <H2Regular>Hur går det med?</H2Regular>
      <RadioButtonMenu
        selectedData={selectedDataset}
        handleDataChange={handleDataChange}
      />
      <InfoContainer>
        <TitleContainer>
          <FloatingH5>{datasetDescription.title}</FloatingH5>
          <ToggleButton
            handleClick={handleToggleView}
            text={isDefaultDataView ? 'Listvy' : 'Kartvy'}
            icon={isDefaultDataView ? <ListIcon /> : <MapIcon />}
          />
        </TitleContainer>
        <ComparisonContainer $dataView={selectedDataView.toString()}>
          {isDefaultDataView && (
          <>
            <MapLabels
              labels={datasetDescription.labels}
              rotations={datasetDescription.labelRotateUp}
            />
            <Map
              data={municipalityData}
              boundaries={datasetDescription.boundaries}
            />
          </>
          )}
          {selectedDataView === secondaryDataView && (
          <ComparisonTable data={rankedData[selectedDataset]} columns={cols} routeString={routeString} />
          )}
        </ComparisonContainer>
        <InfoText>
          <Paragraph>{datasetDescription.body}</Paragraph>
          <ParagraphSource>{datasetDescription.source}</ParagraphSource>
        </InfoText>
      </InfoContainer>
      <DropDown
        className="startpage"
        municipalitiesName={municipalityNames}
        placeholder="Hur går det i din kommun?"
      />
    </>
  )
}

export default RegionalView
