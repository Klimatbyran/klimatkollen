
export type Image = {
  ImageUrl: string
  Description: string
}

export type Municipality = {
  County: string
  Name: string
  Emissions: Array<Emission>
  CoatOfArmsImage?: Image
  Population?: number
  Image?: Image
}

export type Emission = {
  Year: string
  CO2equivalent: number
}
