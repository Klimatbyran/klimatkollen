import {
  Fragment, useEffect, useState,
} from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  SortingState,
  getSortedRowModel,
  Row,
  getExpandedRowModel,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

import { devices } from '../utils/devices'
import ArrowIcon from '../public/icons/arrow-right-bold-green.svg'

const StyledTable = styled.table`
  --margin: 4px;

  width: 100%;
  border-collapse: collapse;
  font-size: 0.8em;
  margin: var(--margin);
  margin-bottom: 0;

  @media only screen and (${devices.smallMobile}) {
    font-size: 0.85em;
  }
  
  @media only screen and (${devices.tablet}) {
    --margin: 8px;
    font-size: 1em;
  }

  .data-header {
    text-align: right;
  }

  .data-column {
    color: ${({ theme }) => theme.darkYellow};
    text-align: right;
  }

  thead::before {
    content: ' ';
    position: absolute;
    background: ${({ theme }) => theme.newColors.black2};
    width: 100%;
    height: var(--margin);
    top: calc(-1 * var(--margin));
    left: 0;
    right: 0;
    z-index: 40;
  }

  thead {
    background: ${({ theme }) => theme.newColors.black2};
    position: -webkit-sticky;
    position: sticky;
    top: calc(var(--header-offset) - (3 * var(--margin)));
    z-index: 40;

    @media only screen and (${devices.tablet}) {
      top: calc(var(--header-offset) - var(--margin));
    }
  }
`

const TableData = styled.td`
  padding: 8px 6px;
  max-width: 80px;

  @media only screen and (${devices.tablet}) {
    padding: 16px;
  }

  &:not(.data-column) {
    overflow-wrap: break-word;
  }
`

const TableHeader = styled.th`
  padding: 8px 6px;
  font-weight: 400;
  text-align: left;
  cursor: pointer;
  background: ${({ theme }) => theme.black};
  font-size: 0.75rem;
  z-index: 40;

  &:first-child {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  &:last-child {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  @media only screen and (${devices.smallMobile}) {
    font-size: 0.875rem;
  }

  @media only screen and (${devices.tablet}) {
    font-size: 1rem;
    padding: 12px 8px 12px 12px;
  }
`

const TableHeaderInner = styled.span`
  display: inline-grid;
  align-content: center;
  align-items: center;
  grid-template-columns: 1fr max-content;
`

const TableRow = styled.tr<{ interactive?: boolean, showBorder?: boolean, isExpanded?: boolean }>`
  border-bottom: ${({ showBorder, theme }) => (showBorder ? `1px solid ${theme.midGreen}` : '')};
  cursor: ${({ interactive }) => (interactive ? 'pointer' : '')};
  background: ${({ isExpanded, theme }) => (isExpanded ? `${theme.black}88` : '')};
  z-index: 10;
`

const SortingIcon = styled(ArrowIcon)`
  color: ${({ theme }) => theme.midGreen};
`

type TableProps<T extends object> = {
  data: T[]
  columns: ColumnDef<T>[]
  routeString?: string
  // IDEA: It might be better to turn ComparisionTable into two specific components, one for every use case
  dataType?: 'municipalities' | 'companies'
  renderSubComponent?: ({ row }: { row: Row<T> }) => JSX.Element
}

/**
 * Make sure the first column has an id, and prepare default sorting.
 */
function prepareColumnsForDefaultSorting<T extends object>(columns: TableProps<T>['columns']) {
  const preparedColumns = columns[0].id
    ? columns
    // @ts-expect-error accessorKey does exist, but there's a type error somewhere.
    : [{ ...columns[0], id: (columns[0].accessorKey).replace('.', '_') }, ...columns.slice(1)]

  const defaultSorting = [{ id: preparedColumns[0].id!, desc: false }]

  return { preparedColumns, defaultSorting }
}

function ComparisonTable<T extends object>({
  data,
  columns,
  routeString,
  dataType = 'municipalities',
  renderSubComponent,
}: TableProps<T>) {
  const { preparedColumns, defaultSorting } = prepareColumnsForDefaultSorting(columns)
  const [sorting, setSorting] = useState<SortingState>(defaultSorting)
  const router = useRouter()
  const [resizeCount, setResizeCount] = useState(0)

  useEffect(() => {
    const handleResize = () => setResizeCount((count) => count + 1)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const enableExpanding = typeof renderSubComponent === 'function'

  const isDataColumn = (index: number) => {
    if (dataType === 'companies') {
      return index > 0
    }

    return index > 1
  }

  const table = useReactTable({
    data,
    columns: preparedColumns,
    state: { sorting },
    onSortingChange: setSorting,
    enableExpanding,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    enableSortingRemoval: false,
  })

  const handleRowClick = (row: Row<T>) => {
    if (dataType === 'municipalities') {
      if (routeString) {
        const cells = row.getAllCells()
        const value = cells.at(1)?.renderValue()
        const route = `/${routeString}/${(value as unknown as string).toLowerCase()}`
        router.push(route)
      }
    } else if (dataType === 'companies') {
      row.toggleExpanded()
    }
  }

  return (
    <StyledTable key={resizeCount}>
      {/* HACK: prevent table headers from changing size when toggling table rows. Not sure what causes the problem, but this fixes it. */}
      {dataType === 'companies' ? (
        <colgroup>
          <col width="35%" />
          <col width="30%" />
          <col width="35%" />
        </colgroup>
      ) : null}

      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const currentSort = header.column.getIsSorted()
              return (
                // TODO: Ensure clicking table headers doesn't scroll to top.
                // It almost seems like this could be by the table losing all its content
                // just before re-rendering it. And since the table (or page) doesn't need as much scroll anymore,
                // maybe it just shows the top of the table then again?
                <TableHeader
                  key={header.id}
                  colSpan={header.colSpan}
                  className={isDataColumn(header.index) ? 'data-header' : ''}
                  onClick={header.column.getToggleSortingHandler()}
                  onKeyDown={header.column.getToggleSortingHandler()}
                >
                  <TableHeaderInner data-sorting={header.column.getIsSorted()}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    {currentSort ? (
                      <SortingIcon
                        style={{ transform: `scale(0.6) rotate(${currentSort === 'desc' ? '' : '-'}90deg)` }}
                      />
                    ) : null}
                  </TableHeaderInner>
                </TableHeader>
              )
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => {
          const isRowExpanded = enableExpanding && row.getIsExpanded()
          return (
            <Fragment key={row.id}>
              <TableRow
                onClick={() => handleRowClick(row)}
                interactive={enableExpanding || routeString !== undefined}
                showBorder={enableExpanding ? !isRowExpanded : true}
                isExpanded={isRowExpanded}
                aria-expanded={isRowExpanded}
              >
                {row.getVisibleCells().map((cell, index) => (
                  <TableData key={cell.id} className={isDataColumn(index) ? 'data-column' : ''}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableData>
                ))}
              </TableRow>
              {isRowExpanded && (
                <TableRow showBorder>
                  <td colSpan={row.getVisibleCells().length}>
                    {renderSubComponent({ row })}
                  </td>
                </TableRow>
              )}
            </Fragment>
          )
        })}
      </tbody>
    </StyledTable>
  )
}

export default ComparisonTable
