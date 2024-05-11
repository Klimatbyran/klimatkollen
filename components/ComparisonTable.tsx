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
  width: 98%;
  margin-left: 1%;
  overflow-y: auto;
  border-collapse: collapse;

  font-size: 0.7em;

  @media only screen and (${devices.smallMobile}) {
    font-size: 0.8em;
  }

  @media only screen and (${devices.tablet}) {
    font-size: 1em;
  }

  .data-header {
    text-align: right;
  }

  .data-column {
    color: ${({ theme }) => theme.darkYellow};
    text-align: right;
  }

  thead {
    background: ${({ theme }) => theme.lightBlack};
    position: sticky;
    top: 0;
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
  font-size: 0.75rem;

  &:first-child {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  &:last-child {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  @media only screen and (${devices.smallMobile}) {
    padding: 12px 6px;
  }

  @media only screen and (${devices.tablet}) {
    font-size: 0.875rem;
    padding: 16px 8px 16px 12px;
  }
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

function ComparisonTable<T extends object>({
  data,
  columns,
  routeString,
  dataType = 'municipalities',
  renderSubComponent,
}: TableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
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
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    enableExpanding,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
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
          <col width="28%" />
          <col width="37%" />
        </colgroup>
      ) : null}

      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHeader
                key={header.id}
                colSpan={header.colSpan}
                className={isDataColumn(header.index) ? 'data-header' : ''}
                onClick={header.column.getToggleSortingHandler()}
                onKeyDown={header.column.getToggleSortingHandler()}
              >
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHeader>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => {
          const isRowExpanded = enableExpanding && row.getIsExpanded()
          return (
          // TODO: Make it obvious that rows can be expanded. We need to have a toggle button for each row. Or use WAI-ARIA attributes
            <Fragment key={row.id}>
              <TableRow
                onClick={() => handleRowClick(row)}
                interactive={enableExpanding || routeString !== undefined}
                showBorder={enableExpanding ? !isRowExpanded : true}
                isExpanded={isRowExpanded}
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
