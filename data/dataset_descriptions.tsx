import { DatasetDescriptions, Municipality, SelectedData } from '../utils/types'

export const default_dataset = 'Utsläppen'

export const datasetDescriptions: DatasetDescriptions = {
  Utsläppen: {
    heading: 'Utsläppsförändring sedan Parisavtalet',
    body: 'På kartan och i listan visas genomsnittlig årlig förändring av kolidioxidutsläppen i Sveriges kommuner sedan Parisavtalet 2015.',
    source: (
      <>
        Källa:{' '}
        <a
          href="https://nationellaemissionsdatabasen.smhi.se/"
          target="_blank"
          rel="noreferrer">
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
    heading: 'Ökningstakt andel elbilar sedan Parisavtalet',
    body: 'På kartan och i listan visas ökningstakten i kommunerna för andel nyregistrerade laddbara bilar 2015–2022, angivet i procentenheter per år.',
    source: (
      <>
        Källa:{' '}
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
    heading: 'Kommuner som har klimatplaner',
    body: (
      <>
        På kartan och i listan visas vilka kommuner som har eller saknar aktuella
        klimatplaner, samt länkar till befintliga planer. Klicka{' '}
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSfCYZno3qnvY2En0OgRmGPxsrovXyAq7li52BuLalavMBbghA/viewform?usp=sf_link"
          target="_blank"
          rel="noreferrer">
          här
        </a>
        {' '}för att redigera informationen.
      </>
    ),
    source: (
      <>
        Källa:{' '}
        <a
          href="https://docs.google.com/spreadsheets/d/13CMqmfdd6QUD6agKFyVhwZUol4PKzvy253_EwtsFyvw/edit?fbclid=IwAR0v0cq0_xhFVlhhVn5fP-TNkOPVRXbOTKzTVWI_PMr_yU2rXOLjcN6jSps#gid=0"
          target="_blank"
          rel="noreferrer">
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
    heading: 'Antal meter cykelväg per invånare',
    body: 'På kartan och i listan visas antal meter cykelväg per invånare per kommun år 2022.',
    source: (
      <>
        Källa:{' '}
        <a
          href="https://nvdb2012.trafikverket.se/SeTransportnatverket"
          target="_blank"
          rel="noreferrer">
          Nationella Vägdatabasen/Trafikverket
        </a>
      </>
    ),
    boundaries: [1, 2, 3, 4, 5],
    labels: ['1 m -', '1-2 m', '2-3 m', '3-4 m', '4-5 m', '5 m +'],
    labelRotateUp: [],
    columnHeader: 'Cykelväglängd',
    dataType: 'Number',
    unit: 'm',
    tooltip:
      'Antal meter cykelväg per invånare per kommun år 2022 totalt för alla väghållare (statlig, kommunal, enskild)',
  },
}

export const data = (municipalities: Array<Municipality>, selectedData: SelectedData) => {
  return municipalities.map((item) => ({
    name: item.Name,
    dataPoint:
      selectedData === 'Utsläppen'
        ? item.HistoricalEmission.EmissionLevelChangeAverage
        : selectedData === 'Elbilarna'
        ? item.ElectricCarChangePercent
        : selectedData === 'Klimatplanerna'
        ? item.ClimatePlan.Link
        : item.BicycleMetrePerCapita,
  }))
}
