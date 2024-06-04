import { readFileSync } from 'fs'
import { resolve } from 'path'
import { Company, CompanyEmissionsPerYear, GuessedCompany } from './types'

function loadJSON<T>(path: string): T {
  return JSON.parse(readFileSync(resolve(path), { encoding: 'utf-8' }))
}

function normalizeString(input: string) {
  return input.replace(/\s+/g, '').toLowerCase()
}

export class CompanyDataService {
  companies: Company[]

  guessedCompanies: GuessedCompany[]

  constructor() {
    this.companies = loadJSON<Company[]>('./data/companies/company-data.json')
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

    this.guessedCompanies = [
      loadJSON<GuessedCompany>('./public/data/2024-05-31-AstraZeneca.json'),
    ]
  }

  public getCompanies(): Array<Company> {
    if (this.companies.length < 1) {
      throw new Error('No companies found')
    }
    return this.companies
  }

  public getCompany(name: string): { verified: Company, guessed: GuessedCompany } {
    const normalizedName = normalizeString(name)
    // TODO: handle case when it's not found
    // when navigating to http://localhost:3000/foretag/utslappen for example
    return {
      // TODO: We will have a problem matching company names to actual names, until we introduce stable IDs or slugs
      verified: this.companies.find((company) => normalizeString(company.Name) === normalizedName)!,
      guessed: this.guessedCompanies.find((company) => normalizeString(company.companyName) === normalizedName)!,
    }
  }
}
