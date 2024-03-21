import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import Company from '../../../components/Company/Company'
import { Company as TCompany } from '../../../utils/types'
import { CompanyDataService } from '../../../utils/companyDataService'

type CompanyProps = {
  company: TCompany
  companyNames: Array<string>
}

export default function Index({ company, companyNames }: CompanyProps) {
  return <Company company={company} companyNames={companyNames} />
}

interface Params extends ParsedUrlQuery {
  id: string
}

const cache = new Map()

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = (params as Params).company as string

  const companyDataService = new CompanyDataService()

  const [company, companies] = await Promise.all([
    companyDataService.getCompany(id),
    companyDataService.getCompanies(),
  ])

  const companyNames = companies.map((m) => m.Name)

  const result = {
    props: {
      company,
      id,
      companyNames,
    },
  }

  cache.set(id, result)

  return result
}
