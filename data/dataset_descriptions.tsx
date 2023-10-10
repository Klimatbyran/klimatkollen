/* eslint-disable max-len */
import { DatasetDescriptions, Municipality, SelectedData } from '../utils/types'

export const defaultDataset = 'Utsläppen'

export const datasetDescriptions: DatasetDescriptions = {
  Utsläppen: {
    title: 'Utsläppsförändring',
    heading: 'Utsläppsförändring sedan Parisavtalet',
    body: 'På kartan och i listan visas genomsnittlig årlig förändring av kolidioxidutsläppen i Sveriges kommuner sedan Parisavtalet 2015.',
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
    boundaries: [0, -0.01, -0.02, -0.03, -0.1],
    labels: ['0% +', '0–1%', '1–2%', '2–3%', '3–10%', '10–15%'],
    labelRotateUp: [true, false, false, false, false, false],
    columnHeader: 'Utsläppsförändring',
    dataType: 'Percent',
    tooltip:
      'Genomsnittlig årlig förändring av kolidioxidutsläppen i Sveriges kommuner sedan Parisavtalet 2015, angivet i procent',
  },

  Elbilarna: {
    title: 'Elbilsökning',
    heading: 'Ökningstakt andel elbilar sedan Parisavtalet',
    body: 'På kartan och i listan visas ökningstakten i kommunerna för andel nyregistrerade laddbara bilar 2015–2022, angivet i procentenheter per år.',
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
    dataType: 'Percent',
    tooltip:
      'Ökningstakten för andelen nyregistrerade laddbara bilar sedan Parisavtalet 2015 i procentenheter per år',
  },

  Klimatplanerna: {
    title: 'Klimatplan',
    heading: 'Kommuner som har klimatplaner',
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
    dataType: 'Link',
    tooltip:
      'Avser nu gällande klimathandlingsplan eller motsvarande. Inte anpassningsplaner, utsläppsbudgetar, klimatlöften, miljöpolicies eller liknande',
  },

  Cyklarna: {
    title: 'Cykelvägslängd',
    heading: 'Antal meter cykelväg per invånare',
    body: 'På kartan och i listan visas antal meter cykelväg per invånare per kommun år 2022.',
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
    dataType: 'Number',
    tooltip:
      'Antal meter cykelväg per invånare per kommun år 2022 totalt för alla väghållare (statlig, kommunal, enskild)',
  },

  Konsumtionen: {
    title: 'Konsumtionsutsläpp',
    heading: 'Hushållens konsumtionsutsläpp',
    body: 'På kartan och i listan visas hushållens konsumtionsutsläpp (CO₂e) i ton per invånare och kommun år 2019. År 2050 ska utsläppen vara högst 1 ton per person och år för att ligga i linje med Parisavtalet.',
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
    dataType: 'Number',
    tooltip:
      'Avser antal ton växthusgasutsläpp (CO₂e) per år och medborgare (år 2019).',
  },
}

export const data = (municipalities: Array<Municipality>, selectedData: SelectedData) => municipalities.map((item) => {
  let dataPoint

  switch (selectedData) {
    case 'Utsläppen':
      dataPoint = item.HistoricalEmission.EmissionLevelChangeAverage
      break
    case 'Elbilarna':
      dataPoint = item.ElectricCarChangePercent
      break
    case 'Klimatplanerna':
      dataPoint = item.ClimatePlan.Link
      break
    case 'Konsumtionen':
      dataPoint = item.TotalConsumptionEmission
      break
    default:
      dataPoint = item.BicycleMetrePerCapita
  }

  return {
    name: item.Name,
    dataPoint,
  }
})
