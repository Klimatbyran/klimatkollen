import { datasetDescriptions } from './datasetDescriptions'

export type Image = {
  ImageUrl: string
  Description: string
}

// Companies

export type CompanyScope = {
  Emissions: string
  Unit: string
  BaseYear: string
  [key: string]: unknown
}

export type CompanyEmissionsPerYear = {
  Scope1: CompanyScope
  Scope2: CompanyScope
  Scope3: CompanyScope
  TotalEmissions: number
  TotalUnit: string
  TotalEmissionRank: number
}

export type Company = {
  Name: string
  Industry: string
  BaseYear: string
  Url: string
  Emissions: CompanyEmissionsPerYear
}

// Municipalities

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

export type Budget = {
  CO2Equivalent: number
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
}

export type SelectedData = keyof typeof datasetDescriptions

export type DatasetDescription = {
  title: string
  body: string | JSX.Element
  source: React.ReactNode
  boundaries: number[] | string[]
  labels: string[]
  labelRotateUp: boolean[]
  columnHeader: string
  sortAscending?: boolean
  calculateDataPoint?: (item: Municipality) => number | string
  formatDataPoint?: (dataPoint: number | string) => string
}

export type DatasetDescriptions = {
  [key: string]: DatasetDescription
}

export type RankedData = {
  [key: string]: {
    name: string;
    dataPoint: number | string | JSX.Element;
    rank?: number | undefined;
  }[]
}
