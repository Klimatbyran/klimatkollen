import React from 'react'
import styled from 'styled-components'
import {
    getCoreRowModel,
    useReactTable,
    flexRender,
    SortingState,
    getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

const Styles = styled.div`    
    table {
        border-spacing: 0;
    
        th, td {
            padding: 0.5rem;
            border-bottom: 1px solid ${({ theme }) => theme.paperWhite};
        }

        th {
            fontWeight: bold;
        }
    }
`

interface ReactTableProps<T extends object> {
    data: T[]
    columns: ColumnDef<T>[]
}

const ComparisonTable = <T extends object>({ data, columns }: ReactTableProps<T>) => {
    /* FIXME
    - tabell ska fylla parent
    - tabell ska stanna i parent
    - tabellhuvud ska align left
    - index baserat på sort ska visas
     */
    
    const [sorting, setSorting] = React.useState<SortingState>([])

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    return (
        <Styles>
            <table>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            return (
                                <th key={header.id} colSpan={header.colSpan}>
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
                                </th>
                            )
                        })}
                    </tr>
                ))}
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} >
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </Styles>
    );
}

export default ComparisonTable