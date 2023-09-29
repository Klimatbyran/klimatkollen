import { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { DatasetDescription, Municipality, SelectedData } from './types'
import { datasetDescriptions, defaultDataset } from '../data/dataset_descriptions'
import InfoTooltip from '../components/InfoTooltip'

export const calculateStringRankings = (
  data: Array<{ name: string; dataPoint: string | number }>,
) => {
  const rankedData = data.map((item) => ({
    ...item,
    index: item.dataPoint === 'Saknas' ? -1 : 1,
  }))
  return rankedData
}

export const calculateNumberRankings = (
  data: Array<{ name: string; dataPoint: number }>,
  sortAscending: boolean,
) => {
  const sortedData = data.sort(
    (a, b) => (sortAscending ? a.dataPoint - b.dataPoint : b.dataPoint - a.dataPoint),
  )
  const rankedData = sortedData.map((item, index) => ({
    ...item,
    index: index + 1,
  }))
  return rankedData
}

type DataSets = {
  [key: string]: Array<{ name: string; dataPoint: number | string }>
}

export const rankData = (municipalities: Municipality[]) => {
  // Fixme refactor
  const datasets: DataSets = {
    Utsläppen: municipalities.map((item) => ({
      name: item.Name,
      dataPoint: item.HistoricalEmission.EmissionLevelChangeAverage,
    })),
    Elbilarna: municipalities.map((item) => ({
      name: item.Name,
      dataPoint: item.ElectricCarChangePercent,
    })),
    Klimatplanerna: municipalities.map((item) => ({
      name: item.Name,
      dataPoint: item.ClimatePlan?.Link,
    })),
    Cyklarna: municipalities.map((item) => ({
      name: item.Name,
      dataPoint: item.BicycleMetrePerCapita,
    })),
  }

  type RankedData = {
    [key in SelectedData]: Array<{
      name: string
      dataPoint: number | string
      index: number
    }>
  }

  const newRankedData: RankedData = {
    Elbilarna: [],
    Utsläppen: [],
    Klimatplanerna: [],
    Cyklarna: [],
  }

  Object.keys(datasets).forEach((datasetKey) => {
    if (datasetKey === 'Klimatplanerna') {
      newRankedData[datasetKey as SelectedData] = calculateStringRankings(
        datasets[datasetKey].map((item) => ({
          name: item.name,
          dataPoint: item.dataPoint,
        })),
      )
    } else {
      const sortAscending = datasetKey === defaultDataset
      newRankedData[datasetKey as SelectedData] = calculateNumberRankings(
        datasets[datasetKey].map((item) => ({
          name: item.name,
          dataPoint: Number(item.dataPoint),
        })),
        sortAscending,
      )
    }
  })
  return newRankedData
}

const formatData = (rowData: string | number, selectedData: SelectedData) => {
  const { boundaries } = datasetDescriptions[selectedData] as { boundaries: string[] }
  const { dataType } = datasetDescriptions[selectedData]
  let dataString: JSX.Element = <span>Data saknas</span>
  if (dataType === 'Link') {
    const stringData = rowData as string
    const inBoundaries = boundaries.includes(stringData)
    dataString = inBoundaries ? (
      <i style={{ color: 'grey' }}>{stringData}</i>
    ) : (
      <a
        href={stringData}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => e.stopPropagation()}
      >
        Öppna
      </a>
    )
  } else if (dataType === 'Percent') {
    const numberData = rowData as number
    const percent = (numberData * 100).toFixed(1)
    dataString = numberData > 0 ? (
      <span>
        +
        {percent}
      </span>
    ) : <span>{percent}</span>
  } else if (dataType === 'Number') {
    const rowNumber = rowData as number
    dataString = <span>{rowNumber.toFixed(1)}</span>
  }
  return dataString
}

type MunicipalityItem = {
  name: string
  dataPoint: number | string
}

const columnHeader = (datasetDescription: DatasetDescription) => {
  const text = datasetDescription.tooltip.toString()
  return (
    <div>
      {datasetDescription.columnHeader}
      {/* <InfoTooltip text={text} /> */}
    </div>
  )
}

export const listColumns = (
  selectedData: SelectedData,
  datasetDescription: DatasetDescription,
) => {
  const isClimatePlan = selectedData === 'Klimatplanerna'

  // fixme
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useMemo<ColumnDef<MunicipalityItem>[]>(
    () => [
      {
        header: isClimatePlan ? 'Har plan?' : 'Ranking',
        cell: (row) => {
          if (isClimatePlan) {
            return row.row.original.dataPoint === 'Saknas' ? 'Nej' : 'Ja'
          }
          return row.cell.row.index + 1
        },
        accessorKey: 'index',
      },
      {
        header: 'Kommun',
        cell: (row: { renderValue: () => unknown }) => row.renderValue(),
        accessorKey: 'name',
      },
      {
        header: () => columnHeader(datasetDescription),
        cell: (row: { renderValue: () => unknown }) => formatData(row.renderValue() as string | number, selectedData),
        accessorKey: 'dataPoint',
      },
    ],
    [datasetDescription, isClimatePlan, selectedData],
  )
}
