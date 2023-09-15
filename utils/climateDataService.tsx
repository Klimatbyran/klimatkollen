/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from 'fs'
import * as path from 'path'
import {
  Municipality, EmissionPerYear, EmissionSector, Budget, Emission, Trend, ClimatePlan,
} from './types'

const CLIMATE_DATA_FILE_PATH = path.resolve('./data/output/climate-data.json')

export class ClimateDataService {
  municipalities: Array<Municipality>

  constructor() {
    const climateDataFileContent = fs.readFileSync(CLIMATE_DATA_FILE_PATH, { encoding: 'utf-8' })
    const jsonData: any[] = JSON.parse(climateDataFileContent)

    this.municipalities = jsonData.map((data: any) => {
      const emissions = new Array<EmissionPerYear>()

      Object.entries(data.emissions).forEach(([year, emission]) => {
        const emissionByYear = {
          Year: Number(year),
          CO2Equivalent: emission,
        } as unknown as EmissionPerYear
        emissions.push(emissionByYear)
      })

      const emission = {
        EmissionPerYear: emissions,
        LargestEmissionSectors: new Array<EmissionSector>(),
      } as Emission

      emission.EmissionLevelChangeAverage = this.getEmissionLevelChangeAverage(
        emission.EmissionPerYear,
        5,
      )

      const trend = {
        FutureCO2Emission: data.futureEmission,
        TrendPerYear: Object.entries(data.trend).map(
          ([year, emissionTrend]) => ({
            Year: Number(year),
            CO2Equivalent: emissionTrend,
          }),
        ),
      } as unknown as Trend

      const budget = {
        PercentageOfNationalBudget: 1,
        CO2Equivalent: data.budget,
        BudgetPerYear: Object.entries(data.emissionBudget).map(
          ([year, emissionBudget]) => ({
            Year: Number(year),
            CO2Equivalent: emissionBudget,
          }),
        ),
      } as unknown as Budget

      const climatePlan = {
        Link: data.climatePlanLink,
        YearAdapted: data.climatePlanYear,
        Comment: data.climatePlanComment,
      } as unknown as ClimatePlan

      const municipality = {
        Name: data.kommun,
        HistoricalEmission: emission,
        EmissionTrend: trend,
        Budget: budget,
        EmissionChangePercent: data.emissionChangePercent,
        HitNetZero: data.hitNetZero,
        BudgetRunsOut: data.budgetRunsOut,
        ElectricCars: data.electricCars,
        ElectricCarChangePercent: data.electricCarChangePercent,
        ElectricCarChangeYearly: data.electricCarChangeYearly,
        ClimatePlan: climatePlan,
        BicycleMetrePerCapita: data.bicycleMetrePerCapita,
      } as Municipality
      return municipality
    })
      .sort((a: Municipality, b: Municipality) => (
        a.HistoricalEmission.EmissionLevelChangeAverage
          - b.HistoricalEmission.EmissionLevelChangeAverage
      ))
    this.municipalities.forEach((municipality: Municipality, index: number) => {
      const updatedMunicipality = { ...municipality }
      updatedMunicipality.HistoricalEmission.AverageEmissionChangeRank = index + 1
      return updatedMunicipality
    })
  }

  private getEmissionLevelChangeAverage(
    emissions: Array<EmissionPerYear>,
    years: number,
  ): number {
    let emissionsPercentages = 0
    emissions
      .slice(Math.max(emissions.length - years - 1, 1))
      .forEach(
        (emission: EmissionPerYear, index: number, historicEmissions: Array<EmissionPerYear>) => {
          const previous = historicEmissions[index - 1] as EmissionPerYear
          if (previous) {
            const changeSinceLastYear = ((emission.CO2Equivalent - previous.CO2Equivalent)
              / previous.CO2Equivalent) as number
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
    const mun = this.municipalities.filter((kommun) => kommun.Name.toLowerCase() === name)[0]
    return mun
  }
}
