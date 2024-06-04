import { CellContext, ColumnDef, Row } from '@tanstack/react-table'
import { TFunction } from 'next-i18next'

import { Municipality, DatasetKey } from './types'
import {
  dataOnDisplay, climatePlanMissing, requirementsInProcurement,
  getDataDescriptions,
} from './datasetDefinitions'
import { colorTheme } from '../Theme'

type RowData = {
  name: string
  dataPoint: string | number | Date
  formattedDataPoint: string
  index: number
  climatePlanYearAdapted?: string
  procurementLink?: string
}

const getCustomSortFn = ({
  stringsOnTop = false, sortAscending = false,
}: {
  stringsOnTop?: boolean, sortAscending?: boolean} = {}) => (a: RowData['dataPoint'], b: RowData['dataPoint']) => {
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
  // @ts-expect-error treat Date objects as numbers since they can be compared like numbers.
  return sortAscending ? a - b : b - a
}

const sortClimatePlans = (aVal: string, bVal: string) => {
  const a = aVal === climatePlanMissing ? aVal : Number(aVal)
  const b = bVal === climatePlanMissing ? bVal : Number(bVal)

  // If both A and B are missing climate plans, then return 0
  if (a === climatePlanMissing && b === climatePlanMissing) {
    return 0
  }

  // If A is missing a climate plan, but B has one, then A should be after B, and we should return 1
  if (a === climatePlanMissing && !Number.isNaN(b)) {
    return 1
  }

  // If A has a climate plan, but B is missing one, then A should be before B, and we should return -1
  if (!Number.isNaN(a) && b === climatePlanMissing) {
    return -1
  }

  // If both A and B have climate plans, then we should compare the years when they were adopted
  return (b as number) - (a as number)
}

const climatePlansSortingFn = (rowA: Row<RowData>, rowB: Row<RowData>) => (
  sortClimatePlans(rowA.original.climatePlanYearAdapted!, rowB.original.climatePlanYearAdapted!)
)

export const calculateClimatePlanRankings = (data: Omit<RowData, 'index'>[]) => (
  data
    .map((item, i) => ({ ...item, index: i + 1 }))
    .sort((rowA, rowB) => sortClimatePlans(rowA.climatePlanYearAdapted!, rowB.climatePlanYearAdapted!))
)

export const calculateRankings = (
  data: Array<{ name: string; dataPoint: number; formattedDataPoint: string }>,
  sortAscending: boolean,
  stringsOnTop: boolean,
) => {
  const customSort = getCustomSortFn({ sortAscending, stringsOnTop })

  const sortedData = data.sort((a, b) => customSort(a.dataPoint, b.dataPoint))
  return sortedData.map((item, index) => ({
    ...item,
    index: index + 1,
  }))
}

export const rankData = (municipalities: Municipality[], selectedData: DatasetKey, locale: string, t: TFunction) => {
  const { dataDescriptions } = getDataDescriptions(locale as string, t)
  const datasets = dataOnDisplay(municipalities, selectedData, locale, t)

  type RankedData = {
    [key in DatasetKey]: Array<RowData>
  }

  const newRankedData: RankedData = {} as RankedData

  const sortAscending = dataDescriptions[selectedData]?.sortAscending || false
  const edgeCaseOnTop = dataDescriptions[selectedData]?.stringsOnTop || false

  if (selectedData === 'klimatplanerna') {
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

export const municipalityColumns = (
  selectedData: DatasetKey,
  columnHeader: string,
  t: TFunction,
): ColumnDef<RowData>[] => {
  const isClimatePlan = selectedData === 'klimatplanerna'
  const isProcurement = selectedData === 'upphandlingarna'

  const getFirstColumnHeader = () => {
    if (isClimatePlan) return t('startPage:regionalView.hasPlan')
    if (isProcurement) return t('startPage:regionalView.procurementDemands')
    return t('startPage:regionalView.ranking')
  }

  const firstColumnClimatePlans = (dataPoint: string) => (dataPoint === climatePlanMissing
    ? t('common:no')
    : (
      <a
        href={dataPoint.toString()}
        onClick={(e) => e.stopPropagation()}
        target="_blank"
        rel="noreferrer"
        style={{ color: colorTheme.newColors.orange3 }}
      >
        {t('common:yes')}
      </a>
    )
  )

  const getFirstColumnCell = (props: CellContext<RowData, unknown>) => {
    const { index, dataPoint } = props.row.original

    if (isClimatePlan) {
      return firstColumnClimatePlans(dataPoint as string)
    }

    if (isProcurement) {
      return requirementsInProcurement(dataPoint as number, t)
    }

    return index
  }

  const getThirdColumnCell = (props: CellContext<RowData, unknown>) => {
    const {
      dataPoint, formattedDataPoint, climatePlanYearAdapted, procurementLink,
    } = props.row.original

    if (isClimatePlan) {
      // NOTE: We might want to show missing climate plans with a gray text here, and use the orange text to only highight climatePlanYearAdapted
      return dataPoint !== climatePlanMissing
        ? climatePlanYearAdapted
        : climatePlanMissing
    }

    if (isProcurement) {
      return procurementLink?.length
        ? (
          <a
            href={procurementLink}
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            rel="noreferrer"
          >
            {t('common:link')}
          </a>
        )
        : t('common:missing')
    }

    return formattedDataPoint
  }

  const getFirstColumnSortingFn = (datasetKey: DatasetKey) => {
    if (datasetKey === 'klimatplanerna') {
      return (rowA: Row<RowData>, rowB: Row<RowData>) => {
        const aHasPlan = rowA.original.dataPoint !== climatePlanMissing
        const bHasPlan = rowB.original.dataPoint !== climatePlanMissing

        if (aHasPlan && !bHasPlan) {
          return -1
        }

        if (!aHasPlan && bHasPlan) {
          return 1
        }

        // If both either have plans or don't have plans, we don't need to re-order them.
        return 0
      }
    }

    // By default, use the standard @tanstack/table sorting functions.
    return undefined
  }

  // TODO: Move these custom sorting functions to the dataset definitions instead and keep all config together
  const getThirdColumnSortingFn = (datasetKey: DatasetKey) => {
    if (datasetKey === 'klimatplanerna') {
      return climatePlansSortingFn
    }

    let customSort: ReturnType<typeof getCustomSortFn> | undefined
    // TODO: Get the params passed to getCustomSortFn() from config, rather than duplicating and hard coding sortAscending and stringsOnTop

    if (datasetKey === 'koldioxidbudgetarna') {
      customSort = getCustomSortFn({ stringsOnTop: true })
    } else if (datasetKey === 'laddarna') {
      customSort = getCustomSortFn({ sortAscending: true })
    }

    if (customSort) {
      return (rowA: Row<RowData>, rowB: Row<RowData>) => customSort!(rowA.original.dataPoint, rowB.original.dataPoint)
    }

    // By default, use the standard @tanstack/table sorting functions.
    return undefined
  }

  const firstColumnSortingFn = getFirstColumnSortingFn(selectedData)
  const thirdColumnSortingFn = getThirdColumnSortingFn(selectedData)

  return [
    {
      header: getFirstColumnHeader(),
      cell: getFirstColumnCell,
      accessorKey: 'index',

      // NOTE: we can't pass an explicit prop sortingFn with the value undefined, since this crashes @tanstack/table when sorting the column
      // This is due to a bug either in their implementation or in their TS definitions.
      // The workaround is to only add the property when we actually need it.
      ...(firstColumnSortingFn ? { sortingFn: firstColumnSortingFn } : {}),
    },
    {
      header: t('common:municipality'),
      cell: (row) => row.renderValue(),
      accessorKey: 'name',
    },
    {
      header: () => columnHeader,
      cell: getThirdColumnCell,
      accessorKey: 'dataPoint',
      // NOTE: if we need to sort other columns than the third, this would be better to keep in the dataset definitions.
      // But for now, this is a quick and dirty hack

      // NOTE: we can't pass an explicit prop sortingFn with the value undefined, since this crashes @tanstack/table when sorting the column
      // This is due to a bug either in their implementation or in their TS definitions.
      // The workaround is to only add the property when we actually need it.
      ...(thirdColumnSortingFn ? { sortingFn: thirdColumnSortingFn } : {}),
    },
  ]
}
