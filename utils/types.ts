import { dataDescriptions } from './datasetDefinitions'

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
  EmissionsPerYear: Array<EmissionPerYear>
}

export type Emission = {
  EmissionPerYear: Array<EmissionPerYear>
  SectorEmissionsPerYear: Array<EmissionSector>
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

export type SelectedData = keyof typeof dataDescriptions

export type DataDescriptionDataPoints = {
  rawDataPoint: (item: Municipality) => number | string | Date
  formattedDataPoint: (dataPoint: number | string | Date) => string
  additionalDataPoint?: (item: Municipality) => string
}

export type DataDescription = {
  title: string
  body: string | JSX.Element
  source: React.ReactNode
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
