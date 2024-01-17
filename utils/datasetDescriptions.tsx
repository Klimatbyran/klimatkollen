/* eslint-disable max-len */
import { DatasetDescriptions, Municipality, SelectedData } from './types'

export const defaultDataView = 'karta'
export const secondaryDataView = 'lista'

export const defaultDataset = 'Utsläppen'

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
    boundaries: [0, -1, -2, -3, -10],
    labels: ['0% +', '0–1%', '1–2%', '2–3%', '3–10%', '10–15%'],
    labelRotateUp: [true, false, false, false, false, false],
    columnHeader: 'Utsläppsförändring',
    sortAscending: true,
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
    boundaries: [4, 5, 6, 7, 8],
    labels: ['4 -', '4–5', '5–6', '6–7', '7–8', '8 +'],
    labelRotateUp: [true, true, true, true, true, true],
    columnHeader: 'Ökning elbilar',
    sortAscending: false,
  },

  Klimatplanerna: {
    title: 'Klimatplan',
    body: (
      <>
        Kommuner som har eller saknar aktuella klimatplaner, samt länkar till befintliga planer. Klicka
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
    labels: ['7 ton +', '6,7-7 ton', '6,4-6,7 ton', '6,1-6,4 ton', '5,8-6,1 ton', '5,8 ton -'],
    labelRotateUp: [],
    columnHeader: 'Ton CO₂e/person/år',
    sortAscending: true,
  },

  Laddningen: {
    title: 'Antal laddare/elbil',
    body: 'Antal offentliga laddpunkter per antal laddbara bilar (CPEV-värde) i kommunerna år 2023.',
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
    columnHeader: 'Laddare/elbil',
    sortAscending: true,
  },
}

export const data = (municipalities: Array<Municipality>, selectedData: SelectedData) => municipalities.map((item) => {
  let dataPoint
  let formattedDataPoint

  switch (selectedData) {
    case 'Utsläppen':
      dataPoint = item.HistoricalEmission.EmissionLevelChangeAverage * 100
      formattedDataPoint = dataPoint.toFixed(1)
      break
    case 'Elbilarna':
      dataPoint = item.ElectricCarChangePercent * 100
      formattedDataPoint = dataPoint.toFixed(1)
      break
    case 'Klimatplanerna':
      dataPoint = item.ClimatePlan.Link
      formattedDataPoint = item.ClimatePlan.Link
      break
    case 'Konsumtionen':
      dataPoint = item.TotalConsumptionEmission
      formattedDataPoint = dataPoint.toFixed(1)
      break
    case 'Laddningen':
      dataPoint = item.ElectricVehiclePerChargePoints
      formattedDataPoint = dataPoint < 1e5 ? dataPoint.toFixed(1) : 'Laddare saknas'
      break
    default:
      dataPoint = item.BicycleMetrePerCapita
      formattedDataPoint = item.BicycleMetrePerCapita
  }

  return {
    name: item.Name,
    dataPoint,
    formattedDataPoint,
  }
})
