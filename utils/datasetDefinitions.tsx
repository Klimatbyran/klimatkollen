/* eslint-disable max-len */
/* eslint-disable no-shadow */
import { TFunction } from 'next-i18next'
import { TOptions } from 'i18next'

import { DataDescriptions, DatasetKey, Municipality } from './types'
import { normalizeString } from './shared'

export const defaultDataView = 'karta'
export const secondaryDataView = 'lista'

export const validDatasets = ['utslappen', 'koldioxidbudgetarna', 'klimatplanerna', 'konsumtionen', 'elbilarna', 'laddarna', 'cyklarna', 'upphandlingarna'] as const
export const defaultDataset: DatasetKey = 'utslappen'

// NOTE: Hardcoded constant expected in the data
export const climatePlanMissing = 'Saknar plan'

const yearsAhead = (years: number) => {
  const currentDate = new Date()
  const yearsInFuture = currentDate.getFullYear() + years
  currentDate.setFullYear(yearsInFuture)
  return currentDate
}

const formatDateToString = (date: Date) => date.toISOString().slice(0, 10)

export const requirementsInProcurement = (score: number, t: TFunction): string => {
  if (score > 1) return t('common:yes')
  if (score > 0) return t('common:maybe')
  return t('common:no')
}

function getTranslatedDataDescriptions(locale: string, _t: TFunction): DataDescriptions {
  /** Get translations for a specific locale. This is used to avoid passing the locale option for all calls below */
  const t = (key: string | string[], options: TOptions = {}) => _t(key, { ...options, lng: locale })
  return {
    utslappen: {
      title: t('common:datasets.municipalityEmissions.title'),
      body: t('common:datasets.municipalityEmissions.body'),
      source: t('common:datasets.municipalityEmissions.source'),
      boundaries: [0.0, -0.01, -0.02, -0.03, -0.1],
      labels: t('common:datasets.municipalityEmissions.labels', { returnObjects: true }) as unknown as string[],
      labelRotateUp: [true, false, false, false, false, false],
      columnHeader: t('common:datasets.municipalityEmissions.columnHeader'),
      dataPoints: {
        rawDataPoint: (item) => item.HistoricalEmission.HistoricalEmissionChangePercent / 100,
        formattedDataPoint: (dataPoint) => ((dataPoint as number) * 100).toFixed(1),
      },
      sortAscending: true,
      name: t('common:datasets.municipalityEmissions.name'),
    },

    koldioxidbudgetarna: {
      title: t('common:datasets.budgets.title'),
      body: t('common:datasets.budgets.body'),
      source: t('common:datasets.budgets.source'),
      boundaries: [
        yearsAhead(2),
        yearsAhead(3),
        yearsAhead(4),
        yearsAhead(5),
        new Date(2050, 1, 1),
      ],
      labels: t('common:datasets.budgets.labels', { returnObjects: true }) as unknown as string[],
      labelRotateUp: [],
      columnHeader: t('common:datasets.budgets.columnHeader'),
      dataPoints: {
        rawDataPoint: (item) => new Date(item.BudgetRunsOut),
        formattedDataPoint: (dataPoint, t) => (dataPoint < new Date(2050, 1, 1)
          ? formatDateToString(dataPoint as Date)
          : t('common:datasets.budgets.followingBudget')),
      },
      sortAscending: false,
      stringsOnTop: true,
      name: t('common:datasets.budgets.name'),
    },

    klimatplanerna: {
      title: t('common:datasets.plans.title'),
      body: t('common:datasets.plans.body'),
      source: t('common:datasets.plans.source'),
      boundaries: [climatePlanMissing, ''],
      labels: [t('common:no'), t('common:yes')],
      labelRotateUp: [],
      columnHeader: t('common:datasets.plans.columnHeader'),
      dataPoints: {
        rawDataPoint: (item) => item.ClimatePlan.Link,
        formattedDataPoint: (dataPoint, t) => (dataPoint === climatePlanMissing ? t('common:no') : t('common:yes')),
        additionalDataPoint: (item) => item.ClimatePlan.YearAdapted,
      },
      name: t('common:datasets.plans.name'),
    },

    konsumtionen: {
      title: t('common:datasets.consumption.title'),
      body: t('common:datasets.consumption.body'),
      source: t('common:datasets.consumption.source'),
      boundaries: [7, 6.7, 6.4, 6.1, 5.8],
      labels:
      t('common:datasets.consumption.labels', { returnObjects: true }) as unknown as string[],
      labelRotateUp: [],
      columnHeader: t('common:datasets.consumption.columnHeader'),
      dataPoints: {
        rawDataPoint: (item) => item.TotalConsumptionEmission,
        formattedDataPoint: (dataPoint) => (dataPoint as number).toFixed(1),
      },
      sortAscending: true,
      name: t('common:datasets.consumption.name'),
    },

    elbilarna: {
      title: t('common:datasets.electricCars.title'),
      body: t('common:datasets.electricCars.body'),
      source: t('common:datasets.electricCars.source'),
      boundaries: [0.04, 0.05, 0.06, 0.07, 0.08],
      labels: t('common:datasets.electricCars.labels', { returnObjects: true }) as unknown as string[],
      labelRotateUp: [true, true, true, true, true, true],
      columnHeader: t('common:datasets.electricCars.columnHeader'),
      dataPoints: {
        rawDataPoint: (item) => item.ElectricCarChangePercent,
        formattedDataPoint: (dataPoint) => ((dataPoint as number) * 100).toFixed(1),
      },
      sortAscending: false,
      name: t('common:datasets.electricCars.name'),
    },

    laddarna: {
      title: t('common:datasets.chargers.title'),
      body: t('common:datasets.chargers.body'),
      source: t('common:datasets.chargers.source'),
      boundaries: [1e6, 40, 30, 20, 10],
      labels: t('common:datasets.chargers.labels', { returnObjects: true }) as unknown as string[],
      labelRotateUp: [],
      columnHeader: t('common:datasets.chargers.columnHeader'),
      dataPoints: {
        rawDataPoint: (item) => item.ElectricVehiclePerChargePoints,
        formattedDataPoint: (dataPoint, t) => ((dataPoint as number) < 1e5 ? (dataPoint as number).toFixed(1) : t('common:datasets.chargers.missing')),
      },
      sortAscending: true,
      name: t('common:datasets.chargers.name'),
    },

    cyklarna: {
      title: t('common:datasets.bikes.title'),
      body: t('common:datasets.bikes.body'),
      // IDEA: Link directly to the SCB dataset for population statistics that we use.
      source: t('common:datasets.bikes.source'),
      boundaries: [1, 2, 3, 4, 5],
      labels: t('common:datasets.bikes.labels', { returnObjects: true }) as unknown as string[],
      labelRotateUp: [],
      columnHeader: t('common:datasets.bikes.columnHeader'),
      dataPoints: {
        rawDataPoint: (item) => item.BicycleMetrePerCapita,
        formattedDataPoint: (dataPoint) => (dataPoint as number).toFixed(1),
      },
      sortAscending: false,
      name: t('common:datasets.bikes.name'),
    },

    upphandlingarna: {
      title: t('common:datasets.procurements.title'),
      body: t('common:datasets.procurements.body'),
      // IDEA: Get the data directly from the file NUE2022_DATA_2023-12-20.xlsx
      source: t('common:datasets.procurements.source'),
      boundaries: [0, 1, 2],
      labels: [t('common:no'), t('common:maybe'), t('common:yes')],
      labelRotateUp: [],
      columnHeader: t('common:datasets.procurements.columnHeader'),
      dataPoints: {
        rawDataPoint: (item) => item.ProcurementScore,
        formattedDataPoint: (dataPoint, t) => requirementsInProcurement(dataPoint as number, t),
      },
      sortAscending: false,
      name: t('common:datasets.procurements.name'),
    },
  }
}

const cachedDataDescriptions = new Map<string, DataDescriptions>()

export function getDataDescriptions(locale: string, t: TFunction) {
  if (!cachedDataDescriptions.has(locale)) {
    cachedDataDescriptions.set(locale, getTranslatedDataDescriptions(locale, t))
  }

  const dataDescriptions = cachedDataDescriptions.get(locale)!
  const validDatasets = new Set(Object.keys(dataDescriptions))

  function isValidDataset(dataset: string): dataset is DatasetKey {
    return validDatasets.has(normalizeString(dataset))
  }

  return { dataDescriptions, isValidDataset, validDatasets }
}

export const dataOnDisplay = (
  municipalities: Array<Municipality>,
  selectedData: DatasetKey,
  locale: string,
  t: TFunction,
) => municipalities.map((item) => {
  const { dataDescriptions } = getDataDescriptions(locale, t)
  const { dataPoints } = dataDescriptions[selectedData]

  const dataPoint = dataPoints.rawDataPoint ? dataPoints.rawDataPoint(item) : t('common:dataMissing')
  const formattedDataPoint = dataPoint != null && dataPoints.formattedDataPoint
    ? dataPoints.formattedDataPoint(dataPoint, t)
    : t('common:dataMissing')
  const secondaryDataPoint = dataPoints.additionalDataPoint ? dataPoints.additionalDataPoint(item) : undefined

  return {
    name: item.Name,
    primaryDataPoint: dataPoint,
    formattedPrimaryDataPoint: formattedDataPoint,
    secondaryDataPoint,
    climatePlanYearAdapted: item.ClimatePlan.YearAdapted,
    procurementLink: item.ProcurementLink,
  }
})
