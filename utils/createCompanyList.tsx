import { ColumnDef } from '@tanstack/react-table'
import { Company } from './types'

export const companyColumns = (): ColumnDef<Company>[] => [
  {
    header: 'Ranking',
    cell: (row) => row.cell.row.index + 1,
    accessorKey: 'index',
  },
  {
    header: 'Namn',
    cell: (row: { renderValue: () => unknown }) => row.renderValue(),
    accessorKey: 'Name',
  },
  {
    header: () => 'Totala utsläpp (Mt CO2e)',
    cell: (row) => row.cell.row.original.Emissions.TotalEmissions,
    accessorKey: 'Emissions.TotalEmissions',
    sortingFn: (a, b) => a.original.Emissions.TotalEmissions - b.original.Emissions.TotalEmissions,
  },
]
