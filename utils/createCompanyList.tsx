import styled from 'styled-components'
import { ColumnDef } from '@tanstack/react-table'
import { TFunction } from 'i18next'

import { Company } from './types'

// IDEA: do something similar for the regional view to distinguish between actual important data (orange), and when something is missing (gray)
const ScopeColumn = styled.span<{ isMissing: boolean }>`
  color: ${({ isMissing, theme }) => (isMissing ? 'gray' : theme.darkYellow)};
  font-style: ${({ isMissing }) => (isMissing ? 'italic' : 'normal')};
`

const formatter = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 0 })

export const companyColumns = (t: TFunction): ColumnDef<Company>[] => {
  const notReported = t('common:notReported')

  return [
    {
      header: 'Företag',
      cell: (row) => row.cell.row.original.Name,
      accessorKey: 'Name',
    },
    {
      header: 'Egna utsläpp (tCO₂e)',
      cell: (row) => {
        const scope1n2Emissions = row.cell.row.original.Emissions.Scope1n2

        // console.log({ row, Emissions: row.cell.row.original.Emissions })
        // NOTE: The type does not match the actual values here.
        // TS thinks scope1n2Emissions has the type `CompanyScope`, but according to the logging above,
        // it is in fact just a number or null.
        const scope1n2String = Number.isFinite(scope1n2Emissions) ? formatter.format(scope1n2Emissions as unknown as number) : notReported
        return (
          <ScopeColumn isMissing={scope1n2String === notReported}>
            {scope1n2String}
          </ScopeColumn>
        )
      },
      accessorKey: 'Emissions.Scope1n2',
    },
    {
      header: () => 'Utsläpp i värdekedjan (tCO₂e)',
      cell: (row) => {
        const scope3Emissions = row.cell.row.original.Emissions.Scope3

        // console.log({ row, Emissions: row.cell.row.original.Emissions })
        // NOTE: The type does not match the actual values here.
        // TS thinks scope3Emissions has the type `CompanyScope`, but according to the logging above,
        // it is in fact just a number or null.
        const scope3String = Number.isFinite(scope3Emissions) ? formatter.format(scope3Emissions as unknown as number) : notReported
        return (
          <ScopeColumn isMissing={scope3String === notReported}>
            {scope3String}
          </ScopeColumn>
        )
      },
      accessorKey: 'Emissions.Scope3',
    },
  ]
}
