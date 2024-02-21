import { ColumnDef } from '@tanstack/react-table'
import { DatasetDescription, Municipality, SelectedData } from './types'
import { datasetDescriptions, currentData } from './datasetDescriptions'

export const calculateClimatePlanRankings = (
  data: Array<{ name: string; dataPoint: string | number | JSX.Element; formattedDataPoint: string }>,
) => data.map((item) => ({
  ...item,
  index: item.dataPoint === 'Saknas' ? 1 : -1,
}))

export const calculateNumberRankings = (
  data: Array<{ name: string; dataPoint: number; formattedDataPoint: string }>,
  sortAscending: boolean,
) => {
  const customSort = (a: number, b: number) => {
    // Handle NaN values
    const aIsNaN = Number.isNaN(a)
    const bIsNaN = Number.isNaN(b)
    if (aIsNaN && bIsNaN) {
      return 0
    }
    if (aIsNaN) {
      return 1
    }
    if (bIsNaN) {
      return -1
    }

    // Sort non-NaN values normally
    return sortAscending ? a - b : b - a
  }

  const sortedData = data.sort((a, b) => customSort(a.dataPoint, b.dataPoint))
  return sortedData.map((item, index) => ({
    ...item,
    index: index + 1,
  }))
}

export const rankData = (municipalities: Municipality[], selectedData: SelectedData) => {
  const datasets = currentData(municipalities, selectedData)

  type RankedData = {
    [key in SelectedData]: Array<{
      name: string
      dataPoint: number | string | JSX.Element
      formattedDataPoint: string
      index: number
    }>
  }

  const newRankedData: RankedData = {} as RankedData

  const sortAscending = datasetDescriptions[selectedData]?.sortAscending || false

  if (selectedData === 'Klimatplanerna') {
    // special case for climate plans
    newRankedData[selectedData] = calculateClimatePlanRankings(
      datasets.map((item) => ({
        name: item.name,
        dataPoint: item.dataPoint,
        formattedDataPoint: item.formattedDataPoint,
      })),
    )
  } else {
    // all other datasets
    newRankedData[selectedData] = calculateNumberRankings(
      datasets.map((item) => ({
        name: item.name,
        dataPoint: Number(item.dataPoint),
        formattedDataPoint: item.formattedDataPoint,
      })),
      sortAscending,
    )
  }

  return newRankedData
}

const columnHeader = (datasetDescription: DatasetDescription) => (
  <div>{datasetDescription.columnHeader}</div>
)

export const listColumns = (
  selectedData: SelectedData,
  datasetDescription: DatasetDescription,
): ColumnDef<{
  name: string
  dataPoint: string | number | JSX.Element
  formattedDataPoint: string
  index: number
}>[] => {
  const isClimatePlan = selectedData === 'Klimatplanerna'

  return [
    {
      header: isClimatePlan ? 'Har plan?' : 'Ranking',
      cell: (row) => {
        if (isClimatePlan) {
          return row.row.original.index === -1 ? 'Ja' : 'Nej'
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
      cell: (row) => {
        const { dataPoint, formattedDataPoint } = row.row.original
        if (isClimatePlan) {
          return dataPoint === 'Saknas' ? (
            <i style={{ color: 'grey' }}>{dataPoint}</i>
          ) : (
            <a href={dataPoint as string} target="_blank" rel="noreferrer">
              Öppna
            </a>
          )
        }
        return formattedDataPoint
      },
      accessorKey: 'dataPoint',
      sortingFn: (a, b) => a.original.index - b.original.index,
    },
  ]
}
