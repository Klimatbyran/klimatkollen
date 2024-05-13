import { Fragment, useEffect, useState } from 'react'
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

const StyledTable = styled.table`
  --margin: 4px;

  width: 100%;
  overflow-y: auto;
  border-collapse: collapse;
  font-size: 0.7em;
  margin: var(--margin);
  margin-bottom: 0;

  @media only screen and (${devices.smallMobile}) {
    font-size: 0.8em;
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
    background: ${({ theme }) => theme.lightBlack};
    width: 100%;
    height: var(--margin);
    top: calc(-1 * var(--margin));
    left: 0;
    right: 0;
    z-index: -40;
  }

  thead {
    background: ${({ theme }) => theme.lightBlack};
    position: sticky;
    top: var(--margin);
    z-index: 30;
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
  font-weight: bold;
  text-align: left;
  cursor: pointer;
  background: ${({ theme }) => theme.black};
  font-size: 0.6rem;

  &:first-child {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  &:last-child {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  @media only screen and (${devices.smallMobile}) {
    font-size: 0.65rem;
  }

  @media only screen and (${devices.tablet}) {
    font-size: 0.875rem;
    padding: 16px 8px 16px 12px;
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
                      <img
                        src="/icons/arrow-right-bold-green.svg"
                        style={{ transform: `scale(0.6) rotate(${currentSort === 'desc' ? '' : '-'}90deg)` }}
                        alt=""
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
