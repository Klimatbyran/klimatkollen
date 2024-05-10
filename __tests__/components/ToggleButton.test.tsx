import { render, fireEvent, screen } from '@testing-library/react'
import ToggleButton from '../../components/ToggleButton'

describe('ToggleButton', () => {
  it('should render the ToggleButton component', () => {
    const { container } = render(<ToggleButton text="Test" icon={<span>Icon</span>} />)
    expect(container).toBeTruthy()
  })

  it('should render the text provided', () => {
    render(<ToggleButton text="Test" icon={<span>Icon</span>} />)
    const textElement = screen.getByText('Test')
    expect(textElement).toBeTruthy()
  })

  it('should render the icon provided', () => {
    render(<ToggleButton text="Test" icon={<span>Icon</span>} />)
    const iconElement = screen.getByText('Icon')
    expect(iconElement).toBeTruthy()
  })

  it('should call handleClick when clicked', () => {
    const handleClick = vi.fn()
    render(<ToggleButton text="Test" icon={<span>Icon</span>} handleClick={handleClick} />)
    const buttonElement = screen.getByRole('button')
    fireEvent.click(buttonElement)
    expect(handleClick).toHaveBeenCalled()
  })
})
