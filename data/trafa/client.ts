
import assert from 'node:assert'
export const TRAFA_BASE_URL = 'https://api.trafa.se/api/data?query='

type TrafaMeasure = 'itrfslut' | 'avstslut' | 'nyregunder' | 'avregunder'
type TrafaFuel =
  | 'el'
  | 'elhybrid'
  | 'laddhybrid'
  | 'biodiesel'
  | 'gas'
  | 'bensin'
  | 'diesel'
  | 'ovriga'
  | 'totalt'
type TrafaDataTarget = 'Personbilar(LÄN)' | 'Personbilar(i Trafik)'

/**
 * Represents the options for a Trafa query.
 */
interface TrafaQueryOpts {
  /**
   * The year to filter by, empty means all years
   */
  year: number[]
  /**
   * The measure to filter by (itrfslut :Antal i trafik, avstslut:Antal avställda, nyregunder:Antal nyregistreringar, avregunder:Antal avregistreringar)
   * @default 'itrfslut'
   *
   */
  measure: TrafaMeasure
  /**
   * The fuel types to filter by, empty means all fuel types
   * @description fuel types cannot be used with TrafaDataTarget[Personbilar - Nyreg+drivmedel]
   */
  fuel: TrafaFuel[]

  /**
   * The target data to filter by
   * @default 'Personbilar - trafik (t10016)'
   */
  target: string
}

/**
 * Represents a Trafa client with various methods for configuring and building a query.
 * @example https://api.trafa.se/api/data?query=t10016|ar:2020|itrfslut|drivm:bensin
 * @url https://www.trafa.se/vagtrafik/fordon/?cw=1
 */
export interface TrafaClient extends TrafaQueryOpts {
  /**
   * Sets the year for the query.
   * @param y - The year to set.
   * @returns The updated TrafaClient instance.
   */
  setYear: (y: string) => TrafaClient

  /**
   * Sets the measure for the query.
   * @param m - The measure to set.
   * @returns The updated TrafaClient instance.
   */
  setMeasure: (m: TrafaMeasure) => TrafaClient

  /**
   * Sets the fuel types for the query.
   * @param f - The fuel types to set.
   * @returns The updated TrafaClient instance.
   */
  setFuel: (f: TrafaFuel[]) => TrafaClient

  /**
   * Sets the target data for the query.
   * @param p - The target data to set.
   * @returns The updated TrafaClient instance.
   */
  setTarget: (p: TrafaDataTarget) => TrafaClient

  /**
   * Builds the query and returns it as a string.
   * @returns The built query as a string.
   */
  build: () => string
}

const targets : {
    label: TrafaDataTarget,
    value: number
}[] =   [
  {
    label: 'Personbilar(LÄN)',
    value: 26,
  },
  {
    label: 'Personbilar(i Trafik)',
    value: 16,
  },
]
export class TrafaClientImpl implements TrafaClient {
  fuel: TrafaFuel[] = []
  year: number[] = []
  measure: TrafaMeasure = 'itrfslut'
  target: string = 't10016'
    constructor() {
    this.setYear("")
    this.setMeasure('itrfslut')
    this.setFuel([])
    this.setTarget('Personbilar(i Trafik)')
    }
  setYear(y: string) {
    const years = validYears(y)
    this.year = years
    return this
  }

  setMeasure(m: TrafaMeasure) {
    this.measure = m
    return this
  }

  setFuel(f: TrafaFuel[]) {
    this.fuel = f
    return this
  }

  setTarget(p: TrafaDataTarget) {
    const target = targets.find((o) => o.label === p)?.value
    this.target = `t100${target}`
    return this
  }

  build() {
    assert(
      this.target !== 't10026' || this.fuel.length === 0,
      'fuel types cannot be used with chosen target',
    )
    let query = ''
    query += `${this.target}|`
    if (this.year.length > 0) {
      query += `ar:${this.year[0]}|`
    } else {
      query += `ar|`
    }
    query += `${this.measure}`
    if (this.fuel.length > 0) {
      query += `|drivm:${this.fuel.join(',')}`
    }
    return TRAFA_BASE_URL + query
  }
}


/**
 * Validates a comma-separated string of years.
 *  Checks if all the years in the array are valid.
 *  A valid year is defined as a year that is greater than or equal to 2000
 * and less than or equal to the current year.
 * @param commaSeparatedYearString - The string containing comma-separated years.
 * @returns An array of valid years.
 */
export const validYears = (commaSeperatedYearString: string) => {
  const years = commaSeperatedYearString.split(',').map((y) => parseInt(y))
  const isValidYear = years.filter(
    (y) =>y >= 2000 && y <= new Date().getFullYear(),
  )
  return isValidYear ? isValidYear : []
}
