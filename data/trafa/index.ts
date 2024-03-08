import axios from 'axios'
import assert from 'node:assert'

const TrafaVehicles = {
  code: 'Fordon',
  description: 'Fordon',
  options: [
    { value: 11, label: 'Bussar' },
    { value: 15, label: 'Motorcyklar' },
    { value: 15, label: 'Mopeder klass I' },
    { value: 17, label: 'Släpvagnar' },
    { value: 18, label: 'Traktorer' },
    { value: 19, label: 'Terrängskotrar' },
    { value: 16, label: 'Personbilar' },
    { value: 95, label: 'Lastbilar' },
  ],
} as const

const TrafaVehicleCategory = {
  code: 'FordKat',
  description: 'Fordonskategori',
  options: [
    { value: 'T1', label: 'Totalt' },
    { value: 12, label: 'Taxi' },
    { value: 13, label: 'Leasade bilar' },
  ],
} as const

const TrafaServiceWeight = {
  code: 'TjVikt',
  description: 'Fordonets tjänstevikt',
  options: [
    { value: 'T1', label: 'Totalt' },
    { value: 101, label: '– 900 kg' },
    { value: 102, label: '901–1 000 kg' },
    { value: 103, label: '1 001–1 100 kg' },
    { value: 104, label: '1 101–1 200 kg' },
    { value: 105, label: '1 201–1 300 kg' },
    { value: 106, label: '1 301–1 400 kg' },
    { value: 107, label: '1 401–1 500 kg' },
    { value: 108, label: '1 501–1 600 kg' },
    { value: 109, label: '1 601–1 700 kg' },
    { value: 110, label: '1 701–2 000 kg' },
    { value: 111, label: '2 001–2 500 kg' },
    { value: 112, label: '2 501–3 000 kg' },
    { value: 113, label: '3 001– kg' },
    { value: 199, label: 'Okänd' },
  ],
} as const

const TrafaCounty = {
  code: 'RegLan',
  description: 'Registreringslän',
  options: [
    { value: 'T1', label: 'Totalt' },
    { value: 1, label: 'Stockholm län' },
    { value: 3, label: 'Upsala län' },
    { value: 4, label: 'Södermanlands län' },
    { value: 5, label: 'Östergötlands län' },
    { value: 6, label: 'Jönköpings län' },
    { value: 7, label: 'Kronobergs län' },
    { value: 8, label: 'Kalmar län' },
    { value: 9, label: 'Gotlands län' },
    { value: 10, label: 'Blekinge län' },
    { value: 12, label: 'Skåne län' },
    { value: 13, label: 'Hallands län' },
    { value: 14, label: 'Västra Götalands län' },
    { value: 17, label: 'Värmlands län' },
    { value: 18, label: 'Örebro län' },
    { value: 19, label: 'Västmanlands län' },
    { value: 20, label: 'Dalarnas län' },
    { value: 21, label: 'Gävleborgs län' },
    { value: 22, label: 'Västernorrlands län' },
    { value: 23, label: 'Jämtlands län' },
    { value: 24, label: 'Västerbottens län' },
    { value: 25, label: 'Norrbottens län' },
    { value: 'AA', label: 'Okänt län' },
  ],
} as const

const TrafaCompanyType = {
  code: 'FTGTyp',
  description: 'Företagstyp',
  options: [
    { value: 'T1', label: 'Totalt' },
    { value: 1, label: 'Enskild näringsidkare' },
  ],
} as const

const TrafaVehicleType = {
  code: 'Fslag',
  description: 'Fordonslag',
  options: [
    { value: 'T1', label: 'Totalt' },
    { value: 81, label: 'Terrängskoter, okänd klass' },
    { value: 82, label: 'Snöskoter' },
    { value: 83, label: 'Terränghjuling' },
  ],
} as const

const TrafaMeasurements = {
  label: 'Mätvärde',
  description: 'Mätvärde',
  option: [
    { value: 'itrfslut', label: 'Antal i trafik' }, // avser i slutet av perioden
    { value: 'avstslut', label: 'Antal avställda' }, // avser i slutet av perioden
    { value: 'nyregunder', label: 'Antal nyregistreringar' }, // avser under perioden
    { value: 'avregunder', label: 'Antal avregistreringar' }, // avser under perioden
  ],
} as const

const TrafaOwnerCategory = {
  code: 'AgarKat',
  description: 'Ägarkategori',
  options: [
    { value: 10, label: 'Fysisk person' },
    { value: 20, label: 'Juridisk person' },
    { value: 'T1', label: 'Totalt' },
  ],
} as const

const TrafaPassengerCategory = {
  code: 'Pass',
  description: 'Passagerarkategori',
  options: [
    { value: 'T1', label: 'Totalt' },
    { value: 101, label: '– 20' },
    { value: 102, label: '21 – 40' },
    { value: 103, label: '41 – 50' },
    { value: 104, label: '51 – 60' },
    { value: 105, label: '61 – 70' },
    { value: 106, label: '71 – 80' },
    { value: 107, label: '81 – 90' },
    { value: 108, label: '91 – 100' },
    { value: 109, label: '101 – 120' },
    { value: 110, label: '121+' },
    { value: 199, label: 'Okänd' },
  ],
} as const

const TrafaFuelCategory = {
  code: 'Drivm',
  description: 'Drivmedelskategori',
  options: [
    { value: 't1', label: 'totalt' },
    { value: 101, label: 'bensin' },
    { value: 102, label: 'diesel' },
    { value: 103, label: 'el' },
    { value: 104, label: 'elhybrid' },
    { value: 105, label: 'laddhybrid' },
    { value: 106, label: 'etanol' },
    { value: 107, label: 'gas' },
    { value: 108, label: 'biodiesel' },
    { value: 109, label: 'övriga' },
  ],
} as const

const TrafaBusCategory = {
  code: 'Bussklass',
  description: 'Bussklasser enligt föreskrift nr 107 UNECE',
  options: [
    { value: 'T1', label: 'Totalt' },
    { value: 1, label: 'A' },
    { value: 2, label: 'B' },
    { value: 3, label: 'I' },
    { value: 4, label: 'II' },
    { value: 5, label: 'III' },
    { value: 9, label: 'Okänd' },
  ],
} as const

const TrafaDeRegReason = {
  code: 'Avregform',
  description: 'Avregistreringsorsak',
  options: [
    { value: 'T1', label: 'Totalt' },
    { value: 20, label: 'Utförda ur landet' },
    { value: 'Dimpo', label: 'Direkt import' },
    { value: 10, label: 'Direkt import' },
    { value: 'Leasing', label: 'Leasing' },
    { value: 30, label: 'Leasade' },
  ],
} as const

const TrafaVehicleAge = {
  code: 'Armodel',
  description: 'Fordonsålder',
  options: [
    { value: 'T1', label: 'Totalt' },
    { value: 119, label: '19 år eller äldre' },
    { value: 118, label: '18 år' },
    { value: 117, label: '17 år' },
    { value: 116, label: '16 år' },
    { value: 115, label: '15 år' },
    { value: 114, label: '14 år' },
    { value: 113, label: '13 år' },
    { value: 112, label: '12 år' },
    { value: 111, label: '11 år' },
    { value: 110, label: '10 år' },
    { value: 109, label: '9 år' },
    { value: 108, label: '8 år' },
    { value: 107, label: '7 år' },
    { value: 106, label: '6 år' },
    { value: 105, label: '5 år' },
    { value: 104, label: '4 år' },
    { value: 103, label: '3 år' },
    { value: 102, label: '2 år' },
    { value: 101, label: '1 år' },
    { value: 100, label: '0 år' },
    { value: 199, label: 'Okänd' },
  ],
} as const

const TrafaCylinderVolume = {
  code: 'CVolym',
  description: 'Cylindervolym',
  options: [
    { value: 'T1', label: 'Totalt' },
    { value: 1, label: '-125' },
    { value: 2, label: '126 - 600' },
    { value: 3, label: '601 - 1 000' },
    { value: 4, label: '1 001 -' },
    { value: 9, label: 'Okänd' },
    { value: 5, label: 'Elfordon' },
  ],
} as const

const TrafaGender = {
  code: 'Kon',
  description: 'Kön',
  options: [
    { value: 'T1', label: 'Totalt' },
    { value: 11, label: 'Män' },
    { value: 12, label: 'Kvinnor' },
    { value: 0o0, label: 'Okänt' },
  ],
} as const

const TrafaOwnerAge = {
  code: 'Agaralder',
  description: 'Ägarens ålder',
  options: [
    { value: 'T1', label: 'Totalt' },
    { value: 1, label: '-17' },
    { value: 2, label: '18-20' },
    { value: 3, label: '21-30' },
    { value: 4, label: '31-40' },
    { value: 5, label: '41-50' },
    { value: 6, label: '51-60' },
    { value: 7, label: '61-70' },
    { value: 8, label: '71-80' },
    { value: 9, label: '81+' },
    { value: 99, label: 'okänt' },
  ],
} as const

const TrafaChassis = {
  code: 'Kaross',
  description: 'Karosseri',
  options: [
    { value: 'T1', label: 'Totalt' },
    { value: 410, label: 'Husvagnar' },
    { value: 420, label: 'Påhängsvagnar' },
    { value: 430, label: 'Båttrailers' },
    { value: 440, label: 'Djursläp' },
    { value: 450, label: 'Flak och skåp' },
    { value: 490, label: 'Övriga släpvagnar' },
  ],
} as const

const TrafaTotalWeight = {
  code: 'TotVikt',
  description: 'Totalvikt i kg',
  options: [
    { value: 'T1', label: 'Totalt' },
    { value: 401, label: '– 750 kg' },
    { value: 402, label: '751 – 1 500 kg' },
    { value: 403, label: '1 501– 2 000 kg' },
    { value: 404, label: '2 001– 2 500 kg' },
    { value: 405, label: '2 501– 3 000 kg' },
    { value: 406, label: '3 001– 3 500 kg' },
    { value: 407, label: '3 501 – 5 000 kg' },
    { value: 408, label: '5 001 – 10 000 kg' },
    { value: 409, label: '10 001 – 15 000 kg' },
    { value: 410, label: '15 001+ kg' },
    { value: 499, label: 'Okänd' },
  ],
} as const

const TrafaIndustry = {
  code: 'Bransch',
  description: 'Ägarens näringsgrenstillhörighet enligt SNI 2007',
  options: [
    { value: 'T1', label: 'Totalt' },
    { value: 1, label: 'Jordbruk' },
    { value: 2, label: 'Skogsbruk' },
    { value: 3, label: 'Övriga näringsområden' },
  ],
} as const

const TrafaYear = {
  code: 'Ar',
  description: 'År',
  options: [
    { value: 2004, label: '2004' },
    { value: 2005, label: '2005' },
    { value: 2006, label: '2006' },
    { value: 2007, label: '2007' },
    { value: 2008, label: '2008' },
    { value: 2009, label: '2009' },
    { value: 2010, label: '2010' },
    { value: 2011, label: '2011' },
    { value: 2012, label: '2012' },
    { value: 2013, label: '2013' },
    { value: 2014, label: '2014' },
    { value: 2015, label: '2015' },
    { value: 2016, label: '2016' },
    { value: 2017, label: '2017' },
    { value: 2018, label: '2018' },
    { value: 2019, label: '2019' },
    { value: 2020, label: '2020' },
    { value: 2021, label: '2021' },
    { value: 2022, label: '2022' },
    { value: 2023, label: '2023' },
  ],
} as const

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
export const TRAFA_BASE_URL = 'https://api.trafa.se/api/data?query='
type TrafaDataTarget = 'Personbilar - Nyreg+drivmedel' | 'Personbilar - trafik'

/* export class TrafaQueryBuilder {
  product: string = 't10016'
  year: string[] = []
  measure: string = 'itrfslut'
  fuel: string[] =[]
 
  setProduct(product: TrafaVehicles) {
    const productModel = TrafaProducts.options.find((p) => p.label === product)?.value
    assert(productModel, `Product ${product} not found`)
    this.product = `t100${productModel}`
    return this
  } 

  setYear(year: number[]) {
    const isValidYear = year.every((y) => TrafaYear.options.some((o) => o.value === y))
    if(!isValidYear) return this
    this.year.push(`${year}`)
    return this
  }

  setMeasure(measure: TrafaMeasure) {
    const measureModel = TrafaMeasurements.option.find((m) => m.value === measure)?.value
    this.measure = `${measureModel}`
    return this
  }

  setFuel(fuel: TrafaFuel[]) {
    const isValidFuel = fuel.every((f) => TrafaFuelCategory.options.some((o) => o.label === f))
    if(!isValidFuel) return this
    this.fuel.push(`${fuel}`)
    return this
  }

  build(opts = { skipValidation: false }) {
    const url = `${TRAFA_BASE_URL}${this.product}|ar${this.year.length > 0 ? ":" :""}${this.year.filter((v)=> v ).join(",")}|${this.measure}|drivm${this.fuel.length > 0 ? ":" :""}${this.fuel.filter((v)=> v ).join(",")}`
    if (opts.skipValidation) return  url
    assert(this.year.length > 0, 'Year filter is missing, fetches all years') 
    assert(this.fuel.length > 0, 'Fuel filter is missing, fetches all fuels')
    assert(this.measure === "itrfslut"  , 'Invalid measure, only itrfslut is supported' )
   
    return url
  }
}

const tra = new TrafaQueryBuilder()
const query = tra
  .setYear([2023, 2022])
  .setMeasure('itrfslut')
  .setFuel(['el', 'diesel'])
  .build()
console.log(query)
 */

interface TrafaQueryBuilderOpts {
  year?: number[]
  measure?: TrafaMeasure
  fuel?: TrafaFuel[]
}

interface TrafaQueryBuilder {
  fuel: TrafaFuel[]
  year: number[] | 't1'
  measure: TrafaMeasure
  setYear: (y: number[]) => Omit<TrafaQueryBuilder, 'setYear'>
  setMeasure: (m: TrafaMeasure) => Omit<TrafaQueryBuilder, 'setMeasure'>
  setFuel: (f: TrafaFuel[]) => Omit<TrafaQueryBuilder, 'setFuel'>
  setTarget: (p: TrafaDataTarget) => Omit<TrafaQueryBuilder, 'setTarget'>
  build: (opts?: { skipValidation: boolean }) => string
}
export interface TrafaResponseObject {
  Header: Header
  Rows: Row[]
  Errors: null
  Description: string
  Name: string
  OriginalName: string
  Notes: { [key: string]: string }
  NextPublishDate: Date
}

export interface Header {
  Column: Column[]
  Description: null
}

export interface Column {
  Name: string
  Type: string
  DataType: string
  Filters: any[] | null
  Value: string
  Unit: null | string
  Description: string
  UniqueId: string
}

export interface Row {
  Cell: Cell[]
  IsTotal: boolean
}

export interface Cell {
  Name: string
  IsMeasure: boolean
  Description: string
  Column: string
  Value: string
  FormattedValue: string
  Level: string
  Gis: string
  UniqueId: string
  NoteIds: number[]
  Versions: Version[]
}

export interface Version {
  Key: Date
  Value: string
}

export const createTrafaQueryBuilder = (
  opts: {
    year?: number[]
    measure?: TrafaMeasure
    fuel?: TrafaFuel[]
  } = {},
) => {
  let target = 't10016'
  let year: number[] = []
  let measure: TrafaMeasure = 'itrfslut'
  let fuel: TrafaFuel[] = []
  const targets = [
    {
      label: 'Personbilar - Nyreg+drivmedel',
      value: 26,
    },
    {
      label: 'Personbilar - trafik',
      value: 16,
    },
  ]

  if (opts) {
    if (opts.year) {
      year.push(...opts.year)
    }
    if (opts.measure) {
      measure = opts.measure
    }
    if (opts.fuel) {
      fuel.push(...opts.fuel)
    }
  }

  const setTarget = (p: TrafaDataTarget) => {
    const productModel = targets.find((o) => o.label === p)?.value
    assert(productModel, `Product ${p} not found`)
    target = `t100${productModel}`
    return trafaClient
  }

  const setYear = (y: number[] ) => {

    const isValidYear = y.every((v) => TrafaYear.options.some((o) => o.value === v))
    if (!isValidYear) return trafaClient
    year.push(...y)
    return trafaClient
  }

  const setMeasure = (m: TrafaMeasure) => {
    const measureModel = TrafaMeasurements.option.find((o) => o.value === m)?.value
    if (!measureModel) return trafaClient
    measure = measureModel
    return trafaClient
  }

  const setFuel = (f: TrafaFuel[]) => {
    const isValidFuel = f.every((v) =>
      TrafaFuelCategory.options.some((o) => o.label === v),
    )
    if (!isValidFuel) return trafaClient
    fuel.push(...f)
    return trafaClient
  }

  const build = (opts = { skipValidation: false }) => {
    const url = `${TRAFA_BASE_URL}${target}${year.length > 0 ? '|ar:' : '|ar'}${year.filter((v) => v).join(',')}|${measure}${fuel.length > 0 ? '|drivm:' : ''}${fuel.filter((v) => v).join(',')}`
  
    return url
  }

  const trafaClient = {
    fuel,
    year,
    measure,
    setYear,
    setMeasure,
    setFuel,
    setTarget,
    build,
  }

  return trafaClient
}

const trafaClient = createTrafaQueryBuilder()
/* total number of newly registered cars */
const totalNumberOfNewlyRegisteredCars = async () => {
  const query = trafaClient
    .setTarget('Personbilar - trafik')
    .setYear([2022])
    .setFuel(['el'])
    .setMeasure('itrfslut')
    .build()

  const res = await axios.get(query).then((res) => res.data as TrafaResponseObject)
  return res
}
const totalNumberOfNewlyRegisteredCarsByFuel = async () => {
  const query = trafaClient
    .setTarget('Personbilar - Nyreg+drivmedel')
    .setYear([2022, 2021, 2020])
    .setMeasure('nyregunder')
    .build()
  console.log(query)
  const res = await axios.get(query).then((res) => res.data as TrafaResponseObject)
  return res
}

/**
 * Represents the options for a Trafa query.
 */
interface TrafaQueryOpts {
  year: string[]
  measure: TrafaMeasure
  fuel: TrafaFuel[]
}

/**
 * Represents a Trafa client with various methods for configuring and building a query.
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
export interface TrafaClient extends TrafaQueryOpts {
  setYear: (y: string) => TrafaClient
  setMeasure: (m: TrafaMeasure) => TrafaClient
  setFuel: (f: TrafaFuel[]) => TrafaClient
  setTarget: (p: TrafaDataTarget) => TrafaClient
  build: () => string
}

export class TrafaClient implements TrafaClient {
  fuel: TrafaFuel[] = []
  year: string[] = []
  measure: TrafaMeasure = 'itrfslut'
}

const trafa = new TrafaClient()
trafa.fuel


type CommaSeperatedSpring=`${string},${string}`
/**
 * Validates a comma-separated string of years.
 *  Checks if all the years in the array are valid.
 *  A valid year is defined as a year that is greater than or equal to 2000
 * and less than or equal to the current year.
 * @param commaSeparatedYearString - The string containing comma-separated years.
 * @returns An array of valid years.
 */

export const validYears = (commaSeperatedYearString: CommaSeperatedSpring) => {
  const years = commaSeperatedYearString.split(',')
 
  const isValidYear = years.every(
    (y) => parseInt(y) >= 2000 && parseInt(y) <= new Date().getFullYear(),
  )
  return isValidYear ? years : []
}
