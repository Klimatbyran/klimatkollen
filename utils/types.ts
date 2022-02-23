
export type Image = {
  ImageUrl: string
  Description: string
}

export type Municipality = {
  County: string
  Name: string
  CoatOfArmsImage?: Image
  Population?: number
  Image?: Image
  Budget: Budget
  Emissions: Emissions
}

export type Emission = {
  Year: string
  CO2Equivalent: number
}

export type Emissions = {
  EmissionPerYear: Array<Emission>
  LargestEmissionSectors: Array<EmissionSector>
  EmissionLevelChangeAverage: number
  AverageEmissionChangeRank?: number
}

export type Budget = {
  TotalCO2Equivalent: number,
  TotalPercentage: number
}

export type EmissionSector = {
  Name: string
  Year: string
  CO2Equivalent: number
  SubSectors: Array<EmissionSector>
}