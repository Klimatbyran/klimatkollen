/* eslint-disable @typescript-eslint/no-explicit-any */
import { Municipality, EmissionPerYear, EmissionSector, Budget, Emission, Trend } from './types'
import axios from 'axios'
import * as fs from 'fs'
import * as path from 'path'

const CLIMATE_VIEW_EMISSION_BASE_URL =
  'https://climateview.azure-api.net/climatedata/nationalemissions/se'
const CLIMATE_VIEW_EMISSION_URL =
  'https://climateview.azure-api.net/climatedata/nationalemissions/se/kommun/'
const CLIMATE_VIEW_BUDGET_URL =
  'https://climateview.azure-api.net/climatedata/nationalbudgets/se/kommun/'

const emissionJsonPath = path.resolve('./resources/emission-data.json');
const emissionFileContent = fs.readFileSync(emissionJsonPath, { encoding: 'utf-8' })

interface JsonObj {
  kommun: string
}

let jsonList: JsonObj[] = JSON.parse(emissionFileContent)

export class EmissionService {
  municipalities: Array<Municipality>
  jsonData: Array<Municipality>

  constructor() {
    this.municipalities = []
    this.jsonData = jsonList.map((jsonData: any) => {
      var emissions = new Array<EmissionPerYear>();
      Object.entries(jsonData.emissions).forEach(([year, emission]) => {
        let emissionByYear = {
          Year: year,
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
        TrendPerYear: Object.entries(jsonData.trend).map(
          ([year, emission]) => {
            return {
              Year: year,
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
              Year: year,
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
    this.jsonData.forEach((municipality: Municipality, index: number) => {
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

  public async getMunicipalities(): Promise<Array<Municipality>> {
    const promise = new Promise<Array<Municipality>>((resolve, reject) => {
      axios
        .get(CLIMATE_VIEW_EMISSION_BASE_URL)
        .then((response) => {
          if (this.municipalities.length > 0) {
            resolve(this.municipalities)
          } else {
            this.municipalities = response.data.emissions
              .map((municipalityData: any) => {
                let emissions = municipalityData.emissions
                  .find((sector: any) => {
                    return sector.mainSector == 'Alla'
                  })
                  .emissions.map((emission: any) => {
                    return {
                      Year: emission.year,
                      CO2Equivalent: emission.emission,
                    }
                  })

                let municipality = {
                  Name: municipalityData.kommun,
                  HistoricalEmission: {
                    EmissionPerYear: emissions,
                  },
                } as Municipality

                municipality.HistoricalEmission.EmissionLevelChangeAverage =
                  this.getEmissionLevelChangeAverage(emissions, 5)
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

            resolve(this.jsonData)
          }
        })
        .catch((error) => {
          reject(error)
        })
    })

    return promise
  }

  private totalEmissions(sector: any) {
    return sector.mainSector == 'Alla' && sector.subSector == 'Alla'
  }
  private mainSectorEmissions(sector: any) {
    return sector.mainSector != 'Alla' && sector.subSector == 'Alla'
  }

  private getTop3EmissionSectorsFromRawData(
    municipalityRawData: any,
    sectorFilter: Function,
  ): Array<EmissionSector> {
    return municipalityRawData.emissions
      .filter(sectorFilter)
      .map((sector: any) => {
        let lastEmission = sector.emissions.pop()

        let emissionSector = {
          CO2Equivalent: lastEmission.emission,
          Year: lastEmission.year,
          Name: sector.subSector == 'Alla' ? sector.mainSector : sector.subSector,
        } as EmissionSector

        emissionSector.SubSectors = this.getTop3EmissionSectorsFromRawData(
          municipalityRawData,
          (sector: any) =>
            sector.mainSector == emissionSector.Name && sector.subSector != 'Alla',
        )

        return emissionSector
      })
      .sort(
        (sectorData1: EmissionSector, sectorData2: EmissionSector) =>
          sectorData2.CO2Equivalent - sectorData1.CO2Equivalent,
      )
      .slice(0, 3) as Array<EmissionSector>
  }

  public async getMunicipality(name: string): Promise<Municipality> {
    const promise = new Promise<Municipality>((resolve, reject) => {
      
      function toTitleCase(str:string) {
          return str.toLowerCase().replace(/(?:^|[\s\-\/])(\w|[\p{L}])/gu, function (match) {
            return match.toUpperCase();
        });
      }

      const parseEmissions = (responseData: any): Emission => {
        const emissions = responseData.emissions
          .map((municipalityData: any) => {
            const emissions = {
              EmissionPerYear: municipalityData.emissions
                .find(this.totalEmissions)
                .emissions.map((emission: any) => {
                  return {
                    Year: emission.year,
                    CO2Equivalent: emission.emission,
                  }
                }),
              LargestEmissionSectors: this.getTop3EmissionSectorsFromRawData(
                municipalityData,
                this.mainSectorEmissions,
              ),
            } as Emission

            emissions.EmissionLevelChangeAverage = this.getEmissionLevelChangeAverage(
              emissions.EmissionPerYear,
              5,
            )
            return emissions
          })
          .shift()

        return emissions
      }

      const parseBudget = (responseData: any): Budget => {
        const budget = {
          CO2Equivalent: responseData.emissionBudgets[0].totalRemainingCO2Budget,
          PercentageOfNationalBudget:
            responseData.emissionBudgets[0].percentOfNationalCO2Budget,
          BudgetPerYear:
            responseData.emissionBudgets[0].emissionReductions.exponentialEmissionReduction.yearlyEmissionReduction.map(
              (emission: any) => {
                return {
                  Year: emission.year,
                  CO2Equivalent: emission.emission,
                }
              },
            ),
        } as Budget

        return budget
      }
      
      const parseTrend = (responseData: any): Trend => {
        const trend = {
          TrendPerYear: responseData.emissionBudgets[0].emissionReductions.trendEmissionReductionLimitedByNetZeroOrEndYear.yearlyEmissionReduction.map(
            (emission: any) => {
              return {
                Year: emission.year,
                CO2Equivalent: emission.emission,
              }
            },
          )
        } as Trend
        return trend
      }

      Promise.allSettled([
        axios.get(CLIMATE_VIEW_EMISSION_URL + toTitleCase(name)),
        axios.get(CLIMATE_VIEW_BUDGET_URL + toTitleCase(name)),
      ])
        .then((result) => {
          //reject only if emission data is missing
          if (result[0].status == 'rejected') {
            reject("Utsläpp för den här kommunen hittades inte")
          } else if (result[0].status == 'fulfilled') {
            const municipality = {
              Name: result[0].value.data.emissions[0].kommun,
              HistoricalEmission: parseEmissions(result[0].value.data),
              Budget:
                result[1].status == 'fulfilled'
                  ? parseBudget(result[1].value.data)
                  : {
                      CO2Equivalent: 0,
                      PercentageOfNationalBudget: 0,
                      BudgetPerYear: [],
                    },
              EmissionTrend:
                result[1].status == 'fulfilled'
                  ? parseTrend(result[1].value.data)
                  :  {
                    TotalRemainingCO2Budget: 0,
                    RemainingCO2: 0,
                    TrendPerYear: [],
                  }
            } as Municipality
            const mun = this.jsonData.filter(kommun => kommun.Name.toLowerCase() === name)[0]
            console.log(municipality)
            console.log(mun)
            resolve(mun)
          }
        })
        .catch((error) => {
          reject(error)
        })
    })

    return promise
  }
}
