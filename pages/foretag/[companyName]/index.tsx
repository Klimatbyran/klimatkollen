import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ReactElement } from 'react'
import styled from 'styled-components'

import { CompanyDataService } from '../../../utils/companyDataService'
import { ONE_WEEK_MS } from '../../../utils/shared'
import Layout from '../../../components/Layout'
import Footer from '../../../components/Footer/Footer'
import Company from '../../../components/Company/Company'
import { GuessedCompany, Company as TCompany } from '../../../utils/types'

const StyledLayout = styled(Layout)`
  margin-top: 48px;
`

type Props = {
    id: string
  company: { verified: TCompany, guessed: GuessedCompany }
  companyNames: string[]
}

export default function CompanyDetails({
  id,
  company,
  companyNames,
}: Props) {
  return (
    <Company
      id={id}
      company={company}
      companyNames={companyNames}
    />
  )
}

CompanyDetails.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <StyledLayout>{page}</StyledLayout>
      <Footer minimal />
    </>
  )
}

interface Params extends ParsedUrlQuery {
  companyName: string
}

const cache = new Map()

export const getServerSideProps: GetServerSideProps = async ({ params, res, locale }) => {
  res.setHeader('Cache-Control', `public, stale-while-revalidate=60, max-age=${ONE_WEEK_MS}`)

  // TODO: Since companies change names, we need to include a unique identifier in the company URL.
  // For example `/foretag/astrazeneca-8a2hcte`, where the slug `8a2hcte` is the actual unique identifier.
  // This way, we can slugify the company name in the URL, and always redirect to the correct company page
  // even as the comapny name (and its URL) may change. This is important for maintaining stable URLs.
  // To implement this, replace `id` by parsing the slug from the `companyName`.
  // Maybe also rename the route parameter to `companySlug` to make it clear.
  // NOTE: See an example implementation here:
  // https://github.com/Greenheart/idg.tools/blob/d06c8eaaa74e780520b23f1984fd5d097bbe11c6/shared/content-utils.ts#L74-L84
  const id = (params as Params).companyName
  if (cache.get(id)) {
    return cache.get(id)
  }

  const companyDataService = new CompanyDataService()

  const [companies, company] = await Promise.all([
    companyDataService.getVerifiedCompanies(),
    companyDataService.getCompany(id),
  ])

  const result = {
    props: {
      id,
      company,
      companyNames: companies.map((c) => c.Name),
      ...await serverSideTranslations(locale as string, ['common', 'company']),
    },
  }
  cache.set(id, result)

  return result
}
