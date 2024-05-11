import styled from 'styled-components'
import { ColumnDef, Row } from '@tanstack/react-table'
import { TFunction } from 'i18next'

import { Company } from './types'
import ArrowSvg from '../public/icons/arrow-down-round.svg'
import { colorTheme } from '../Theme'

const Arrow = styled(ArrowSvg)<{ open: boolean }>`
  transform: rotate(${(props) => (props.open ? '180deg' : '0')});

  & path {
    fill: ${(props) => (props.open ? colorTheme.lightGreen : colorTheme.offWhite)};
  }
`

// IDEA: do something similar for the regional view to distinguish between actual important data (orange), and when something is missing (gray)
const ScopeColumn = styled.div<{ isMissing: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ isMissing, theme }) => (isMissing ? 'gray' : theme.darkYellow)};
  font-style: ${({ isMissing }) => (isMissing ? 'italic' : 'normal')};

  .expandable {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`

const formatter = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 0 })

const getCustomSortFn = ({
  stringsOnTop = false,
  sortAscending = false,
  scope = 'Scope1n2',
}: {
  stringsOnTop?: boolean,
  sortAscending?: boolean,
  scope?: keyof Company['Emissions'],
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
    return stringsOnTop ? (aIsNaN ? -1 : 1) : (aIsNaN ? 1 : -1)
  }

  // Sort non-NaN values normally
  // @ts-expect-error treat Date objects as numbers since they can be compared like numbers.
  return sortAscending ? a - b : b - a
}

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
      sortingFn: getCustomSortFn({ scope: 'Scope1n2' }),
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
          <ScopeColumn isMissing={scope3String === notReported} className="expandable">
            {scope3String}
            <Arrow open={row.cell.row.getIsExpanded()} />
          </ScopeColumn>
        )
      },
      sortingFn: getCustomSortFn({ scope: 'Scope3' }),
      accessorKey: 'Emissions.Scope3',
    },
  ]
}
