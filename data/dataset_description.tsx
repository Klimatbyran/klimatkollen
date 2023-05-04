export const dataSetDescriptions = {
  'Utsläppen': {
    'heading': 'Utsläppsförändring sedan Parisavtalet',
    'body': 'På kartan och i listan visas genomsnittlig årlig förändring av kolidioxidutsläppen i Sveriges kommuner sedan Parisavtalet 2015.',
    'source':
      <>
        Källa:{' '}
        <a href='https://nationellaemissionsdatabasen.smhi.se/'
          target='_blank'
          rel='noreferrer'>
          SMHI
        </a>
      </>,
    'boundaries': [0, -0.01, -0.02, -0.03, -0.10],
    'labels': ['0% +', '0–1%', '1–2%', '2–3%', '3–10%', '10–15%'],
    'labelRotateUp': [true, false, false, false, false, false],
    'columnHeader': 'Utsläppsförändring',
    'tooltip': 'Genomsnittlig årlig förändring av kolidioxidutsläppen i Sveriges kommuner sedan Parisavtalet 2015, angivet i procent.',
  },
  'Elbilarna': {
    'heading': 'Ökningstakt andel elbilar sedan Parisavtalet',
    'body': 'På kartan och i listan visas ökningstakten i kommunerna för andel nyregistrerade laddbara bilar 2015–2022, angivet i procentenheter per år.',
    'source':
      <>
        Källa:{' '}
        <a href='https://www.trafa.se/vagtrafik/fordon/'
          target='_blank'
          rel='noreferrer'>
          Trafikanalys
        </a>
      </>,
    'boundaries': [0.04, 0.05, 0.06, 0.07, 0.08],
    'labels': ['4 -', '4–5', '5–6', '6–7', '7–8', '8 +'],
    'labelRotateUp': [true, true, true, true, true, true],
    'columnHeader': 'Ökning elbilar',
    'tooltip': 'Ökningstakten för andelen nyregistrerade laddbara bilar sedan Parisavtalet 2015 i procentenheter per år',
  },
  'Klimatplanerna': { // FIXME
    'heading': 'Kommuner som har en aktiv klimatplan',
    'body': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
    'source':
      <>
        Källa:{' '}
        <a href='www.klimatkollen.se'
          target='_blank'
          rel='noreferrer'>
          Klimatkollen
        </a>
      </>,
    'boundaries': ['Saknas', ''],
    'labels': ['Ja', 'Nej'],
    'labelRotateUp': [true, false],
    'columnHeader': 'Klimatplan',
    'tooltip': 'Om kommunen har en klimatplan',
  }
}