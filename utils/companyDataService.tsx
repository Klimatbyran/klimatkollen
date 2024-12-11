import fetch from 'node-fetch'
import {
  CompaniesJsonData,
  Company,
  CompanyEmissionsPerYear,
  CompanyJsonData,
} from './types'

export class CompanyDataService {
  companies: Array<Company> = []

  static allowedTags: Array<string> = ['large-cap', 'state-owned']

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

      this.companies = jsonData
        .filter((data: CompanyJsonData) => data.tags.some((tag: string) => CompanyDataService.allowedTags.includes(tag)))
        .map((data: CompanyJsonData) => {
          const curretEmissions = data.reportingPeriods[0]?.emissions

          const scope1 = curretEmissions?.scope1?.total
          const scope2 = curretEmissions?.scope2?.mb
          const reportsSeperate1or2 = scope1 ?? scope2
          const seperate1n2 = reportsSeperate1or2 ? (scope1 ?? 0) + (scope2 ?? 0) : null

          const combined1n2 = curretEmissions?.scope1And2?.total || null
          const scope1n2 = seperate1n2 ? seperate1n2 : combined1n2

          const emissionsPerYear: CompanyEmissionsPerYear = {
            Scope1n2: scope1n2,
            Scope3: curretEmissions?.scope3?.statedTotalEmissions?.total ?? null,
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
