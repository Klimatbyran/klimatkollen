import { render, screen } from '@testing-library/react'
import Footer from '../../../components/Footer/Footer'

describe('Footer component', () => {
  it('should render without crashing', () => {
    render(
      <Footer />,
    )
    expect(screen.getByText('Samarbetspartners')).toBeInTheDocument()
  })

  it('should display the newsletter subscription', () => {
    render(
      <Footer />,
    )
    // Assuming you add data-testid="newsletter-subscribe" to your NewsletterSubscribe component
    const newsletterElement = screen.getByText('Vill du få nyheter om Klimatkollen?')
    expect(newsletterElement).toBeInTheDocument()
  })

  it('should display partners', () => {
    render(
      <Footer />,
    )
    expect(screen.getByAltText('Postkodstiftelsen logo')).toBeInTheDocument()
  })

  it('should display tagline', () => {
    render(
      <Footer />,
    )
    expect(screen.getByText('Klimatkollen är en medborgarplattform som tillgängliggör klimatdata')).toBeInTheDocument()
  })

  it('should display the copyright text', () => {
    render(
      <Footer />,
    )
    expect(screen.getByText(/CC BY-SA/)).toBeInTheDocument()
  })

  it('should display logo', () => {
    render(
      <Footer />,
    )
    expect(screen.getByAltText('Klimatkollen logo')).toBeInTheDocument()
  })

  it('should display SoMe links', () => {
    render(
      <Footer />,
    )
    expect(screen.getByText('Maila oss')).toBeInTheDocument()
    expect(screen.getByAltText('Linkedin logo')).toBeInTheDocument()
  })
})
