/* eslint-disable @typescript-eslint/no-explicit-any */
import { Municipality, EmissionPerYear, EmissionSector, Budget, Emission, Trend } from './types'
import * as fs from 'fs'
import * as path from 'path'

const EMISSION_FILE_PATH = path.resolve('./resources/emission-data.json');

export class EmissionService {
  municipalities: Array<Municipality>

  constructor() {
    const emissionFileContent = fs.readFileSync(EMISSION_FILE_PATH, { encoding: 'utf-8' })
    const jsonData: any[] = JSON.parse(emissionFileContent)
    this.municipalities = jsonData.map((jsonData: any) => {
      var emissions = new Array<EmissionPerYear>();
      Object.entries(jsonData.emissions).forEach(([year, emission]) => {
        let emissionByYear = {
          Year: Number(year),
          CO2Equivalent: emission
        } as unknown as EmissionPerYear
        emissions.push(emissionByYear)
      });
      const emission = {
        EmissionPerYear: emissions,
        LargestEmissionSectors: new Array<EmissionSector>()
      } as Emission
      emission.EmissionLevelChangeAverage = this.getEmissionLevelChangeAverage(
        emission.EmissionPerYear,
        5,
      )
      const trend = {
        FutureCO2Emission: jsonData.futureEmission,
        TrendPerYear: Object.entries(jsonData.trend).map(
          ([year, emission]) => {
            return {
              Year: Number(year),
              CO2Equivalent: emission,
            }
          }
        )
      } as unknown as Trend
      const budget = {
        PercentageOfNationalBudget: 1,
        CO2Equivalent: jsonData.budget,
        BudgetPerYear: Object.entries(jsonData.emissionBudget).map(
          ([year, emission]) => {
            return {
              Year: Number(year),
              CO2Equivalent: emission,
            }
          }
        )
      } as unknown as Budget
      let municipality = {
        Name: jsonData.kommun,
        HistoricalEmission: emission,
        EmissionTrend: trend,
        Budget: budget
      } as Municipality
      return municipality
    })
    .sort((a: Municipality, b: Municipality) => {
      return (
        a.HistoricalEmission.EmissionLevelChangeAverage -
        b.HistoricalEmission.EmissionLevelChangeAverage
      )
    })
    this.municipalities.forEach((municipality: Municipality, index: number) => {
      municipality.HistoricalEmission.AverageEmissionChangeRank = index + 1
    })
  }

  private getEmissionLevelChangeAverage(
    emissions: Array<EmissionPerYear>,
    years: number
  ): number {
    let emissionsPercentages = 0
    emissions
      .slice(Math.max(emissions.length - years - 1, 1))
      .forEach(
        (emission: EmissionPerYear, index: number, emissions: Array<EmissionPerYear>) => {
          let previous = emissions[index - 1] as EmissionPerYear
          if (previous) {
            let changeSinceLastYear = ((emission.CO2Equivalent - previous.CO2Equivalent) /
              previous.CO2Equivalent) as number
            emissionsPercentages += changeSinceLastYear
          }
        },
      )
    return emissionsPercentages / years
  }

  public getMunicipalities(): Array<Municipality> {
    return this.municipalities
  }

  public getMunicipality(name: string): Municipality {
    const mun = this.municipalities.filter(kommun => kommun.Name.toLowerCase() === name)[0]
    return mun
  }
}
