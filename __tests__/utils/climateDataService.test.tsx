import { ClimateDataService } from '../../utils/climateDataService'

const climateDataService = new ClimateDataService()

test('climate data service calculates average yearly change in emissions with normal data', () => {
  const data = [
    { Year: 2018, CO2Equivalent: 100 },
    { Year: 2019, CO2Equivalent: 110 },
    { Year: 2020, CO2Equivalent: 121 },
  ]

  const result = climateDataService.getEmissionLevelChangeAverage(data)
  expect(result * 100).toBe(10)
})

test('calculate average yearly change in emissions with edge cases', () => {
  // No change in emissions
  let data = [
    { Year: 2018, CO2Equivalent: 100 },
    { Year: 2019, CO2Equivalent: 100 },
  ]

  let result = climateDataService.getEmissionLevelChangeAverage(data)
  expect(result).toBe(0) // average yearly change should be 0%

  // Empty data array
  data = []
  result = climateDataService.getEmissionLevelChangeAverage(data)
  expect(result).toBe(0) // average yearly change should be 0%

  // Single year data
  data = [{ Year: 2018, CO2Equivalent: 100 }]
  result = climateDataService.getEmissionLevelChangeAverage(data)
  expect(result).toBe(0) // average yearly change should be 0%
})

test('calculate average yearly change in emissions with negative changes', () => {
  const data = [
    { Year: 2018, CO2Equivalent: 100 },
    { Year: 2019, CO2Equivalent: 90 },
  ]

  const result = climateDataService.getEmissionLevelChangeAverage(data)
  expect(result * 100).toBeCloseTo(-10) // average yearly change should be close to -10%
})

test('calculate average yearly change in emissions with data pre 2015', () => {
  // average yearly change for whole series is 3.93%
  // average yearly change for 2015-2021 is 4.33%
  const data = [
    { Year: 2013, CO2Equivalent: 100 },
    { Year: 2014, CO2Equivalent: 110 },
    { Year: 2015, CO2Equivalent: 105 },
    { Year: 2016, CO2Equivalent: 115 },
    { Year: 2017, CO2Equivalent: 113 },
    { Year: 2018, CO2Equivalent: 120 },
    { Year: 2019, CO2Equivalent: 125 },
    { Year: 2020, CO2Equivalent: 130 },
    { Year: 2021, CO2Equivalent: 135 },
  ]

  const result = climateDataService.getEmissionLevelChangeAverage(data)
  expect(result * 100).toBeCloseTo(4.33)
})
