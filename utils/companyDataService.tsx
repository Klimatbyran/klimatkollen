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
        throw new Error('Failed to fetch data from the API', { cause: { status: response.status, statusText: response.statusText } })
      }

      const jsonData = (await response.json()) as CompaniesJsonData

      this.companies = jsonData
        .filter((data: CompanyJsonData) => data.tags.some((tag: string) => CompanyDataService.allowedTags.includes(tag)))
        .map((data: CompanyJsonData) => {
          const currentEmissions = data.reportingPeriods[0]?.emissions

          // If either scope 1 and scope 2 have verification, then we use them for the total.
          // Otherwise, we use the combined scope1And2 if it exists
          const Scope1n2 = (Boolean(currentEmissions?.scope1?.metadata?.verifiedBy)
            || Boolean(currentEmissions?.scope2?.metadata?.verifiedBy)
            ? (currentEmissions?.scope1?.total || 0)
            + (currentEmissions?.scope2
              ?.calculatedTotalEmissions || 0)
            : currentEmissions?.scope1And2?.total || 0)

          const Scope3 = currentEmissions?.scope3?.calculatedTotalEmissions ?? null

          const emissionsPerYear: CompanyEmissionsPerYear = {
            Scope1n2,
            Scope3,
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
      throw new Error('Failed to retrieve company data from the API', { cause: error })
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
