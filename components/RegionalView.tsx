import dynamic from 'next/dynamic'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

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
  dataOnDisplay,
  defaultDataView,
  secondaryDataView,
} from '../utils/datasetDefinitions'
import { Municipality, DatasetKey, DataDescriptions } from '../utils/types'
import { normalizeString } from '../utils/shared'
import { municipalityColumns, rankData } from '../utils/createMunicipalityList'
import Markdown from './Markdown'

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
  margin: 56px 0 0 16px;
  z-index: 200;

  @media only screen and (${devices.tablet}) {
    margin: 60px 0 0 16px;
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
  selectedDataset: DatasetKey
  setSelectedDataset: (newData: DatasetKey) => void
  selectedDataView: string
  setSelectedDataView: (newData: string) => void
  dataDescriptions: DataDescriptions
}

function RegionalView({
  municipalities,
  selectedDataset,
  setSelectedDataset,
  selectedDataView,
  setSelectedDataView,
  dataDescriptions,
}: RegionalViewProps) {
  const router = useRouter()
  const handleDataChange = (newData: DatasetKey) => {
    setSelectedDataset(newData)
    const normalizedDataset = normalizeString(newData)
    router.push(`/geografiskt/${normalizedDataset}/${selectedDataView}`, undefined, {
      shallow: true,
    })
  }
  const { t } = useTranslation()

  const municipalityNames = municipalities.map((item) => item.Name) // get all municipality names for drop down
  // get all municipality names and data points for map and list
  const municipalityData = dataOnDisplay(municipalities, selectedDataset, router.locale as string, t)
  const datasetDescription = dataDescriptions[selectedDataset] // get description of selected dataset

  const handleToggleView = () => {
    const newDataView = selectedDataView === defaultDataView ? secondaryDataView : defaultDataView
    setSelectedDataView(newDataView)
    router.replace(
      `/geografiskt/${normalizeString(selectedDataset as string)}/${newDataView}`,
      undefined,
      {
        shallow: true,
      },
    )
  }

  const cols = municipalityColumns(selectedDataset, datasetDescription.columnHeader, t)
  const rankedData = rankData(municipalities, selectedDataset, router.locale as string, t)

  const isDefaultDataView = selectedDataView === defaultDataView

  const routeString = 'kommun'

  return (
    <>
      <H2Regular>{t('startPage:questionTitle')}</H2Regular>
      <RadioButtonMenu
        selectedData={selectedDataset}
        handleDataChange={handleDataChange}
        dataDescriptions={dataDescriptions}
      />
      <InfoContainer>
        <TitleContainer>
          <FloatingH5>{datasetDescription.title}</FloatingH5>
          <ToggleButton
            handleClick={handleToggleView}
            text={isDefaultDataView ? t('startPage:toggleView.list') : t('startPage:toggleView.map')}
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
          <Markdown>{datasetDescription.body}</Markdown>
          <Markdown components={{ p: ParagraphSource }}>
            {datasetDescription.source}
          </Markdown>
        </InfoText>
      </InfoContainer>
      <DropDown
        municipalitiesName={municipalityNames}
        placeholder={t('startPage:yourMunicipality')}
      />
    </>
  )
}

export default RegionalView
