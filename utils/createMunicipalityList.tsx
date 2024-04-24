import { CellContext, ColumnDef, Row } from '@tanstack/react-table'
import { TFunction } from 'next-i18next'

import { Municipality, DatasetKey } from './types'
import {
  dataOnDisplay, climatePlanMissing, requirementsInProcurement,
  getDataDescriptions,
} from './datasetDefinitions'

type RowData = {
  name: string
  dataPoint: string | number | Date
  formattedDataPoint: string
  index: number
  climatePlanYearAdapted?: string
  procurementLink?: string
  secondaryDataPoint?: string
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

const sortClimatePlans = (a: number | typeof climatePlanMissing, b: number | typeof climatePlanMissing) => {
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

  // If both A and B have climate plans, then we should return A-B and compare the years when they were adopted
  return (b as number) - (a as number)
}

const climatePlansSortingFn = (rowA: Row<RowData>, rowB: Row<RowData>) => {
  const aVal = rowA.original.secondaryDataPoint!
  const bVal = rowB.original.secondaryDataPoint!

  const a = aVal === climatePlanMissing ? aVal : Number(aVal)
  const b = bVal === climatePlanMissing ? bVal : Number(bVal)

  return sortClimatePlans(a, b)
}

export const calculateClimatePlanRankings = (
  data: Omit<RowData, 'index'>[],
) => data.map((item, i) => ({ ...item, index: i + 1 })).sort((rowA, rowB) => {
  const aVal = rowA.secondaryDataPoint!
  const bVal = rowB.secondaryDataPoint!

  const a = aVal === climatePlanMissing ? aVal : Number(aVal)
  const b = bVal === climatePlanMissing ? bVal : Number(bVal)

  // NOTE: Sorting seems to work, just need cleanup refactor now

  return sortClimatePlans(a, b)
})

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

// TODO: for dataset koldioxidbudgetarna Maybe update title: "Budget slut om" since it is unclear for the table header
// TODO: for dataset klimatplanerna, the first column "har plan" does not give correct sorting results. We need a custom sort there.
// TODO: for all datasets that customize the first column to use string data, we need to add a custom sorting function.
// TODO: for dataset upphandlingarna, when "underlag" column has value "saknas", maybe show it gray color instead of orange since it is missing.

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
        secondaryDataPoint: item.secondaryDataPoint,
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
  selectedData: DatasetKey,
  columnHeader: string,
  t: TFunction,
): ColumnDef<RowData>[] => {
  const isClimatePlan = selectedData === 'klimatplanerna'
  const isProcurement = selectedData === 'upphandlingarna'

  const getFirstColumnHeader = () => {
    if (isClimatePlan) return t('startPage:hasPlan')
    if (isProcurement) return t('startPage:procurementDemands')
    return t('startPage:ranking')
  }

  const firstColumnClimatePlans = (dataPoint: string) => (dataPoint === climatePlanMissing
    ? t('common:no')
    : (
      <a
        href={dataPoint.toString()}
        onClick={(e) => e.stopPropagation()}
        target="_blank"
        rel="noreferrer"
        style={{ color: 'orange' }}
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
      // NOTE: We might want to show missing climate plans with a gray text here, and save the orange text only to highight climatePlanYearAdapted
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

  // TODO: Move this config on to the dataset definitions instead
  const getSortingFn = (datasetKey: DatasetKey) => {
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
      return (rowA: Row<RowData>, rowB: Row<RowData>) => customSort(rowA.original.dataPoint, rowB.original.dataPoint)
    }

    // By default, use the standard @tanstack/table sorting functions.
    return undefined
  }

  const thirdColumnSortingFn = getSortingFn(selectedData)

  return [
    {
      header: getFirstColumnHeader(),
      cell: getFirstColumnCell,
      accessorKey: 'index',
    },
    {
      header: t('common:municipality'),
      cell: (row: { renderValue: () => unknown }) => row.renderValue(),
      accessorKey: 'name',
    },
    {
      header: () => columnHeader,
      cell: getThirdColumnCell,
      // TODO: Why can't we sort the final column for climate plans? Maybe because we try to sort on the wrong property?
      // accessorKey: selectedData === 'klimatplanerna' ? 'climatePlanYearAdapted' : 'dataPoint',
      // accessorKey: selectedData === 'klimatplanerna' ? 'secondaryDataPoint' : 'dataPoint',
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
