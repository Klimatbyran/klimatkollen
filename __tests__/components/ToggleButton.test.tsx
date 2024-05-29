import { render, fireEvent, screen } from '@testing-library/react'
import ToggleButton from '../../components/ToggleButton'
import StyledComponentsWrapper from '../utils/StyledComponentsWrapper'

describe('ToggleButton', () => {
  it('should render the ToggleButton component', () => {
    const { container } = render(<ToggleButton text="Test" icon={<span>Icon</span>} />, { wrapper: StyledComponentsWrapper })
    expect(container).toBeInTheDocument()
  })

  it('should render the text provided', () => {
    render(<ToggleButton text="Test" icon={<span>Icon</span>} />, { wrapper: StyledComponentsWrapper })
    const textElement = screen.getByText('Test')
    expect(textElement).toBeInTheDocument()
  })

  it('should render the icon provided', () => {
    render(<ToggleButton text="Test" icon={<span>Icon</span>} />, { wrapper: StyledComponentsWrapper })
    const iconElement = screen.getByText('Icon')
    expect(iconElement).toBeInTheDocument()
  })

  it('should call handleClick when clicked', () => {
    const handleClick = vi.fn()
    render(<ToggleButton text="Test" icon={<span>Icon</span>} handleClick={handleClick} />, { wrapper: StyledComponentsWrapper })
    const buttonElement = screen.getByRole('button')
    fireEvent.click(buttonElement)
    expect(handleClick).toHaveBeenCalled()
  })
})
