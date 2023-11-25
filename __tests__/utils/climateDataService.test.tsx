import { ClimateDataService } from '../../utils/climateDataService'

const climateDataService = new ClimateDataService()

describe('#getEmissionLevelChangeAverage()', () => {
  test('HistoricalEmission sample tests', () => {
    let samples = [
      {municipalityName: "Karlskrona", year: "1990", correctValue: 218198.9457},
      {municipalityName: "Ljusdal", year: "2010", correctValue: 102602.0798},
      {municipalityName: "Älvdalen", year: "2018", correctValue: 34367.07636}
    ]

    for (let {municipalityName, year, correctValue} of samples) {
      let municipality = climateDataService.getMunicipality(municipalityName);
      expect(municipality).to.be.ok;
      let emissions = municipality.HistoricalEmission.EmissionPerYear;
      let value = emissions.filter(({Year}) => Year == year)[0].CO2Equivalent;
      expect(value).toBeCloseTo(correctValue)
    } 
  })
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
    expect(result * 100).toBe(-10)
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
    expect(result * 100).toBe(4.332031644555692)

    const extendedData = [
      { Year: 2000, CO2Equivalent: 50 },
      { Year: 2001, CO2Equivalent: 51.25 },
      { Year: 2002, CO2Equivalent: 52.53 },
      { Year: 2003, CO2Equivalent: 53.84 },
      { Year: 2004, CO2Equivalent: 55.19 },
      { Year: 2005, CO2Equivalent: 56.57 },
      { Year: 2006, CO2Equivalent: 58 },
      { Year: 2007, CO2Equivalent: 59.45 },
      { Year: 2008, CO2Equivalent: 60.94 },
      { Year: 2009, CO2Equivalent: 62.47 },
      { Year: 2010, CO2Equivalent: 64.03 },
      { Year: 2011, CO2Equivalent: 65.63 },
      { Year: 2012, CO2Equivalent: 67.28 },
      { Year: 2013, CO2Equivalent: 68.96 },
      { Year: 2014, CO2Equivalent: 70.68 },
      { Year: 2015, CO2Equivalent: 74.22 },
      { Year: 2016, CO2Equivalent: 77.93 },
      { Year: 2017, CO2Equivalent: 81.83 },
      { Year: 2018, CO2Equivalent: 85.92 },
      { Year: 2019, CO2Equivalent: 90.21 },
      { Year: 2020, CO2Equivalent: 94.72 },
      { Year: 2021, CO2Equivalent: 99.46 },
    ]

    // average yearly change for whole series is approximately 4.33%
    // average yearly change for 2015-2021 is approximately 4.57%
    const extendedResult = climateDataService.getEmissionLevelChangeAverage(extendedData)
    expect(extendedResult * 100).toBe(4.999666044374538)
  })
})
