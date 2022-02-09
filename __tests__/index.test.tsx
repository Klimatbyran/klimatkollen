
import { render, screen } from '@testing-library/react'
import Home from '../pages'
import { Municipality } from '../utils/types'

describe('Home', () => {
  it('renders a heading', () => {
    let municipalities = Array<Municipality>()

    render(<Home municipalities={ municipalities } />)

    const heading = screen.getByRole('heading', {
      name: /Klimatkollen/i, 
    })

    expect(heading).toBeInTheDocument()
  })
})