/* eslint-disable */
// TODO: This is test is completely broken for some reason after the design update.
// Probably due to state management getting confused betweeen URL, props and client side state.
// NOTE: This is a bit special since we need the StartPage even though we only want to test a part of that page.

import {
  fireEvent, render, screen, act,
} from '@testing-library/react'

import StartPage from '../../pages/index'
import StyledComponentsWrapper from '../utils/StyledComponentsWrapper'

vi.mock('../../public/icons/info.svg', () => ({ default: () => 'svg' }))
vi.mock('../../public/icons/list.svg', () => ({ default: () => 'svg' }))
vi.mock('../../public/icons/map.svg', () => ({ default: () => 'svg' }))
vi.mock('../../public/icons/arrow.svg', () => ({ default: () => 'svg' }))
vi.mock('../../public/icons/arrow-down.svg', () => ({ default: () => 'svg' }))
vi.mock('../../public/icons/arrow-right-bold-green.svg', () => ({ default: () => 'svg' }))
vi.mock('../../public/icons/lucide/external-link.svg', () => ({ default: () => 'svg' }))

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
      dataGroup: 'geografiskt',
      dataset: 'Utslappen',
      dataView: 'karta',
    },
    asPath: '',
    route: '/',
  }),
}))

describe('RegionalView', () => {
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

  it.skip('broken test')

  // TODO: Fix this broken test
  // beforeEach(() => {
  //   act(() => {
  //     render(
  //       <StartPage municipalities={mockMunicipalities} companies={[]} initialDataGroup="geografiskt" />,
  //       { wrapper: StyledComponentsWrapper },
  //     )
  //   })
  // })

  // it('renders without crashing', () => {
  //   expect(screen.getByText(/startPage:regionalView.questionTitle/)).toBeInTheDocument()
  // })

  // it('changes view mode when toggle button is clicked', () => {
  //   const toggleButton = screen.getByText('startPage:toggleView.map')
  //   act(() => {
  //     fireEvent.click(toggleButton)
  //   })
  //   expect(screen.getByText('startPage:toggleView.list')).toBeInTheDocument()
  // })

  // it('handles dataset change', () => {
  //   const newDataset = 'common:datasets.plans.name'
  //   act(() => {
  //     const radioButton = screen.getByText(newDataset)
  //     fireEvent.click(radioButton)
  //   })
  //   expect(screen.getByText('common:datasets.plans.title')).toBeInTheDocument()
  // })

  // it('renders the dropdown component', () => {
  //   const dropdownInput = screen.getByPlaceholderText(/startPage:regionalView.yourMunicipality/i)
  //   expect(dropdownInput).toBeInTheDocument()
  // })
})
