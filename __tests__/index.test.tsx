import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '../pages'

vi.mock('../public/icons/arrow-down.svg', () => ({ default: 'svg' }))
vi.mock('../public/icons/arrow-right-white.svg', () => ({ default: 'svg' }))
vi.mock('../public/icons/arrow-right-green.svg', () => ({ default: 'svg' }))
vi.mock('../public/icons/arrow.svg', () => ({ default: 'svg' }))
vi.mock('../public/icons/list.svg', () => ({ default: 'svg' }))
vi.mock('../public/icons/map.svg', () => ({ default: 'svg' }))
vi.mock('../public/icons/info.svg', () => ({ default: () => 'svg' }))
vi.mock('../components/ComparisonTable', () => ({ default: () => <div /> }))

vi.mock('../components/Map/Map', async () => vi.importActual('../components/Map/Map'))

// Mock router
const mockRouter = {
  query: { dataset: 'utslappen', dataView: 'karta' },
  push: vi.fn(),
}

vi.mock('next/router', () => ({
  useRouter: () => mockRouter,
}))

const setup = () => render(
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
          FutureCO2Emission: 0,
        },
        HistoricalEmission: {
          AverageEmissionChangeRank: 0,
          LargestEmissionSectors: [],
          EmissionPerYear: [],
          EmissionLevelChangeAverage: 0,
        },
        EmissionChangePercent: 0,
        HitNetZero: 0,
        BudgetRunsOut: '',
        ElectricCars: 0,
        ElectricCarChangePercent: 0,
        ElectricCarChangeYearly: [],
        ClimatePlan: {
          Link: '',
          YearAdapted: '',
          Comment: '',
        },
        BicycleMetrePerCapita: 0,
        TotalConsumptionEmission: 0,
        Name: 'Sollentuna',
      },
    ]}
  />,
)

beforeEach(() => {
  vi.clearAllMocks()
  return Promise.resolve()
})

// test('dropdown shows error text if nothing is selected on enter', () => {
//   vi.useFakeTimers()

//   setup()

//   // User presses enter in empty dropdown
//   userEvent.type(screen.getByPlaceholderText(/hur går det i din kommun?/i), '{enter}')

//   // Error text is shown
//   expect(screen.getByText(/välj en kommun i listan/i)).toBeInTheDocument()

//   vi.advanceTimersByTime(2000)

//   // Error text disappears after two seconds
//   expect(screen.queryByText(/välj en kommun i listan/i)).not.toBeInTheDocument()
// })

// test('dropdown shows error text if invalid municipality is selected on enter', () => {
//   vi.useFakeTimers()

//   setup()

//   // User presses enter in empty dropdown
//   userEvent.type(screen.getByPlaceholderText(/hur går det i din kommun?/i), 'foobar{enter}')

//   // Error text is shown
//   expect(screen.getByText(/välj en kommun i listan/i)).toBeInTheDocument()

//   vi.advanceTimersByTime(2000)

//   // Error text disappears after two seconds
//   expect(screen.queryByText(/välj en kommun i listan/i)).not.toBeInTheDocument()
// })

// test('dropdown closes when clicking outside', () => {
//   setup()

//   userEvent.type(screen.getByPlaceholderText(/hur går det i din kommun/i), 'llen')

//   // Opens dropdown
//   expect(screen.getByText(/sollentuna/i)).toBeInTheDocument()

//   // Click outside
//   userEvent.click(screen.getByText(/hur går det med?/i))

//   // Dropdown is closed
//   expect(screen.queryByText(/sollentuna/i)).not.toBeInTheDocument()
//   expect(mockRouter.push).not.toHaveBeenCalled()
// })

// test('dropdown handles selecting from list', () => {
//   setup()

//   userEvent.type(screen.getByLabelText(/hur går det i din kommun/i), 'llen')
//   userEvent.click(screen.getByText(/sollentuna/i))
//   userEvent.type(screen.getByPlaceholderText(/hur går det i din kommun?/i), '{enter}')

//   expect(mockRouter.push).toHaveBeenCalledWith('/kommun/sollentuna')
// })

// test('dropdown handles typing and pressing enter', () => {
//   setup()

//   userEvent.type(screen.getByLabelText(/hur går det i din kommun/i), 'Sollentuna')
//   userEvent.type(screen.getByPlaceholderText(/hur går det i din kommun?/i), '{enter}')

//   expect(mockRouter.push).toHaveBeenCalledWith('/kommun/sollentuna')
// })

// test('dropdown handles typing with lowercase letters and pressing enter', () => {
//   setup()

//   userEvent.type(screen.getByPlaceholderText(/hur går det i din kommun?/i), 'sollentuna{enter}')

//   expect(mockRouter.push).toHaveBeenCalledWith('/kommun/sollentuna')
// })
