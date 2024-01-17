import { ColumnDef } from '@tanstack/react-table'
import { DatasetDescription, Municipality, SelectedData } from './types'
import { datasetDescriptions, currentData } from './datasetDescriptions'

export const calculateStringRankings = (
  data: Array<{ name: string; dataPoint: string | number | JSX.Element }>,
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
  const sortedData = data.sort((a, b) => (sortAscending ? a.dataPoint - b.dataPoint : b.dataPoint - a.dataPoint))
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
      dataPoint: number | string | JSX.Element
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
        dataPoint: item.dataPoint,
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

const columnHeader = (datasetDescription: DatasetDescription) => (
  <div>{datasetDescription.columnHeader}</div>
)

export const listColumns = (
  selectedData: SelectedData,
  datasetDescription: DatasetDescription,
): ColumnDef<{
  name: string
  dataPoint: string | number | JSX.Element
  index: number
}>[] => {
  const isClimatePlan = selectedData === 'Klimatplanerna'

  return [
    {
      header: isClimatePlan ? 'Har plan?' : 'Ranking',
      cell: (row) => {
        if (isClimatePlan) {
          return row.row.original.index === 1 ? 'Ja' : 'Nej'
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
        if (isClimatePlan) {
          return row.row.original.dataPoint === 'Saknas' ? (
            <i style={{ color: 'grey' }}>{row.row.original.dataPoint}</i>
          ) : (
            <a href={row.row.original.dataPoint as string} target="_blank" rel="noreferrer">
              Öppna
            </a>
          )
        }
        return row.renderValue()
      },
      accessorKey: 'dataPoint',
    },
  ]
}
