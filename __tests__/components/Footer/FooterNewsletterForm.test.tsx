import { render, screen, fireEvent } from '@testing-library/react'
import NewsletterForm from '../../../components/Footer/FooterNewsletterForm'

describe('NewsletterForm component', () => {
  const mockOnValidated = vi.fn()

  beforeEach(() => {
    render(
      <NewsletterForm status={null} onValidated={mockOnValidated} />,
    )
  })

  it('should render without crashing', () => {
    const header = screen.getByText('Vill du få nyheter om Klimatkollen?')
    expect(header).toBeInTheDocument()
  })

  it('should display a placeholder text in email input', () => {
    const emailInput = screen.getByPlaceholderText('Ange mailadress')
    expect(emailInput).toBeInTheDocument()
  })

  it('should update email value on input change', () => {
    const emailInput = screen.getByPlaceholderText('Ange mailadress') as HTMLInputElement
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    expect(emailInput.value).toBe('test@example.com')
  })

  it('should call onValidated when form is submitted', () => {
    const emailInput = screen.getByPlaceholderText('Ange mailadress') as HTMLInputElement
    const form = screen.getByPlaceholderText('Ange mailadress')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.submit(form)

    expect(mockOnValidated).toHaveBeenCalledWith({ EMAIL: 'test@example.com' })
  })
})
