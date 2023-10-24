import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import ShareButton from '../../components/Button'

describe('ShareButton Component', () => {
  it('should render the ShareButton with the correct text', () => {
    const text = 'Share This'
    render(<ShareButton text={text} />)

    const buttonElement = screen.getByRole('button')

    expect(buttonElement).toBeInTheDocument()
    expect(buttonElement).toHaveTextContent(text)
  })

  it('should call handleClick when clicked', () => {
    const handleClick = vi.fn()
    const text = 'Share This'

    render(<ShareButton text={text} handleClick={handleClick} />)

    const buttonElement = screen.getByRole('button')

    fireEvent.click(buttonElement)

    expect(handleClick).toHaveBeenCalled()
  })
})
