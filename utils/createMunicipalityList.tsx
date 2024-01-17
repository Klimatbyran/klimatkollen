import { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { DatasetDescription, Municipality, SelectedData } from './types'
import { datasetDescriptions, currentData } from './datasetDescriptions'

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

export const rankData = (municipalities: Municipality[], selectedData: SelectedData) => {
  const datasets = currentData(municipalities, selectedData)

  type RankedData = {
    [key in SelectedData]: Array<{
      name: string
      dataPoint: number | string
      index: number
    }>
  }

  const newRankedData: RankedData = {} as RankedData

  const sortAscending = datasetDescriptions[selectedData]?.sortAscending || false

  if (selectedData === 'Klimatplanerna') {
    // special case for climate plans
    newRankedData[selectedData] = calculateStringRankings(
      datasets.map((item) => ({
        name: item.name,
        dataPoint: item.formattedDataPoint,
      })),
    )
  } else {
    // all other datasets
    newRankedData[selectedData] = calculateNumberRankings(
      datasets.map((item) => ({
        name: item.name,
        dataPoint: Number(item.formattedDataPoint),
      })),
      sortAscending,
    )
  }

  return newRankedData
}

type MunicipalityItem = {
  name: string
  dataPoint: number | string
}

const columnHeader = (datasetDescription: DatasetDescription) => (
  <div>
    {datasetDescription.columnHeader}
  </div>
)

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
        cell: (row: { renderValue: () => unknown }) => row.renderValue(),
        accessorKey: 'dataPoint',
      },
    ],
    [datasetDescription, isClimatePlan],
  )
}
