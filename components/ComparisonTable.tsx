import { useState } from 'react'
import { useRouter } from 'next/router'

import styled from 'styled-components'
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  SortingState,
  getSortedRowModel,
  Row,
  Header,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import { devices } from '../utils/devices'

const StyledTable = styled.table`
  width: 98%;
  margin-left: 1%;
  margin-top: 8px;
  overflow-y: auto;
  border-collapse: collapse;

  @media only screen and (${devices.mobile}) {
    font-size: 0.8em;
    margin-top: 30px;
  }

  .data-header {
    text-align: right;
  }

  #first-header {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  #last-header {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  .data-column {
    color: ${({ theme }) => theme.darkYellow};
    text-align: right;
  }
`

const TableData = styled.td`
  padding: 1rem;
  overflow: hidden;
  border-bottom: 1px solid ${({ theme }) => theme.midGreen};

  @media only screen and (${devices.mobile}) {
    padding: 0.75rem;
  }
`

const TableHeader = styled.th`
  padding: 1rem;
  background: ${({ theme }) => theme.black};
  position: sticky;
  top: 0;
  font-weight: bold;
  text-align: left;
`

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.midGreen};
  :hover {
    cursor: pointer;
  }
`

type TableProps<T extends object> = {
  data: T[]
  columns: ColumnDef<T>[]
}

function ComparisonTable<T extends object>({ data, columns }: TableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const router = useRouter()

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const handleRowClick = (row: Row<T>) => {
    const cells = row.getAllCells()
    const value = cells.at(1)?.renderValue()
    const route = typeof value === 'string' ? `/kommun/${value.toLowerCase()}` : '/404'
    router.push(route)
  }

  const renderHeader = (header: Header<T, unknown>, index: number) => (
    <TableHeader
      key={header.id}
      colSpan={header.colSpan}
      className={header.index > 1 ? 'data-header' : ''}
      // eslint-disable-next-line no-nested-ternary
      id={index === 0 ? 'first-header' : index === header.headerGroup.headers.length - 1 ? 'last-header' : ''}
    >
      {header.isPlaceholder ? null : (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        <div
          {...{
            className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
            onClick: header.column.getToggleSortingHandler(),
            onKeyDown: header.column.getToggleSortingHandler(),
          }}
        >
          {flexRender(header.column.columnDef.header, header.getContext())}
        </div>
      )}
    </TableHeader>
  )

  return (
    <StyledTable>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header, index) => renderHeader(header, index))}
        </tr>
      ))}
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} onClick={() => handleRowClick(row)}>
            {row.getVisibleCells().map((cell, columnIndex) => (
              <TableData key={cell.id} className={columnIndex > 1 ? 'data-column' : ''}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableData>
            ))}
          </TableRow>
        ))}
      </tbody>
    </StyledTable>
  )
}

export default ComparisonTable
