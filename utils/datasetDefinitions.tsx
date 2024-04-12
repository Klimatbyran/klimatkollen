/* eslint-disable max-len */
import {
  DataDescriptions, Municipality, SelectedData,
} from './types'

export const defaultDataView = 'karta'
export const secondaryDataView = 'lista'

export const defaultDataset = 'Utsläppen'

export const climatePlanMissing = 'Saknar plan'

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
  let scoreString = 'Nej'
  if (score > 0) {
    scoreString = 'Kanske'
  }
  if (score > 1) {
    scoreString = 'Ja'
  }
  return scoreString
}

export const dataDescriptions: DataDescriptions = {
  Utsläppen: {
    title: 'Utsläppsförändring',
    body: 'Genomsnittlig årlig förändring av koldioxidutsläppen i Sveriges kommuner sedan Parisavtalet 2015.',
    source: 'Källa: [Nationella emissionsdatabasen](https://nationellaemissionsdatabasen.smhi.se/)',
    boundaries: [0.0, -0.01, -0.02, -0.03, -0.1],
    labels: ['0% +', '0–1%', '1–2%', '2–3%', '3–10%', '10–15%'],
    labelRotateUp: [true, false, false, false, false, false],
    columnHeader: 'Utsläppsförändring',
    dataPoints: {
      rawDataPoint: (item) => item.HistoricalEmission.HistoricalEmissionChangePercent / 100,
      formattedDataPoint: (dataPoint) => ((dataPoint as number) * 100).toFixed(1),
    },
    sortAscending: true,
  },

  Koldioxidbudgetarna: {
    title: 'Budget slut om',
    body: 'Datum då kommunens koldioxidbudget tar slut om utsläppen fortsätter enligt nuvarande trend. Några kommuner kommer att hålla budgeten om trenden står sig.',
    source: 'Källor: [Nationella emissionsdatabasen](https://nationellaemissionsdatabasen.smhi.se/) och [Uppsala universitet](http://www.cemus.uu.se/wp-content/uploads/2023/12/Paris-compliant-carbon-budgets-for-Swedens-counties-.pdf)',
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
    dataPoints: {
      rawDataPoint: (item) => new Date(item.BudgetRunsOut),
      formattedDataPoint: (dataPoint) => (dataPoint < new Date(2050, 1, 1)
        ? formatDateToString(dataPoint as Date)
        : 'Håller budget'),
    },
    sortAscending: false,
    stringsOnTop: true,
  },

  Klimatplanerna: {
    title: 'Klimatplan',
    body: 'Kommuner som har eller saknar aktuella klimatplaner, samt länkar till befintliga planer. Klicka [här](https://docs.google.com/forms/d/e/1FAIpQLSfCYZno3qnvY2En0OgRmGPxsrovXyAq7li52BuLalavMBbghA/viewform) för att redigera informationen.',
    source: 'Källa: [allmänhetens öppna sammanställning](https://docs.google.com/spreadsheets/d/13CMqmfdd6QUD6agKFyVhwZUol4PKzvy253_EwtsFyvw/edit?fbclid=IwAR0v0cq0_xhFVlhhVn5fP-TNkOPVRXbOTKzTVWI_PMr_yU2rXOLjcN6jSps#gid=0)',
    boundaries: [climatePlanMissing, ''],
    labels: ['Nej', 'Ja'],
    labelRotateUp: [],
    columnHeader: 'Antagen år',
    dataPoints: {
      rawDataPoint: (item) => item.ClimatePlan.Link,
      formattedDataPoint: (dataPoint) => (dataPoint === climatePlanMissing ? 'Nej' : 'Ja'),
      additionalDataPoint: (item) => item.ClimatePlan.YearAdapted,
    },
  },

  Konsumtionen: {
    title: 'Konsumtionsutsläpp',
    body: 'Hushållens konsumtionsutsläpp (CO₂e) i ton per invånare och kommun år 2019. År 2050 ska utsläppen vara högst 1 ton per person och år för att ligga i linje med Parisavtalet.',
    source: 'Källa: [Stockholm Environment Institute](https://www.sei.org/tools/konsumtionskompassen/)',
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
    dataPoints: {
      rawDataPoint: (item) => item.TotalConsumptionEmission,
      formattedDataPoint: (dataPoint) => (dataPoint as number).toFixed(1),
    },
    sortAscending: true,
  },

  Elbilarna: {
    title: 'Elbilsökning',
    body: 'Ökningstakten i kommunerna för andel nyregistrerade laddbara bilar 2015–2022, angivet i procentenheter per år.',
    source: 'Källa: [Trafikanalys](https://www.trafa.se/vagtrafik/fordon/)',
    boundaries: [0.04, 0.05, 0.06, 0.07, 0.08],
    labels: ['4 -', '4–5', '5–6', '6–7', '7–8', '8 +'],
    labelRotateUp: [true, true, true, true, true, true],
    columnHeader: 'Ökning elbilar',
    dataPoints: {
      rawDataPoint: (item) => item.ElectricCarChangePercent,
      formattedDataPoint: (dataPoint) => ((dataPoint as number) * 100).toFixed(1),
    },
    sortAscending: false,
  },

  Laddarna: {
    title: 'Elbilar per laddare',
    body: 'Antal laddbara bilar per offentliga laddpunkter år 2023. EU rekommenderar max 10 bilar per laddare.',
    source: 'Källa: [Power Circle ELIS](https://powercircle.org/elbilsstatistik/)',
    boundaries: [1e6, 40, 30, 20, 10],
    labels: ['Inga laddare', '40 +', '30-40', '20-30', '10-20', '10 -'],
    labelRotateUp: [],
    columnHeader: 'Elbil per laddare',
    dataPoints: {
      rawDataPoint: (item) => item.ElectricVehiclePerChargePoints,
      formattedDataPoint: (dataPoint) => ((dataPoint as number) < 1e5 ? (dataPoint as number).toFixed(1) : 'Laddare saknas'),
    },
    sortAscending: true,
  },

  Cyklarna: {
    title: 'Cykelvägslängd',
    body: 'Antal meter cykelväg per invånare per kommun år 2022.',
    source: 'Källor: [Nationella Vägdatabasen/Trafikverket](https://nvdb2012.trafikverket.se/SeTransportnatverket) och [SCB](https://www.scb.se/hitta-statistik/statistik-efter-amne/befolkning/befolkningens-sammansattning/befolkningsstatistik)',
    boundaries: [1, 2, 3, 4, 5],
    labels: ['1 m -', '1-2 m', '2-3 m', '3-4 m', '4-5 m', '5 m +'],
    labelRotateUp: [],
    columnHeader: 'Cykelväglängd',
    dataPoints: {
      rawDataPoint: (item) => item.BicycleMetrePerCapita,
      formattedDataPoint: (dataPoint) => (dataPoint as number).toFixed(1),
    },
    sortAscending: false,
  },

  Upphandlingarna: {
    title: 'Klimatkrav i upphandling',
    body: (
      <>
        Kommuner som ställer klimatkrav vid offentliga upphandlingar. “Ja” innebär
        principbeslut och underlag som tillstyrker. “Kanske” innebär ja-svar i
        enkätundersökning eller via mejl, men utan underlag som tillstyrker.
        {' '}
        <a href="mailto:hej@klimatkollen.se">
          Mejla oss
        </a>
        {' '}
        för att redigera informationen.
      </>
    ),
    source: 'Källor: [Upphandlingsmyndigheten](/data/procurements/NUE2022_DATA_2023-12-20.xlsx) och [Greenpeace](https://docs.google.com/spreadsheets/d/1EdHUa49HJZn0rXqM-6tChdim4TJzXnwA/edit#gid=1040317160)',
    boundaries: [0, 1, 2],
    labels: ['Nej', 'Kanske', 'Ja'],
    labelRotateUp: [],
    columnHeader: 'Underlag',
    dataPoints: {
      rawDataPoint: (item) => item.ProcurementScore,
      formattedDataPoint: (dataPoint) => requirementsInProcurement(dataPoint as number),
    },
    sortAscending: false,
  },
}

export const dataOnDisplay = (
  municipalities: Array<Municipality>,
  selectedData: SelectedData,
) => municipalities.map((item) => {
  const { dataPoints } = dataDescriptions[selectedData]

  const dataPoint = dataPoints.rawDataPoint ? dataPoints.rawDataPoint(item) : 'Data saknas'
  const formattedDataPoint = dataPoint != null && dataPoints.formattedDataPoint
    ? dataPoints.formattedDataPoint(dataPoint)
    : 'Data saknas'
  const secondaryDataPoint = dataPoints.additionalDataPoint ? dataPoints.additionalDataPoint(item) : undefined

  return {
    name: item.Name,
    primaryDataPoint: dataPoint,
    formattedPrimaryDataPoint: formattedDataPoint,
    secondaryDataPoint,
    climatePlanYearAdapted: item.ClimatePlan.YearAdapted,
    procurementLink: item.ProcurementLink,
  }
})
