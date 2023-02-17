import { useState } from 'react'
import { useRouter } from 'next/router'

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
        overflow-y: auto;
    
        td, th {
            padding: 0.5rem 2rem 0.2rem 0.87rem;
        }

        th {
            padding-top: 1.2rem;
            fontWeight: bold;
            text-align: left;
        }
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
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    const handleRowClick = (row) => {
        router.push(`/kommuner/kommun/${row.original.id}`);
    }

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
                        <tr key={row.id} onClick={() => handleRowClick(row)}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>
                                    <a href="hjej">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </a>
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