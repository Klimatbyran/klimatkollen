import fetch from 'node-fetch'
import {
  CompaniesJsonData,
  Company,
  CompanyEmissionsPerYear,
  CompanyJsonData,
} from './types'

export class CompanyDataService {
  companies: Array<Company> = []

  constructor() {
    this.loadCompanies()
  }

  private async loadCompanies() {
    try {
      const response = await fetch('https://api.klimatkollen.se/api/companies')

      if (!response.ok) {
        throw new Error('Failed to fetch data from the API')
      }

      const jsonData = (await response.json()) as CompaniesJsonData

      this.companies = jsonData.map((data: CompanyJsonData) => {
        const curretEmissions = data.reportingPeriods[0]?.emissions

        const emissionsPerYear: CompanyEmissionsPerYear = {
          Scope1n2:
            (curretEmissions?.scope1?.total ?? 0) + (curretEmissions?.scope2?.mb ?? 0),
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
      throw new Error('Failed to retrieve company data from the API')
    }
  }

  public async getCompanies(): Promise<Array<Company>> {
    if (this.companies.length < 1) {
      await this.loadCompanies()
    }
    return this.companies
  }

  public getCompany(name: string): Company | undefined {
    return this.companies.find(
      (company) => company.Name.toLowerCase() === name.toLowerCase(),
    )
  }
}
