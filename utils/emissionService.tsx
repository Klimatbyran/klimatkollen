import { Municipality, Emission, EmissionSector } from './types'
import axios from 'axios'

const CLIMATE_VIEW_BASE_URL = "https://climateview.azure-api.net/climatedata/nationalemissions/se"

export class EmissionService {
  municipalities: Array<Municipality>

  constructor() {
    this.municipalities = []
  }

  private getEmissionLevelChangeAverage(emissions : Array<Emission>, years: number): number {
    let emissionsPercentages = 0
    emissions
      .slice(Math.max(emissions.length - years-1, 1))
      .forEach((emission : Emission, index: number, emissions: Array<Emission>) => {
        let previous = emissions[index-1] as Emission
        if (previous) {
          let changeSinceLastYear = (emission.CO2equivalent-previous.CO2equivalent)/previous.CO2equivalent as number
          emissionsPercentages += changeSinceLastYear
        }
      })
      
    return emissionsPercentages/years
  }
  
  public async getMunicipalities(): Promise<Array<Municipality>> {
    const promise = new Promise<Array<Municipality>>((resolve, reject) => {

      axios.get(CLIMATE_VIEW_BASE_URL).then((response) => {

        if (this.municipalities.length > 0) {
          resolve(this.municipalities)
        }
        else {
          this.municipalities = response.data.emissions
            .map(
              (municipalityData: any) => {

                let emissions = municipalityData.emissions
                  .find((sector:any) => { 
                    return sector.mainSector == "Alla"
                  })
                  .emissions.map((emission:any) => {
                    return {
                      Year: emission.year,
                      CO2equivalent: emission.emission
                    }
                  })

                let municipality = {
                  Name: municipalityData.kommun
                } as Municipality

                municipality.EmissionLevelChangeAverage = this.getEmissionLevelChangeAverage(emissions, 5)
                return municipality
              },
            )
            .sort((a: Municipality, b:Municipality) => {
                return a.EmissionLevelChangeAverage - b.EmissionLevelChangeAverage
              })
            
            this.municipalities.forEach((municipality: Municipality, index:number) => {
              municipality.AverageEmissionChangeRank = index+1
            })

          resolve(this.municipalities)
        }
      })
      .catch((error) => {
        reject(error)
      })
    })

    return promise
  }

  private totalEmissions(sector:any) { 
    return sector.mainSector == "Alla" && sector.subSector == "Alla"
  }
  private mainSectorEmissions(sector: any) {
    return sector.mainSector != "Alla" && sector.subSector == "Alla"
  }

  private getTop3EmissionSectorsFromRawData(municipalityRawData:any, sectorFilter: Function) : Array<EmissionSector> {
    
    return municipalityRawData.emissions
      .filter(sectorFilter)
      .map((sector:any) => {
        
          let lastEmission = sector.emissions.pop()

          let emissionSector = {
            CO2equivalent: lastEmission.emission,
            Year: lastEmission.year,
            Name: sector.subSector == "Alla" ? sector.mainSector : sector.subSector
          } as EmissionSector
          
           emissionSector.SubSectors = this.getTop3EmissionSectorsFromRawData(municipalityRawData, 
              (sector: any) => sector.mainSector == emissionSector.Name && sector.subSector != "Alla")

          return emissionSector
      })
      .sort((sectorData1:EmissionSector, sectorData2:EmissionSector) => sectorData2.CO2equivalent - sectorData1.CO2equivalent)
      .slice(0, 3) as Array<EmissionSector>
  }

  //TODO: 
  // co2-budget, 
  // future emission based on trend
  // total budget kvar
  public async getMunicipality(name: string): Promise<Municipality> {
    const promise = new Promise<Municipality>((resolve, reject) => {

      const url = CLIMATE_VIEW_BASE_URL + "/kommun/" + name
      
      axios.get(url).then((response) => {

        const municipality: Municipality = response.data.emissions
          .map((municipalityData: any) => {
            
            let municipality = {
              Name: municipalityData.kommun,
              Emissions: municipalityData.emissions
                .find(this.totalEmissions)
                .emissions.map((emission:any) => {
                  return {
                    Year: emission.year,
                    CO2equivalent: emission.emission
                  }
                }),
              LargestEmissionSectors: this.getTop3EmissionSectorsFromRawData(municipalityData, this.mainSectorEmissions)
            } as Municipality

            municipality.EmissionLevelChangeAverage = this.getEmissionLevelChangeAverage(municipality.Emissions, 5)
            return municipality
          },
        )
        .shift()

        resolve(municipality)

      })
      .catch((error) => {
        reject(error)
      })
    })

    return promise
  }

}