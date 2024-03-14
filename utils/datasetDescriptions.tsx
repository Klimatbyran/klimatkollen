/* eslint-disable max-len */
import { DatasetDescriptions, Municipality, SelectedData } from './types'

export const defaultDataView = 'karta'
export const secondaryDataView = 'lista'

export const defaultDataset = 'Utsläppen'

const yearsAhead = (years: number) => {
  const currentDate = new Date()
  const yearsInFuture = currentDate.getFullYear() + years
  currentDate.setFullYear(yearsInFuture)
  return currentDate
}

const formatDateToString = (date: Date): string => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // months are 0-based
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const requirementsInProcurement = (score: number): string => {
  if (score > 1) return 'Ja'
  if (score > 0) return 'Kanske'
  return 'Nej'
}

export const datasetDescriptions: DatasetDescriptions = {
  Utsläppen: {
    title: 'Utsläppsförändring',
    body: 'Genomsnittlig årlig förändring av koldioxidutsläppen i Sveriges kommuner sedan Parisavtalet 2015.',
    source: (
      <>
        Källa:
        {' '}
        <a
          href="https://nationellaemissionsdatabasen.smhi.se/"
          target="_blank"
          rel="noreferrer"
        >
          Nationella emissionsdatabasen
        </a>
      </>
    ),
    boundaries: [0.0, -0.01, -0.02, -0.03, -0.1],
    labels: ['0% +', '0–1%', '1–2%', '2–3%', '3–10%', '10–15%'],
    labelRotateUp: [true, false, false, false, false, false],
    columnHeader: 'Utsläppsförändring',
    sortAscending: true,
    rawDataPoint: (item) => item.HistoricalEmission.HistoricalEmissionChangePercent / 100,
    formattedDataPoint: (dataPoint) => ((dataPoint as number) * 100).toFixed(1),
  },

  Klimatplanerna: {
    title: 'Klimatplan',
    body: (
      <>
        Kommuner som har eller saknar aktuella klimatplaner, samt länkar till befintliga
        planer. Klicka
        {' '}
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSfCYZno3qnvY2En0OgRmGPxsrovXyAq7li52BuLalavMBbghA/viewform?usp=sf_link"
          target="_blank"
          rel="noreferrer"
        >
          här
        </a>
        {' '}
        för att redigera informationen.
      </>
    ),
    source: (
      <>
        Källa:
        {' '}
        <a
          href="https://docs.google.com/spreadsheets/d/13CMqmfdd6QUD6agKFyVhwZUol4PKzvy253_EwtsFyvw/edit?fbclid=IwAR0v0cq0_xhFVlhhVn5fP-TNkOPVRXbOTKzTVWI_PMr_yU2rXOLjcN6jSps#gid=0"
          target="_blank"
          rel="noreferrer"
        >
          allmänhetens öppna sammanställning
        </a>
      </>
    ),
    boundaries: ['Saknas', ''],
    labels: ['Nej', 'Ja'],
    labelRotateUp: [],
    columnHeader: 'Klimatplan',
    rawDataPoint: (item) => item.ClimatePlan.Link,
    formattedDataPoint: (dataPoint) => (dataPoint === 'Saknas' ? 'Nej' : 'Ja'),
  },

  Elbilarna: {
    title: 'Elbilsökning',
    body: 'Ökningstakten i kommunerna för andel nyregistrerade laddbara bilar 2015–2022, angivet i procentenheter per år.',
    source: (
      <>
        Källa:
        {' '}
        <a href="https://www.trafa.se/vagtrafik/fordon/" target="_blank" rel="noreferrer">
          Trafikanalys
        </a>
      </>
    ),
    boundaries: [0.04, 0.05, 0.06, 0.07, 0.08],
    labels: ['4 -', '4–5', '5–6', '6–7', '7–8', '8 +'],
    labelRotateUp: [true, true, true, true, true, true],
    columnHeader: 'Ökning elbilar',
    sortAscending: false,
    rawDataPoint: (item) => item.ElectricCarChangePercent,
    formattedDataPoint: (dataPoint) => ((dataPoint as number) * 100).toFixed(1),
  },

  Laddarna: {
    title: 'Elbilar per laddare',
    body: 'Antal laddbara bilar per offentliga laddpunkter år 2023. EU rekommenderar max 10 bilar per laddare.',
    source: (
      <>
        Källa:
        {' '}
        <a
          href="https://powercircle.org/elbilsstatistik/"
          target="_blank"
          rel="noreferrer"
        >
          Power Circle ELIS
        </a>
        {' '}
      </>
    ),
    boundaries: [1e6, 40, 30, 20, 10],
    labels: ['Inga laddare', '40 +', '30-40', '20-30', '10-20', '10 -'],
    labelRotateUp: [],
    columnHeader: 'Elbil per laddare',
    sortAscending: true,
    rawDataPoint: (item) => item.ElectricVehiclePerChargePoints,
    formattedDataPoint: (dataPoint) => ((dataPoint as number) < 1e5 ? (dataPoint as number).toFixed(1) : 'Laddare saknas'),
  },

  Cyklarna: {
    title: 'Cykelvägslängd',
    body: 'Antal meter cykelväg per invånare per kommun år 2022.',
    source: (
      <>
        Källa:
        {' '}
        <a
          href="https://nvdb2012.trafikverket.se/SeTransportnatverket"
          target="_blank"
          rel="noreferrer"
        >
          Nationella Vägdatabasen/Trafikverket
        </a>
        {' '}
        och
        {' '}
        <a
          href="https://www.scb.se/hitta-statistik/statistik-efter-amne/befolkning/befolkningens-sammansattning/befolkningsstatistik" // fixme
          target="_blank"
          rel="noreferrer"
        >
          SCB
        </a>
      </>
    ),
    boundaries: [1, 2, 3, 4, 5],
    labels: ['1 m -', '1-2 m', '2-3 m', '3-4 m', '4-5 m', '5 m +'],
    labelRotateUp: [],
    columnHeader: 'Cykelväglängd',
    sortAscending: false,
    rawDataPoint: (item) => item.BicycleMetrePerCapita,
    formattedDataPoint: (dataPoint) => (dataPoint as number).toFixed(1),
  },

  Konsumtionen: {
    title: 'Konsumtionsutsläpp',
    body: 'Hushållens konsumtionsutsläpp (CO₂e) i ton per invånare och kommun år 2019. År 2050 ska utsläppen vara högst 1 ton per person och år för att ligga i linje med Parisavtalet.',
    source: (
      <>
        Källa:
        {' '}
        <a
          href="https://www.sei.org/tools/konsumtionskompassen/"
          target="_blank"
          rel="noreferrer"
        >
          Stockholm Environment Institute
        </a>
      </>
    ),
    boundaries: [7, 6.7, 6.4, 6.1, 5.8],
    labels: [
      '7 ton +',
      '6,7-7 ton',
      '6,4-6,7 ton',
      '6,1-6,4 ton',
      '5,8-6,1 ton',
      '5,8 ton -',
    ],
    labelRotateUp: [],
    columnHeader: 'Ton CO₂e/person/år',
    sortAscending: true,
    rawDataPoint: (item) => item.TotalConsumptionEmission,
    formattedDataPoint: (dataPoint) => (dataPoint as number).toFixed(1),
  },

  Koldioxidbudgetarna: {
    title: 'Budget slut om',
    body: 'Datum då kommunens koldioxidbudget tar slut om utsläppen fortsätter enligt nuvarande trend. Några kommuner kommer att hålla budgeten om trenden står sig.',
    source: (
      <>
        Källa:
        {' '}
        <a
          href="https://nationellaemissionsdatabasen.smhi.se/"
          target="_blank"
          rel="noreferrer"
        >
          Nationella emissionsdatabasen
        </a>
        {' '}
        och
        {' '}
        <a
          href="http://www.cemus.uu.se/wp-content/uploads/2023/12/Paris-compliant-carbon-budgets-for-Swedens-counties-.pdf"
          target="_blank"
          rel="noreferrer"
        >
          Uppsala universitet
        </a>
      </>
    ),
    boundaries: [
      yearsAhead(2),
      yearsAhead(3),
      yearsAhead(4),
      yearsAhead(5),
      new Date(2050, 1, 1),
    ],
    labels: ['2 år -', '2-3 år', '3-4 år', '4-5 år', '5 år +', 'Håller budget'],
    labelRotateUp: [],
    columnHeader: 'Budget tar slut',
    sortAscending: false,
    rawDataPoint: (item) => new Date(item.BudgetRunsOut),
    formattedDataPoint: (dataPoint) => (dataPoint < new Date(2050, 1, 1)
      ? formatDateToString(dataPoint as Date)
      : 'Håller budget'),
    stringsOnTop: true,
  },

  Upphandlingarna: {
    // TODO
    // [ ] tests
    // [ x ] add to municipality screen
    // [ ] add correct icon muni screen
    // [ ] add correct copy to muni screen
    title: 'Klimatkrav i upphandling',
    body: 'Kommuner som ställer klimatkrav vid offentliga upphandlingar. Ja innebär principbeslut och underlag som tillstyrker. Kanske innebär ja-svar i enkätundersökning eller via mejl, men utan underlag som tillstyrker.',
    source: (
      <>
        Källa:
        {' '}
        <a
          href="/data/facts/procurements/NUE2022_DATA_2023-12-20.xlsx" // fixme
          target="_blank"
          rel="noreferrer"
        >
          Upphandlingsmyndigheten
        </a>
        {' '}
        och
        {' '}
        <a
          href="https://docs.google.com/spreadsheets/d/1EdHUa49HJZn0rXqM-6tChdim4TJzXnwA/edit#gid=1040317160"
          target="_blank"
          rel="noreferrer"
        >
          Greenpeace
        </a>
      </>
    ),
    boundaries: [0, 1, 2],
    labels: ['Nej', 'Kanske', 'Ja'],
    labelRotateUp: [],
    columnHeader: 'Klimatkrav',
    sortAscending: false,
    rawDataPoint: (item) => item.ProcurementScore,
    formattedDataPoint: (dataPoint) => requirementsInProcurement(dataPoint as number),
  },
}

export const currentData = (
  municipalities: Array<Municipality>,
  selectedData: SelectedData,
) => municipalities.map((item) => {
  const dataset = datasetDescriptions[selectedData]
  const dataPoint = dataset.rawDataPoint ? dataset.rawDataPoint(item) : null
  const formattedDataPoint = dataPoint != null && dataset.formattedDataPoint
    ? dataset.formattedDataPoint(dataPoint)
    : 'Data saknas'

  return {
    name: item.Name,
    dataPoint: dataPoint || 'Data saknas',
    formattedDataPoint,
  }
})
