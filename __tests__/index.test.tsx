import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../pages/index'

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

describe('Home Page', () => {
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
      ElectricVehiclePerChargePoints: 0,
      Name: 'Sollentuna',
    },
  ]

  beforeEach(() => {
    render(<Home municipalities={mockMunicipalities} />)
  })

  it('renders without crashing', () => {
    expect(screen.getByText(/Hur går det med?/)).toBeInTheDocument()
  })

  it('changes view mode when toggle button is clicked', () => {
    const toggleButton = screen.getByText('Listvy')
    fireEvent.click(toggleButton)
    expect(screen.getByText('Kartvy')).toBeInTheDocument()
  })

  it('handles dataset change', () => {
    const newDataset = 'Klimatplanerna'
    const radioButton = screen.getByLabelText(newDataset)
    fireEvent.click(radioButton)
    expect(screen.getByText(newDataset)).toBeInTheDocument()
  })
})
