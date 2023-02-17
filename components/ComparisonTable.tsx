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
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'


const StyledTable = styled.table`
    overflow-y: auto;
    width: 100%;
    border-collapse: collapse;
`

const TableData = styled.td`
    padding: 0.5rem 2rem 0.2rem 0.87rem;  
`

const TableHeading = styled.th`
    padding: 1.2rem 2rem 0.2rem 0.87rem;  
    fontWeight: bold;
    text-align: left; 
`

const TableRow = styled.tr`
    :hover {
        background-color: ${({ theme }) => theme.dark};
        cursor: pointer;
    }
`

interface Props<T extends object> {
    data: T[]
    columns: ColumnDef<T>[]
}

const ComparisonTable = <T extends object>({ data, columns }: Props<T>) => {
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
        const url = typeof value === 'string' ? `/kommuner/kommun/${value.toLowerCase()}` : '/404'
        router.push(url)
    }

    return (
        <StyledTable>
            {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                        return (
                            <TableHeading key={header.id} colSpan={header.colSpan}>
                                {header.isPlaceholder ? null : (
                                    <div
                                        {...{
                                            className: header.column.getCanSort()
                                                ? 'cursor-pointer select-none'
                                                : '',
                                            onClick: header.column.getToggleSortingHandler(),
                                        }}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        {{
                                            asc: ' ↑',
                                            desc: ' ↓',
                                        }[header.column.getIsSorted() as string] ?? null}
                                    </div>
                                )}
                            </TableHeading>
                        )
                    })}
                </tr>
            ))}
            <tbody>
                {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} onClick={() => handleRowClick(row)}>
                        {row.getVisibleCells().map((cell) => (
                            <TableData key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableData>
                        ))}
                    </TableRow>
                ))}
            </tbody>
        </StyledTable>
    );
}

export default ComparisonTable