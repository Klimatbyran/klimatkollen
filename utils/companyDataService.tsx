import * as fs from 'fs'
import path from 'path'
import { Company, CompanyEmissionsPerYear } from './types'

export class CompanyDataService {
  companies: Array<Company>

  constructor() {
    const companiesDataFilePath = path.resolve('./dummy_companies.json')
    const companiesDataFileContent = fs.readFileSync(companiesDataFilePath, {
      encoding: 'utf-8',
    })
    const jsonData = JSON.parse(companiesDataFileContent)

    this.companies = jsonData
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((data: any) => {
        const emissionsPerYear = {
          Scope1: data.scope1,
          Scope2: data.scope2,
          Scope3: data.scope3,
          TotalEmissions: data.totalEmissions,
          TotalUnit: data.totalUnit,
        } as unknown as CompanyEmissionsPerYear

        return {
          Name: data.name,
          Industry: data.industry,
          Url: data.url,
          Emissions: emissionsPerYear,
        } as unknown as Company
      })
      .sort((a: Company, b: Company) => (
        a.Emissions.TotalEmissions - b.Emissions.TotalEmissions
      ))
    this.companies.forEach((company: Company, index: number) => {
      const updatedCompany = { ...company }
      updatedCompany.Emissions.TotalEmissionRank = index + 1
      return updatedCompany
    })
  }

  public getCompanies(): Array<Company> {
    return this.companies
  }

  public getCompany(name: string): Company {
    return this.companies.filter((company) => company.Name.toLowerCase() === name.toLowerCase())[0]
  }
}
