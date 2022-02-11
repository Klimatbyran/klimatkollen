
export type Image = {
  ImageUrl: string
  Description: string
}

export type Municipality = {
  County: string
  Name: string
  Emissions: Array<Emission>
  LargestEmissionSectors: Array<EmissionSector>
  CoatOfArmsImage?: Image
  Population?: number
  Image?: Image
  EmissionLevelChangeAverage: number
  AverageEmissionChangeRank?: number
}

export type Emission = {
  Year: string
  CO2equivalent: number
}

export type EmissionSector = {
  Name: string
  Year: string
  CO2equivalent: number
  SubSectors: Array<EmissionSector>
}