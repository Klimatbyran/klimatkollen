import React from 'react'
import { render, screen } from '@testing-library/react'
import NewsletterSubscribe from '../../../components/Footer/FooterNewsletterSubscribe'

// Mock NewsletterForm
vi.mock('../FooterNewsletterForm', () => ({ default: () => <div placeholder="mockNewsletterForm" /> }))

describe('NewsletterSubscribe component', () => {
  // FIXME this test needs to be updated, not working atm
  // it('should throw an error if the Mailchimp URL is undefined', () => {
  //   // Setup environment variable to undefined
  //   process.env.NEXT_PUBLIC_MAILCHIMP_URL = undefined
  //   expect(() => render(<NewsletterSubscribe />)).toThrow('Must have a mailchimp URL')
  // })

  it('should render without error if Mailchimp URL is set', () => {
    render(<NewsletterSubscribe />)

    const newsletterForm = screen.getByText('Vill du få nyheter om Klimatkollen?')
    expect(newsletterForm).toBeInTheDocument()
  })
})
