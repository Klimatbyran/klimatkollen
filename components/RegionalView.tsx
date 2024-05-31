import dynamic from 'next/dynamic'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import ComparisonTable from '../components/ComparisonTable'
import MapLabels from '../components/Map/MapLabels'
import ListIcon from '../public/icons/list.svg'
import MapIcon from '../public/icons/map.svg'
import ToggleButton from '../components/ToggleButton'
import DatasetButtonMenu from './DatasetButtonMenu'
import DropDown from '../components/DropDown'
import { H2Regular, H5Regular, Paragraph } from './Typography'
import { devices } from '../utils/devices'
import { dataOnDisplay } from '../utils/datasetDefinitions'
import { Municipality, DatasetKey, DataDescriptions } from '../utils/types'
import { normalizeString } from '../utils/shared'
import { municipalityColumns, rankData } from '../utils/createMunicipalityList'
import Markdown from './Markdown'
import { defaultDataView, secondaryDataView } from '../pages/[dataGroup]/[dataset]/[dataView]'

const Map = dynamic(() => import('../components/Map/Map'))

const InfoText = styled.div`
  padding: 8px 16px;
  position: -webkit-sticky;
  position: sticky;
  bottom: 0;
  background: ${({ theme }) => theme.lightBlack};
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  z-index: 50;

  p {
    font-size: 12px;
    margin-top: 0;
  }

  &::before {
    content: ' ';
    position: absolute;
    width: 100%;
    height: 2rem;
    background: linear-gradient(transparent, #0002);
    top: -2rem;
    left: 0;
    right: 0;
  }

  @media screen and (${devices.tablet}) {
    p {
      font-size: 14px;
    }
  }
`

const ParagraphSource = styled(Paragraph)`
  color: ${({ theme }) => theme.newColors.gray};
  margin: 0;
`

const InfoContainer = styled.div`
  width: 100%;
  position: relative;
  background: ${({ theme }) => theme.lightBlack};
  border-radius: 8px;
  margin-bottom: 32px;
  z-index: 15;
`

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const FloatingH5 = styled(H5Regular)`
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 200;
  font-size: 1rem;
  padding: 4px 8px;
  height: 44px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  background: ${({ theme }) => `${theme.lightBlack}99`};

  @media only screen and (${devices.smallMobile}) {
    font-size: 1.125rem;
  }
`

// FIXME Refactor so default data view is not assumed to be 'lista'
const ComparisonContainer = styled.div<{ $dataView: string }>`
  position: relative;
  border-radius: 8px;
  display: flex;
  margin-top: ${({ $dataView }) => ($dataView === defaultDataView ? '64px' : '0')};
  min-height: 400px;

  @media only screen and (${devices.tablet}) {
    min-height: 520px;
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
    router.push(`/geografiskt/${normalizedDataset}/${selectedDataView}`, undefined, { shallow: true })
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
      { shallow: true },
    )
  }

  const cols = municipalityColumns(selectedDataset, datasetDescription.columnHeader, t)
  const rankedData = rankData(municipalities, selectedDataset, router.locale as string, t)

  const isDefaultDataView = selectedDataView === defaultDataView

  const routeString = 'kommun'

  return (
    <>
      <H2Regular>{t('startPage:regionalView.questionTitle')}</H2Regular>
      <DatasetButtonMenu
        selectedData={selectedDataset}
        handleDataChange={handleDataChange}
        dataDescriptions={dataDescriptions}
      />
      <InfoContainer>
        {/* TODO: Remove this margin hack and replace with flex/grid layout instead */}
        <TitleContainer>
          <FloatingH5>{datasetDescription.title}</FloatingH5>
          <ToggleButton
            handleClick={handleToggleView}
            // FIXME Refactor so default data view is not assumed to be 'lista'.
            // Below code should not need to be edited when changing default data view
            text={isDefaultDataView ? t('startPage:toggleView.map') : t('startPage:toggleView.list')}
            icon={isDefaultDataView ? <MapIcon /> : <ListIcon />}
          />
        </TitleContainer>
        <ComparisonContainer $dataView={selectedDataView.toString()}>
          {isDefaultDataView ? (
            <ComparisonTable data={rankedData[selectedDataset]} columns={cols} routeString={routeString} />
          ) : (
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
        placeholder={t('startPage:regionalView.yourMunicipality')}
      />
    </>
  )
}

export default RegionalView
