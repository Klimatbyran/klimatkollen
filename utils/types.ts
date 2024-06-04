import { ReactNode } from 'react'
import { TFunction } from 'next-i18next'

import { validDatasets } from './datasetDefinitions'

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
  Scope1n2: CompanyScope
  Scope3: CompanyScope
}

export type Company = {
  Name: string
  Url: string
  Comment: string
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

export type ApproximatedEmission = {
  EmissionPerYear: Array<EmissionPerYear>
  TotalCO2Emission: number | null
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

export type DataDescriptionDataPoints = {
  rawDataPoint: (item: Municipality) => number | string | Date
  formattedDataPoint: (dataPoint: number | string | Date, t: TFunction) => string
  additionalDataPoint?: (item: Municipality) => string
}

export type DataDescription = {
  /** Short name for the dataset */
  name: string

  /** Longer title */
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

export type DatasetKey = typeof validDatasets[number]
export type DataDescriptions = Record<DatasetKey, DataDescription>

export type CurrentDataPoints = {
  name: string
  primaryDataPoint: number | string | Date
  formattedPrimaryDataPoint: string
  secondaryDataPoint?: string | null
}

export type MapProps = {
  data: Array<CurrentDataPoints>
  boundaries: number[] | string[] | Date[]
  children?: ReactNode
}

export type MunicipalityData = {
  name: string
  dataPoint: number
  formattedDataPoint: number
  geometry: [number, number][]
}

export type MunicipalityTapInfo = {
  x: number
  y: number
  mData: MunicipalityData
}

// TODO: Think about if/how we could unify the company data types.
// Perhaps it makes sense to clearly separate guessed from manually verified data as long as we are using both sources.
export type Contact = {
  name: string;
  role: string;
  email: string;
  phone: string;
}

export type Scope1 = {
  emissions: number | null;
  unit: string;
}

export type Scope2 = {
  emissions: number | null;
  unit: string;
  mb: number | null;
  lb: number | null;
}

export type Scope3 = {
  emissions: number;
  unit: string;
  categories: { [key: string]: number | null };
}

export type GuessedEmission = {
  year: string;
  scope1: Scope1;
  scope2: Scope2;
  scope3: Scope3;
  totalEmissions: null;
  totalUnit: string;
}

export type Factor = {
  product: string;
  description: string;
  value: number;
  unit: string;
}

export type Goal = {
  description: string;
  year: number;
  reductionPercent: number | null;
  baseYear: string;
}

export type Group = {
  code: string;
  name: string;
}

export type IndustryGics = {
  name: string;
  sector: Group;
  group: Group;
  industry: Group;
  subIndustry: Group;
}

export type IndustryNace = {
  section: Group;
  division: Group;
}

export type Initiative = {
  description: string;
  year: number;
  reductionPercent: number | null;
  scope: string;
  comment: string;
}

export type Turnover = {
  year: string;
  value: number | null;
  unit: string;
}

export type GuessedCompany = {
  companyName: string;
  industryGics: IndustryGics;
  industryNace: IndustryNace;
  baseYear: string;
  url: string;
  emissions: GuessedEmission[];
  turnover: Turnover[];
  factors: Factor[];
  contacts: Contact[];
  goals: Goal[];
  initiatives: Initiative[];
  reliability: string;
  needsReview: boolean;
  reviewComment: string;
}
