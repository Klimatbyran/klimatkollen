import styled from 'styled-components'
import { ColumnDef } from '@tanstack/react-table'
import { Company } from './types'

const ScopeColumn = styled.span<{ isMissing: boolean }>`
  color: ${({ isMissing, theme }) => (isMissing ? 'gray' : theme.darkYellow)};
  font-style: ${({ isMissing }) => (isMissing ? 'italic' : 'normal')};
`

export const companyColumns = (): ColumnDef<Company>[] => [
  {
    header: 'Företag',
    cell: (row) => {
      const company = row.cell.row.original
      return company.Url ? (
        <a
          href={company.Url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ cursor: 'pointer' }}
        >
          {company.Name}
        </a>
      ) : (
        <span>{company.Name}</span>
      )
    },
    accessorKey: 'Name',
  },
  {
    header: 'Egna utsläpp (tCO₂e)',
    cell: (row) => {
      const scope1n2Emissions = row.cell.row.original.Emissions.Scope1n2
      const scope1n2String = scope1n2Emissions ? scope1n2Emissions.toString() : 'Ej rapporterat'
      return (
        <ScopeColumn isMissing={!scope1n2Emissions}>
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
      const scope3String = scope3Emissions ? scope3Emissions.toString() : 'Ej rapporterat'
      return (
        <ScopeColumn isMissing={!scope3Emissions}>
          {scope3String}
        </ScopeColumn>
      )
    },
    accessorKey: 'Emissions.Scope3',
  },
]
