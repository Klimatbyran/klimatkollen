import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { useRouter } from 'next/router'
import {
  Row,
  Header,
} from '@tanstack/react-table'
import ComparisonTable from '../../components/ComparisonTable'

// Mock the useRouter and push methods
vi.mock('next/router', () => ({
  useRouter() {
    return {
      push: vi.fn(),
    }
  },
}))

describe('ComparisonTable Component', () => {
  let mockPush: jest.Mock
  let data: Row<{id: number, name: string, value: number}>[]
  type ColumnDef<T> = {
    Header: string
    accessor: keyof T
  }

  let columns: ColumnDef<{id: number, name: string, value: number}>[]
  columns = [
    {
      Header: 'ID',
      accessor: 'id',
    },
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Value',
      accessor: 'value',
    },
  ]

  beforeEach(() => {
    mockPush = vi.fn()
    useRouter.mockReturnValue({ push: mockPush })

    data = [
      { id: 1, name: 'Item1', value: 10 },
      { id: 2, name: 'Item2', value: 20 },
    ]

    columns = [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Value',
        accessor: 'value',
      },
    ]
  })

  it('should render table headers', () => {
    render(<ComparisonTable data={data} columns={columns} />)

    const header1 = screen.getByText('ID')
    const header2 = screen.getByText('Name')
    const header3 = screen.getByText('Value')

    expect(header1).toBeInTheDocument()
    expect(header2).toBeInTheDocument()
    expect(header3).toBeInTheDocument()
  })

  it('should render table rows', () => {
    render(<ComparisonTable data={data} columns={columns} />)

    const row1 = screen.getByText('Item1')
    const row2 = screen.getByText('Item2')

    expect(row1).toBeInTheDocument()
    expect(row2).toBeInTheDocument()
  })

  it('should navigate on row click', () => {
    render(<ComparisonTable data={data} columns={columns} />)

    const row = screen.getByText('Item1')
    fireEvent.click(row)

    expect(mockPush).toHaveBeenCalledWith('/kommun/item1')
  })

  // Add more tests as needed
})
