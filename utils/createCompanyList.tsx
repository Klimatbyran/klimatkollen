import styled from 'styled-components'
import { ColumnDef, Row } from '@tanstack/react-table'
import { TFunction } from 'i18next'

import Link from 'next/link'
import { Company } from './types'
import { devices } from './devices'
import { getCompanyURL } from './shared'

const ScopeColumn = styled.span<{ isMissing: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;

  @media only screen and (${devices.smallMobile}) {
    gap: 0.5rem;
  }

  color: ${({ isMissing, theme }) => (isMissing ? theme.newColors.gray : theme.newColors.orange3)};
  font-style: ${({ isMissing }) => (isMissing ? 'italic' : 'normal')};
  font-size: ${({ isMissing }) => (isMissing ? '0.875em' : '0.9375em')};
`

const formatter = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 0 })

const getCustomSortFn = ({
  stringsOnTop = false,
  sortAscending = false,
  scope = 'Scope1n2',
}: {
    stringsOnTop?: boolean
    sortAscending?: boolean
    scope?: keyof Company['Emissions']
  } = {}) => (rowA: Row<Company>, rowB: Row<Company>) => {
  const a = rowA.original.Emissions[scope]
  const b = rowB.original.Emissions[scope]

  // Handle NaN values
  const aIsNaN = Number.isNaN(a)
  const bIsNaN = Number.isNaN(b)
  if (aIsNaN && bIsNaN) {
    return 0
  }
  if (aIsNaN || bIsNaN) {
    // eslint-disable-next-line no-nested-ternary
    return stringsOnTop ? (aIsNaN ? -1 : 1) : aIsNaN ? 1 : -1
  }

  // Sort non-NaN values normally
  return sortAscending ? a - b : b - a
}

export const companyColumns = (t: TFunction): ColumnDef<Company>[] => {
  const notReported = t('common:notReported')

  return [
    {
      header: t('common:company'),
      cell: (row) => (row.cell.row.original.WikiId ? (
        <Link
          href={getCompanyURL(row.cell.row.original.Name, row.cell.row.original.WikiId)}
        >
          {row.cell.row.original.Name}
        </Link>
      ) : (
        row.cell.row.original.Name
      )),
      accessorKey: 'Name',
    },
    {
      header: t('startPage:companyView.scope1n2'),
      cell: (row) => {
        const scope1n2Emissions = row.cell.row.original.Emissions.Scope1n2
        const hasValue = Number.isFinite(scope1n2Emissions)

        const scope1n2String = hasValue
          ? formatter.format(scope1n2Emissions as unknown as number)
          : notReported
        return (
          <ScopeColumn
            isMissing={scope1n2String === notReported}
            className={hasValue ? 'font-mono' : ''}
          >
            {scope1n2String}
          </ScopeColumn>
        )
      },
      sortingFn: getCustomSortFn({ scope: 'Scope1n2', sortAscending: true }),
      accessorKey: 'Emissions.Scope1n2',
    },
    {
      header: () => t('startPage:companyView.scope3'),
      cell: (row) => {
        const scope3Emissions = row.cell.row.original.Emissions.Scope3
        const hasValue = Number.isFinite(scope3Emissions)

        const scope3String = hasValue
          ? formatter.format(scope3Emissions as unknown as number)
          : notReported
        return (
          <ScopeColumn
            isMissing={scope3String === notReported}
            className={hasValue ? 'font-mono' : ''}
          >
            {scope3String}
          </ScopeColumn>
        )
      },
      sortingFn: getCustomSortFn({ scope: 'Scope3', sortAscending: true }),
      accessorKey: 'Emissions.Scope3',
    },
  ]
}
