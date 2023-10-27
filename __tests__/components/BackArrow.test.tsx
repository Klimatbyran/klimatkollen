import React from 'react'
import { render, screen } from '@testing-library/react'
import BackArrow from '../../components/BackArrow'

vi.mock('../../public/icons/arrow-left.svg', () => ({ default: 'svg' }))

describe('BackArrow', () => {
  it('should render the BackArrow with the correct route', () => {
    const route = '/some-route'
    render(<BackArrow route={route} />)

    const linkElement = screen.getByRole('link')

    expect(linkElement).toBeInTheDocument()
    expect(linkElement).toHaveAttribute('href', route)
  })
})
