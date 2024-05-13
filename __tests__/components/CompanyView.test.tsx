// NOTE: This is a bit special since we need the StartPage even though we only want to test a part of that page.

import { render, screen, act } from '@testing-library/react'

import StartPage from '../../pages/index'
import StyledComponentsWrapper from '../utils/StyledComponentsWrapper'

vi.mock('next-i18next', () => ({
  useTranslation: vi.fn(() => ({
    t: (str: string) => str,
  })),
}))

vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    query: {
      dataGroup: 'foretag',
      dataset: 'utslappen',
      dataView: 'lista',
    },
    asPath: '',
    route: '/',
  }),
}))

const mockCompanies = [
  {
    Name: 'Company name',
    Url: 'company-url',
    Comment: 'Scope 3 emissions are missing key categories.',
    Emissions: {
      Scope1n2: 214726,
      Scope3: 7312410,
    },
  },
]

describe('CompanyView', () => {
  beforeEach(() => {
    act(() => {
      render(
        // @ts-expect-error Temporary type error due to type mismatch compared to the data structure we expect in the near future.
        <StartPage municipalities={[]} companies={mockCompanies} />,
        { wrapper: StyledComponentsWrapper },
      )
    })
  })

  it('renders without crashing', () => {
    expect(screen.getByText(/startPage:companyView.questionTitle/)).toBeInTheDocument()
  })
})
