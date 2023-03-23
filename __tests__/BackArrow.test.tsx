import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import BackArrow, { BackArrowProps } from './../components/BackArrow'
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

describe('BackArrow', () => {
  const defaultProps: BackArrowProps = {
    route: '/previous-page',
  }

  it('renders correctly', () => {
    render(<BackArrow {...defaultProps} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /arrow-left/i })).toBeInTheDocument()
  })

  it('navigates to the correct route when clicked', () => {
    const mockRouterPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    })

    render(<BackArrow {...defaultProps} />)
    userEvent.click(screen.getByRole('button'))

    expect(mockRouterPush).toHaveBeenCalledTimes(1)
    expect(mockRouterPush).toHaveBeenCalledWith(defaultProps.route)
  })
})