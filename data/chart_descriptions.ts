import { ChartDescriptions } from '../utils/types'

export const chartDescriptions: ChartDescriptions = {
  historiskt:
  {
    text: 'historiska koldioxidutsläpp i kommunen sedan 1990',
  },
  trend: {
    text: 'utsläppstrenden om vi fortsätter släppa ut som idag',
  },
  parisavtalet: {
    text: 'hur mycket skulle utsläppen behöva minska för att vara i linje med Parisavtalets 1,5-gradersmål',
  },
}

export const chartsKeys = Object.keys(chartDescriptions)
export const defaultChart = chartsKeys[1]
