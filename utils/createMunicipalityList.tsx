import { ColumnDef } from '@tanstack/react-table'
import { Municipality, SelectedData } from './types'
import { datasetDescriptions, currentData } from './datasetDescriptions'

export const calculateClimatePlanRankings = (
  data: Array<{ name: string; dataPoint: string | number | Date | JSX.Element; formattedDataPoint: string, yearAdapted: string }>,
) => data.map((item) => ({
  ...item,
  index: item.dataPoint === 'Saknas' ? 1 : -1,
}))

export const calculateRankings = (
  data: Array<{ name: string; dataPoint: number; formattedDataPoint: string, yearAdapted: string }>,
  sortAscending: boolean,
  stringsOnTop: boolean,
) => {
  const customSort = (a: number, b: number) => {
    // Handle NaN values
    const aIsNaN = Number.isNaN(a)
    const bIsNaN = Number.isNaN(b)
    if (aIsNaN && bIsNaN) {
      return 0
    }
    if (aIsNaN || bIsNaN) {
      // eslint-disable-next-line no-nested-ternary
      return stringsOnTop ? (aIsNaN ? -1 : 1) : (aIsNaN ? 1 : -1)
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
      dataPoint: number | string | Date | JSX.Element
      formattedDataPoint: string
      yearAdapted: string
      index: number

    }>
  }

  const newRankedData: RankedData = {} as RankedData

  const sortAscending = datasetDescriptions[selectedData]?.sortAscending || false
  const edgeCaseOnTop = datasetDescriptions[selectedData]?.stringsOnTop || false

  if (selectedData === 'Klimatplanerna') {
    // special case for climate plans
    newRankedData[selectedData] = calculateClimatePlanRankings(
      datasets.map((item) => ({
        name: item.name,
        dataPoint: item.dataPoint,
        formattedDataPoint: item.formattedDataPoint,
        yearAdapted: item.yearAdapted,

      })),
    )
  } else {
    // all other datasets
    newRankedData[selectedData] = calculateRankings(
      datasets.map((item) => ({
        name: item.name,
        dataPoint: Number(item.dataPoint),
        formattedDataPoint: item.formattedDataPoint,
        yearAdapted: item.yearAdapted,
      })),
      sortAscending,
      edgeCaseOnTop,
    )
  }

  return newRankedData
}

export const listColumns = (
  selectedData: SelectedData,
  columnHeader: string,
): ColumnDef<{
  name: string
  dataPoint: string | number | Date | JSX.Element
  formattedDataPoint: string
  index: number
  yearAdapted: string
}>[] => {
  const isClimatePlan = selectedData === 'Klimatplanerna'

  return [
    {
      header: isClimatePlan ? 'Har plan?' : 'Ranking',
      cell: (row) => {
        if (isClimatePlan) {
          return row.row.original.index === -1
            ? (
              <a
                href={row.row.original.dataPoint.toString()}
                onClick={(e) => e.stopPropagation()}
                target="_blank"
                rel="noreferrer"
                style={{ color: 'orange' }}
              >
                Ja
              </a>
            )
            : 'Nej'
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
      header: () => columnHeader,
      cell: (row) => {
        const { formattedDataPoint } = row.row.original

        if (isClimatePlan) {
          return row.row.original.dataPoint !== 'Saknas'
            ? row.row.original.yearAdapted
            : 'Saknar plan'
        }
        return formattedDataPoint
      },
      accessorKey: 'dataPoint',
    },
  ]
}
