import React from 'react'
import { render, screen } from '@testing-library/react'
import Partners from '../../../components/Footer/FooterPartners'

describe('Partners component', () => {
  beforeEach(() => {
    render(<Partners />)
  })

  it('should render all partner links', () => {
    const links = screen.getAllByRole('link')
    expect(links.length).toBe(4)

    // Checking partner URL
    expect(links[0]).toHaveAttribute('href', 'https://www.climateview.global/')
    expect(links[1]).toHaveAttribute('href', 'https://researchersdesk.se/')
    expect(links[2]).toHaveAttribute('href', 'https://www.klimatklubben.se/')
    expect(links[3]).toHaveAttribute('href', 'https://exponentialroadmap.org/')
  })

  it('should render all partner images with correct alt text', () => {
    const images = screen.getAllByRole('img')
    expect(images.length).toBe(4)

    // Checking image alt text
    expect(images[0]).toHaveAttribute('alt', 'ClimateView logo')
    expect(images[1]).toHaveAttribute('alt', 'Researchers desk logo')
    expect(images[2]).toHaveAttribute('alt', 'Klimatklubben logo')
    expect(images[3]).toHaveAttribute('alt', 'Exponential Roadmap logo')
  })
})
