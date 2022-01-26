export type MunicipalityData = {
  Huvudsektor: string
  Undersektor: string
  Län: string
  Kommun: string
  1990: number
  2000: number
  2005: number
  2010: number
  2011: number
  2012: number
  2013: number
  2014: number
  2015: number
  2016: number
  2017: number
  2018: number
  2019: number
}

export type Municipality = {
  County: string
  Name: string
  Emissions: Array<Emission>
}

export type Emission = {
  Year: string
  CO2equivalent: number
}
