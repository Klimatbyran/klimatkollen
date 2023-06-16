import { ColumnDef } from '@tanstack/react-table'
import { DatasetDescription, Municipality, SelectedData } from './types'
import { useMemo } from 'react'
import { data, datasetDescriptions, default_dataset } from '../data/dataset_descriptions'
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
  const sortedData = data.sort((a, b) =>
    sortAscending ? a.dataPoint - b.dataPoint : b.dataPoint - a.dataPoint,
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
    Cykelvägarna: municipalities.map((item) => ({
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
    Cykelvägarna: [],
  }

  for (const datasetKey in datasets) {
    if (Object.prototype.hasOwnProperty.call(datasets, datasetKey)) {
      if (datasetKey === 'Klimatplanerna') {
        newRankedData[datasetKey] = calculateStringRankings(
          datasets[datasetKey].map(
            (item: { name: string; dataPoint: string | number }) => ({
              name: item.name,
              dataPoint: item.dataPoint,
            }),
          ),
        )
      } else {
        const sortAscending = datasetKey === default_dataset ? true : false
        newRankedData[datasetKey] = calculateNumberRankings(
          datasets[datasetKey].map(
            (item: { name: string; dataPoint: number | string }) => ({
              name: item.name,
              dataPoint: Number(item.dataPoint),
            }),
          ),
          sortAscending,
        )
      }
    }
  }

  return newRankedData
}

const formatData = (rowData: unknown, selectedData: SelectedData) => {
  const boundaries: Array<string | number> = datasetDescriptions[selectedData].boundaries
  const dataType = datasetDescriptions[selectedData].dataType
  let dataString: JSX.Element = <span>Data saknas</span>
  if (dataType === 'Link') {
    dataString = boundaries.includes(rowData as string) ? (
      <i style={{ color: 'grey' }}>{rowData as string}</i>
    ) : (
      <a
        href={rowData as string}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => e.stopPropagation()}>
        Öppna
      </a>
    )
  } else if (dataType === 'Percent') {
    const rowNumber = rowData as number
    const percent = (rowNumber * 100).toFixed(1)
    dataString = rowNumber > 0 ? <span>+{percent}</span> : <span>{percent}</span>
  } else if (dataType === 'Number') {
    dataString = <span>{(rowData as number).toFixed(1)} {datasetDescriptions[selectedData].unit}</span>
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
      <InfoTooltip text={text} />
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
        cell: (row) =>
          isClimatePlan
            ? row.row.original.dataPoint === 'Saknas'
              ? 'Nej'
              : 'Ja'
            : row.cell.row.index + 1,
        accessorKey: 'index',
      },
      {
        header: 'Kommun',
        cell: (row: { renderValue: () => unknown }) => row.renderValue(),
        accessorKey: 'name',
      },
      {
        header: () => columnHeader(datasetDescription),
        cell: (row: { renderValue: () => unknown }) =>
          formatData(row.renderValue(), selectedData),
        accessorKey: 'dataPoint',
      },
    ],
    [datasetDescription, isClimatePlan, selectedData],
  )
}