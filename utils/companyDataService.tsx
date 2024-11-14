import fetch from 'node-fetch'
import { Company, CompanyEmissionsPerYear } from './types'

export class CompanyDataService {
  companies: Array<Company> = []

  constructor() {
    this.loadCompanies() // Ensure data is loaded asynchronously
  }

  // Load companies data asynchronously
  private async loadCompanies() {
    try {
      const response = await fetch('https://api.klimatkollen.se/api/companies')

      if (!response.ok) {
        throw new Error('Failed to fetch data from the API')
      }

      const jsonData = await response.json()

      this.companies = jsonData.map((data: any) => {
        const curretEmissions = data.reportingPeriods[0]?.emissions

        const emissionsPerYear: CompanyEmissionsPerYear = {
          Scope1n2:
            (curretEmissions?.scope1?.total ?? 0) + (curretEmissions?.scope2?.lb ?? 0),
          Scope3: curretEmissions?.scope3?.statedTotalEmissions?.total ?? 0,
        }

        return {
          Name: data.name,
          Url: data.reportingPeriods[0]?.reportURL ?? '',
          WikiId: data.wikidataId,
          Comment: data.description,
          Emissions: emissionsPerYear,
        } as Company
      })
    } catch (error) {
      console.error('Error loading companies:', error)
    }
  }

  // Return companies after ensuring data is loaded
  public async getCompanies(): Promise<Array<Company>> {
    if (this.companies.length < 1) {
      await this.loadCompanies() // Ensure data is loaded before returning
    }
    return this.companies
  }

  public getCompany(name: string): Company | undefined {
    return this.companies.find(
      (company) => company.Name.toLowerCase() === name.toLowerCase(),
    )
  }
}
