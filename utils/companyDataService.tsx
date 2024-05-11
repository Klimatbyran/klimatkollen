import * as fs from 'fs'
import path from 'path'
import { Company, CompanyEmissionsPerYear } from './types'

export class CompanyDataService {
  companies: Array<Company>

  constructor() {
    const companiesDataFilePath = path.resolve('./data/companies/company-data.json')
    const companiesDataFileContent = fs.readFileSync(companiesDataFilePath, {
      encoding: 'utf-8',
    })
    const jsonData = JSON.parse(companiesDataFileContent)

    this.companies = jsonData
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((data: any) => {
        const emissionsPerYear = {
          Scope1n2: data.Scope1n2,
          Scope3: data.Scope3,
        } as unknown as CompanyEmissionsPerYear

        return {
          Name: data.Company,
          Url: data.URL,
          Comment: data.Comment,
          Emissions: emissionsPerYear,
        } as unknown as Company
      })
  }

  public getCompanies(): Array<Company> {
    if (this.companies.length < 1) {
      throw new Error('No companies found')
    }
    return this.companies
  }

  public getCompany(name: string): Company {
    return this.companies.filter((company) => company.Name.toLowerCase() === name.toLowerCase())[0]
  }
}
