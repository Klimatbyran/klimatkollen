import { ClimateDataService } from '../../utils/climateDataService'

const climateDataService = new ClimateDataService()

const sum = l => l.reduce((a,b) => a+b)

describe('#getEmissionLevelChangeAverage()', () => {
  describe('No historical emissions are negative', () => {
    for (let {Name: MName, HistoricalEmission} of climateDataService.getMunicipalities()) {
      let {EmissionPerYear, SectorEmissionsPerYear} = HistoricalEmission;
      for(let {Name: sectorName, EmissionsPerYear: sectorEPY} of SectorEmissionsPerYear) {
        for (let {Year, CO2Equivalent} of sectorEPY) {
          if (CO2Equivalent < 0) {
            test(MName + " " + sectorName + " " + Year, () => {
              expect(CO2Equivalent).is.at.least(0);  
            })
          }
        }
      }
    }
  })
  test('HistoricalEmission sample tests', () => {
    let samples = [
      {name: "Karlskrona", year: "1990", exp: 218198.9457},
      {name: "Ljusdal", year: "2010", exp: 102602.0798},
      {name: "Älvdalen", year: "2018", exp: 34367.07636}
    ]

    for (let {name, year, exp} of samples) {
      let municipality = climateDataService.getMunicipality(name);
      expect(municipality).to.be.ok;
      let emissions = municipality.HistoricalEmission.EmissionPerYear;
      let value = emissions.filter(({Year}) => Year == year)[0].CO2Equivalent;
      expect(value).toBeCloseTo(exp)
    } 
  })
  test('HistoricalEmission Sector sample tests', () => {
    let samples = [
      {name: "Karlskrona", year: "1990", sector: "Transporter", exp: 100392.7339},
      {name: "Ljusdal", year: "2010", sector: "Jordbruk", exp: 396.5568024},
      {name: "Älvdalen", year: "2018", sector: "Produktanvändning (inkl. lösningsmedel)", exp: 365.2767839}
    ]

    for (let {name, year, sector, exp} of samples) {
      let municipality = climateDataService.getMunicipality(name);
      expect(municipality).to.be.ok;
      let emissions = municipality.HistoricalEmission.SectorEmissionsPerYear
        .filter(({Name}) => Name == sector)[0];
      expect(emissions).to.be.ok;
      let value = emissions.EmissionsPerYear.filter(({Year}) => Year == year)[0].CO2Equivalent;
      expect(value).toBeCloseTo(exp)
    }
  })
  test('historical sectors sum to total', () => {
    let samples = [
      {name: "Karlskrona", year: "1990"},
      {name: "Ljusdal", year: "2010"},
      {name: "Älvdalen", year: "2018"},
      // Esp. include cement municips
      {name: "Mörbylånga", year: "1990"},
      {name: "Skövde", year: "2010"},
      {name: "Gotland", year: "2018"},
    ]

    for (let {name, year} of samples) {
      expect(climateDataService.getMunicipality(name))
        .to.be.ok;

      let totalEmissions = climateDataService.getMunicipality(name)
        .HistoricalEmission
        .EmissionPerYear
        .find(({Year}) => Year == year)
        .CO2Equivalent

      let sectorEmissions = climateDataService.getMunicipality(name)
        .HistoricalEmission
        .SectorEmissionsPerYear
        .map(x => x
          .EmissionsPerYear
          .find(({Year}) => Year == year)
          .CO2Equivalent)

      expect(totalEmissions).toBeCloseTo(sum(sectorEmissions))
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
