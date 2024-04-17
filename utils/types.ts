import { TFunction } from 'next-i18next'
import { getDataDescriptions } from './datasetDefinitions'

export type Image = {
  ImageUrl: string
  Description: string
}

export type EmissionPerYear = {
  Year: number
  CO2Equivalent: number
}

export type EmissionSector = {
  Name: string
  Year: string
  CO2Equivalent: number
  SubSectors: Array<EmissionSector>
}

export type Emission = {
  EmissionPerYear: Array<EmissionPerYear>
  LargestEmissionSectors: Array<EmissionSector>
  HistoricalEmissionChangePercent: number
  HistoricalEmissionChangeRank: number | null
}

export type ApproximatedEmission = {
  EmissionPerYear: Array<EmissionPerYear>
  TotalCO2Emission: number | null
}

export type Budget = {
  CO2Equivalent: number
  PercentageOfNationalBudget: number
  BudgetPerYear: Array<EmissionPerYear>
}

export type Trend = {
  TrendPerYear: Array<EmissionPerYear>
  TrendCO2Emission: number
}

export type ClimatePlan = {
  Link: string
  YearAdapted: string
  Comment: string
}

export type Municipality = {
  County: string
  Name: string
  CoatOfArmsImage: Image | null
  Population: number | null
  Image: Image | null
  Budget: Budget
  HistoricalEmission: Emission
  PoliticalRule: Array<string> | null
  ApproximatedHistoricalEmission: ApproximatedEmission
  EmissionTrend: Trend
  NeededEmissionChangePercent: number
  HitNetZero: number | string
  BudgetRunsOut: string
  ElectricCars: number
  ElectricCarChangePercent: number,
  ElectricCarChangeYearly: Array<number>,
  ClimatePlan: ClimatePlan,
  BicycleMetrePerCapita: number,
  TotalConsumptionEmission: number,
  ElectricVehiclePerChargePoints: number,
  ProcurementScore: number,
  ProcurementLink: string,
}

// IDEA: Maybe infer keys from the returntype of getDataDescriptions()
// TODO: inferring the returntype gives a vague type, but it would be nice to have exact keys.
// This could be achieved by switching from the swedish keys to system keys in english instead.
// These could be defined in the type rather than in the returned dataset definition.
export type SelectedData = keyof ReturnType<typeof getDataDescriptions>['dataDescriptions']

export type DataDescriptionDataPoints = {
  rawDataPoint: (item: Municipality) => number | string | Date
  formattedDataPoint: (dataPoint: number | string | Date, t: TFunction) => string
  additionalDataPoint?: (item: Municipality) => string
}

export type DataDescription = {
  title: string
  body: string
  source: string
  boundaries: number[] | string[] | Date[]
  labels: string[]
  labelRotateUp: boolean[]
  columnHeader: string
  dataPoints: DataDescriptionDataPoints
  sortAscending?: boolean
  stringsOnTop?: boolean // If true, the strings will be sorted to the top of the table
}

export type DataDescriptions = {
  [key: string]: DataDescription
}

export type CurrentDataPoints = {
  name: string
  primaryDataPoint: number | string | Date
  formattedPrimaryDataPoint: string
  secondaryDataPoint?: string | null
}
