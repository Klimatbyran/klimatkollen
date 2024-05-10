import {
  fireEvent, render, screen, act,
} from '@testing-library/react'
import StartPage from '../pages/index'
import StyledComponentsWrapper from './utils/StyledComponentsWrapper'

vi.mock('../public/icons/info.svg', () => ({ default: () => 'svg' }))
vi.mock('../public/icons/list.svg', () => ({ default: () => 'svg' }))
vi.mock('../public/icons/map.svg', () => ({ default: () => 'svg' }))
vi.mock('../public/icons/arrow.svg', () => ({ default: () => 'svg' }))
vi.mock('../public/icons/arrow-down.svg', () => ({ default: () => 'svg' }))

// Mock useRouter
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    query: {
      dataset: 'Utslappen',
      dataView: 'karta',
    },
    asPath: '',
    route: '/',
  }),
}))

vi.mock('next-i18next', () => ({
  useTranslation: vi.fn(() => ({
    t: (str: string) => str,
  })),
}))

describe('StartPage', () => {
// Mock data for municipalities
  const mockMunicipalities = [
    {
      County: '',
      CoatOfArmsImage: null,
      Population: null,
      Image: null,
      Budget: {
        BudgetPerYear: [],
        CO2Equivalent: 0,
      },
      PoliticalRule: [],
      EmissionTrend: {
        TrendPerYear: [],
        TrendCO2Emission: 0,
      },
      HistoricalEmission: {
        HistoricalEmissionChangeRank: 0,
        LargestEmissionSectors: [],
        EmissionPerYear: [],
        HistoricalEmissionChangePercent: 0,
      },
      ApproximatedHistoricalEmission: {
        EmissionPerYear: [],
        TotalCO2Emission: 0,
      },
      NeededEmissionChangePercent: 0,
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
      ElectricVehiclePerChargePoints: 0,
      Name: 'Sollentuna',
      ProcurementScore: 0,
      ProcurementLink: '',
    },
  ]

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

  beforeEach(() => {
    act(() => {
      render(
        // @ts-expect-error Temporary type error due to type mismatch compared to the data structure we expect in the near future.
        <StartPage municipalities={mockMunicipalities} companies={mockCompanies} />,
        // Make sure styled-components only render valid props to the DOM
        { wrapper: StyledComponentsWrapper },
      )
    })
  })

  describe('CompanyView', () => {
    it('renders without crashing', () => {
      expect(screen.findByText(/startPage:questionTitle/)).toBeTruthy()
    })
  })

  describe('RegionalView', () => {
    beforeEach(() => {
      // Show the RegionalView
      act(() => {
        const switchButton = screen.getByText('Kommuner')
        fireEvent.click(switchButton)
      })
    })

    it('renders without crashing', () => {
      expect(screen.getByText(/startPage:regionalView.questionTitle/)).toBeInTheDocument()
    })

    it('changes view mode when toggle button is clicked', () => {
      const toggleButton = screen.getByText('startPage:toggleView.map')
      act(() => {
        fireEvent.click(toggleButton)
      })
      expect(screen.getByText('startPage:toggleView.list')).toBeInTheDocument()
    })

    it('handles dataset change', () => {
      const newDataset = 'common:datasets.plans.name'
      act(() => {
        const radioButton = screen.getByText(newDataset)
        fireEvent.click(radioButton)
      })
      expect(screen.getByText('common:datasets.plans.title')).toBeInTheDocument()
    })

    it('renders the dropdown component', () => {
      const dropdownInput = screen.getByPlaceholderText(/startPage:regionalView.yourMunicipality/i)
      expect(dropdownInput).toBeInTheDocument()
    })
  })
})
