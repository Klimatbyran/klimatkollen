import React from 'react'
import { render, screen } from '@testing-library/react'
import SocialList from '../../../components/Footer/FooterSocialLinks'

describe('SocialList component', () => {
  beforeEach(() => {
    render(<SocialList />)
  })

  it('should render the email social list item', () => {
    const emailIcon = screen.getByAltText('Email icon')
    const emailLink = screen.getByText('Maila oss')
    expect(emailIcon).toBeInTheDocument()
    expect(emailLink).toHaveAttribute('href', 'mailto:hej@klimatkollen.se')
  })

  it('should render the Twitter social list item', () => {
    const twitterIcon = screen.getByAltText('X (Twitter) logo')
    const twitterLink = screen.getByText('X (Twitter)')
    expect(twitterIcon).toBeInTheDocument()
    expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/klimatkollen')
  })

  it('should render the LinkedIn social list item', () => {
    const linkedInIcon = screen.getByAltText('Linkedin logo')
    const linkedInLink = screen.getByText('LinkedIn')
    expect(linkedInIcon).toBeInTheDocument()
    expect(linkedInLink).toHaveAttribute('href', 'https://www.linkedin.com/company/klimatkollen/')
  })

  it('should render the GitHub social list item', () => {
    const gitHubIcon = screen.getByAltText('GitHub logo')
    const gitHubLink = screen.getByText('GitHub')
    expect(gitHubIcon).toBeInTheDocument()
    expect(gitHubLink).toHaveAttribute('href', 'https://github.com/Klimatbyran/klimatkollen')
  })
})
