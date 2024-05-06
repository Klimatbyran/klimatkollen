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
  Header,
  getExpandedRowModel,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

import { devices } from '../utils/devices'

const StyledTable = styled.table`
  width: 98%;
  margin-left: 1%;
  overflow-y: auto;
  border-collapse: collapse;

  @media only screen and (${devices.mobile}) {
    font-size: 0.8em;
  }

  #first-header {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  #third-header {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  .data-header {
    text-align: right;
  }

  .data-column {
    color: ${({ theme }) => theme.darkYellow};
    text-align: right;
  }
`

const TableData = styled.td`
  padding: 8px 6px;
  max-width: 80px;
  border-bottom: 1px solid ${({ theme }) => theme.midGreen};

  @media only screen and (${devices.tablet}) {
    padding: 16px;
  }
`

const TableHeader = styled.th`
  padding: 12px 6px;
  background: ${({ theme }) => theme.black};
  position: sticky;
  top: 0;
  font-weight: bold;
  text-align: left;
  cursor: pointer;

  @media only screen and (${devices.tablet}) {
    padding: 16px 8px 16px 12px;
  }
`

const TableRow = styled.tr<{ redirect: boolean }>`
  border-bottom: 1px solid ${({ theme }) => theme.midGreen};
  :hover {
    cursor: ${({ redirect }) => (redirect ? 'pointer' : 'default')};
  }
`

type TableProps<T extends object> = {
  data: T[]
  columns: ColumnDef<T>[]
  routeString?: string
  // IDEA: It might be better to turn ComparisionTable into two specific components, one for every use case
  dataType?: 'municipalities' | 'companies'
  renderSubComponent?: ({ row }: { row: Row<T> }) => JSX.Element
  getRowCanExpand?: (row: Row<T>) => boolean
}

function ComparisonTable<T extends object>({
  data,
  columns,
  routeString,
  dataType = 'municipalities',
  renderSubComponent,
  getRowCanExpand,
}: TableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const router = useRouter()

  const [resizeCount, setResizeCount] = useState(0)
  // const [expanded, setExpanded] = useState<ExpandedState>({})

  useEffect(() => {
    const handleResize = () => setResizeCount((count) => count + 1)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const enableExpanding = typeof renderSubComponent === 'function'

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    enableExpanding,
    getRowCanExpand,
    // onExpandedChange: (updater) => {
    //   console.log('onExpandedChange companies expand toggle')
    //   const newExpanded = typeof updater === 'function' ? updater(expanded) : updater
    //   setExpanded(newExpanded)
    // },
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

      // TODO: Maybe we can reuse this in many places?
      // const handleToggle = row.getToggleExpandedHandler()
      // handleToggle()

      // console.log('onClick companies expand toggle')
      // toggle expanded state for the selected row
      // const newExpanded = !expanded
      // row.toggleExpanded(newExpanded)
      // setExpanded(newExpanded)
    }
  }

  const renderHeader = (header: Header<T, unknown>, index: number) => {
    const lastOrMiddleHeader = index === header.headerGroup.headers.length - 1 ? 'third-header' : 'second-header'

    return (
      <TableHeader
        key={header.id}
        colSpan={header.colSpan}
        className={header.index > 1 ? 'data-header' : ''}
        id={index === 0 ? 'first-header' : lastOrMiddleHeader}
        onClick={header.column.getToggleSortingHandler()}
        onKeyDown={header.column.getToggleSortingHandler()}
      >
        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
      </TableHeader>
    )
  }

  return (
    <StyledTable key={resizeCount}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header, index) => renderHeader(header, index))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          // TODO: Make it obvious that rows can be expanded. We need to have a toggle button for each row. Or use WAI-ARIA attributes
          <Fragment key={row.id}>
            <TableRow
              onClick={() => handleRowClick(row)}
              redirect={routeString !== undefined}
            >
              {row.getVisibleCells().map((cell, columnIndex) => (
                <TableData key={cell.id} className={columnIndex > 1 ? 'data-column' : ''}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableData>
              ))}
            </TableRow>
            {enableExpanding && row.getIsExpanded() && (
            <tr>
              <td colSpan={row.getVisibleCells().length}>
                {renderSubComponent({ row })}
              </td>
            </tr>
            )}
          </Fragment>
        ))}
      </tbody>
    </StyledTable>
  )
}

export default ComparisonTable
