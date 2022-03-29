import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '../pages'
import { useRouter } from 'next/router'
import { SpyInstanceFn } from 'vitest'

vi.mock('../public/icons/arrow-down.svg', () => ({ default: 'svg' }))
vi.mock('../public/icons/arrow-right-white.svg', () => ({ default: 'svg' }))
vi.mock('../public/icons/arrow-right-green.svg', () => ({ default: 'svg' }))
vi.mock('../public/icons/arrow.svg', () => ({ default: 'svg' }))
vi.mock('../components/Map', () => ({
  default: function () {
    return <div />
  },
}))
vi.mock('next/router')

const setup = () => {
  return render(
    <Home
      municipalities={[
        {
          County: '',
          CoatOfArmsImage: null,
          Population: null,
          Image: null,
          Budget: {
            BudgetPerYear: [],
            CO2Equivalent: 0,
            PercentageOfNationalBudget: 0,
          },
          PoliticalRule: [],
          EmissionTrend: {
            TrendPerYear: [],
          },
          HistoricalEmission: {
            AverageEmissionChangeRank: 0,
            LargestEmissionSectors: [],
            EmissionPerYear: [],
            EmissionLevelChangeAverage: 0,
          },
          Name: 'Sollentuna',
        },
      ]}
    />,
  )
}

beforeEach(vi.clearAllMocks)

test('renders logo and subtitle', () => {
  setup()

  expect(screen.getByText(/Få koll på Sveriges klimatomställning/i)).toBeInTheDocument()
  expect(screen.getByAltText(/Klimatkollen/i)).toBeInTheDocument()
})

test('dropdown shows error text if nothing is selected', () => {
  vi.useFakeTimers()

  setup()

  userEvent.click(screen.getByLabelText(/visa kommun/i))

  expect(screen.getByText(/välj en kommun i listan/i)).toBeInTheDocument()

  vi.runOnlyPendingTimers()

  // Error text disappears after two seconds
  expect(screen.queryByText(/välj en kommun i listan/i)).not.toBeInTheDocument()
})

test('dropdown closes when clicking outside', () => {
  const router = {
    push: vi.fn(),
  }

  ;(useRouter as SpyInstanceFn).mockReturnValue(router)

  setup()

  userEvent.type(screen.getByLabelText(/hur går det i din kommun/i), 'llen')

  // Opens dropdown
  expect(screen.getByText(/sollentuna/i)).toBeInTheDocument()

  // Click outside
  userEvent.click(screen.getByText(/få koll på sveriges klimatomställning/i))

  // Dropdown is closed
  expect(screen.queryByText(/sollentuna/i)).not.toBeInTheDocument()
  expect(router.push).not.toHaveBeenCalled()
})

test('dropdown handles selecting from list', () => {
  const router = {
    push: vi.fn(),
  }

  ;(useRouter as SpyInstanceFn).mockReturnValue(router)

  setup()

  userEvent.type(screen.getByLabelText(/hur går det i din kommun/i), 'llen')
  userEvent.click(screen.getByText(/sollentuna/i))
  userEvent.click(screen.getByLabelText(/visa kommun/i))

  expect(router.push).toHaveBeenCalledWith('/kommun/sollentuna')
})

test('dropdown handles typing and clicking the green arrow', () => {
  const router = {
    push: vi.fn(),
  }

  ;(useRouter as SpyInstanceFn).mockReturnValue(router)

  setup()

  userEvent.type(screen.getByLabelText(/hur går det i din kommun/i), 'Sollentuna')
  userEvent.click(screen.getByLabelText(/visa kommun/i))

  expect(router.push).toHaveBeenCalledWith('/kommun/sollentuna')
})

test('dropdown handles typing with lowercase letters and clicking the green arrow', () => {
  const router = {
    push: vi.fn(),
  }

  ;(useRouter as SpyInstanceFn).mockReturnValue(router)

  setup()

  userEvent.type(screen.getByLabelText(/hur går det i din kommun/i), 'sollentuna')
  userEvent.click(screen.getByLabelText(/visa kommun/i))

  expect(router.push).toHaveBeenCalledWith('/kommun/sollentuna')
})

test('dropdown handles typing and pressing enter', () => {
  const router = {
    push: vi.fn(),
  }

  ;(useRouter as SpyInstanceFn).mockReturnValue(router)

  setup()

  userEvent.type(screen.getByLabelText(/hur går det i din kommun/i), 'sollentuna{Enter}')

  expect(router.push).toHaveBeenCalledWith('/kommun/sollentuna')
})
