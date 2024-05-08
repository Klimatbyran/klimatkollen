import { ColumnDef } from '@tanstack/react-table'
import { TFunction } from 'next-i18next'

import { Municipality, DatasetKey } from './types'
import {
  dataOnDisplay, climatePlanMissing, requirementsInProcurement,
  getDataDescriptions,
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
    if (isClimatePlan) return t('startPage:hasPlan')
    if (isProcurement) return t('startPage:procurementDemands')
    return t('startPage:ranking')
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
        {t('common:yes')}
      </a>
    )
    : t('common:no')
  )

  const getFirstColumnCell = (row: { row: { original: RowData } }) => {
    const { index, dataPoint } = row.row.original

    if (isClimatePlan) {
      return firstColumnClimatePlans(index, dataPoint as string)
    }

    if (isProcurement) {
      return requirementsInProcurement(dataPoint as number, t)
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

  return [
    {
      header: getFirstColumnHeader(),
      cell: (row) => getFirstColumnCell(row),
      accessorKey: 'index',
    },
    {
      header: t('common:municipality'),
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
