import { ColumnDef } from '@tanstack/react-table'
import { Municipality, SelectedData } from './types'
import {
  dataDescriptions, dataOnDisplay, climatePlanMissing, requirementsInProcurement,
} from './datasetDefinitions'

type RowData = {
  name: string
  dataPoint: string | number | Date | JSX.Element
  formattedDataPoint: string
  index: number
  climatePlanYearAdapted?: string
  procurementLink?: string
}

export const calculateClimatePlanRankings = (
  data: Array<{ name: string; dataPoint: string | number | Date | JSX.Element; formattedDataPoint: string }>,
) => data.map((item) => ({
  ...item,
  index: item.dataPoint === climatePlanMissing ? 1 : -1,
}))

export const calculateRankings = (
  data: Array<{ name: string; dataPoint: number; formattedDataPoint: string }>,
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
  const datasets = dataOnDisplay(municipalities, selectedData)

  type RankedData = {
    [key in SelectedData]: Array<RowData>
  }

  const newRankedData: RankedData = {} as RankedData

  const sortAscending = dataDescriptions[selectedData]?.sortAscending || false
  const edgeCaseOnTop = dataDescriptions[selectedData]?.stringsOnTop || false

  if (selectedData === 'Klimatplanerna') {
    // special case for climate plans
    newRankedData[selectedData] = calculateClimatePlanRankings(
      datasets.map((item) => ({
        name: item.name,
        dataPoint: item.primaryDataPoint as string,
        formattedDataPoint: item.formattedPrimaryDataPoint,
        climatePlanYearAdapted: item.climatePlanYearAdapted,
      })),
    )
  } else {
    // all other datasets
    newRankedData[selectedData] = calculateRankings(
      datasets.map((item) => ({
        name: item.name,
        dataPoint: Number(item.primaryDataPoint),
        formattedDataPoint: item.formattedPrimaryDataPoint,
        procurementLink: item.procurementLink,
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
): ColumnDef<RowData>[] => {
  const isClimatePlan = selectedData === 'Klimatplanerna'
  const isProcurement = selectedData === 'Upphandlingarna'

  const getFirstColumnHeader = () => {
    let firstColumnHeader = 'Ranking'
    firstColumnHeader = isClimatePlan ? 'Har plan?' : firstColumnHeader
    firstColumnHeader = isProcurement ? 'Ställer krav?' : firstColumnHeader
    return firstColumnHeader
  }

  const firstColumnClimatePlans = (index: number, dataPoint: string) => (index === -1
    ? (
      <a
        href={dataPoint.toString()}
        onClick={(e) => e.stopPropagation()}
        target="_blank"
        rel="noreferrer"
        style={{ color: 'orange' }}
      >
        Ja
      </a>
    )
    : 'Nej'
  )

  const getFirstColumnCell = (row: { row: { original: RowData } }) => {
    const { index, dataPoint } = row.row.original

    if (isClimatePlan) {
      return firstColumnClimatePlans(index, dataPoint as string)
    }

    if (isProcurement) {
      return requirementsInProcurement(dataPoint as number)
    }

    return index
  }

  const getThirdColumnCell = (row: { row: { original: RowData } }) => {
    const {
      dataPoint, formattedDataPoint, climatePlanYearAdapted, procurementLink,
    } = row.row.original

    if (isClimatePlan) {
      return dataPoint !== climatePlanMissing
        ? climatePlanYearAdapted
        : climatePlanMissing
    }

    if (isProcurement) {
      return procurementLink !== ''
        ? (
          <a
            href={procurementLink}
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            rel="noreferrer"
          >
            Länk
          </a>
        )
        : 'Saknas'
    }

    return formattedDataPoint
  }

  return [
    {
      header: getFirstColumnHeader(),
      cell: (row) => getFirstColumnCell(row),
      accessorKey: 'index',
    },
    {
      header: 'Kommun',
      cell: (row: { renderValue: () => unknown }) => row.renderValue(),
      accessorKey: 'name',
    },
    {
      header: () => columnHeader,
      cell: (row) => getThirdColumnCell(row),
      accessorKey: 'dataPoint',
    },
  ]
}
