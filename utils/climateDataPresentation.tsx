/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmissionPerYear } from './types'
import { colorTheme } from '../Theme'


// This file: How do we cluster/sort/color the historical sectors?

// Top to bottom order we expect on the screen
export const historicalSectorOrder = [
  'Transporter',
  'Utrikes transporter',

  'Industri (energi + processer)',

  'Jordbruk',

  'Egen uppärmning av bostäder och lokaler',
  'El och fjärrvärme',

  'Arbetsmaskiner',
  'Produktanvändning (inkl. lösningsmedel)',
  'Avfall (inkl.avlopp)',
]

export const compareSector = (
  { Name: NameA }: {Name: string},
  { Name: NameB }: {Name: string},
) => Math.sign(historicalSectorOrder.indexOf(NameB)
             - historicalSectorOrder.indexOf(NameA))

export const isCementSector = (name: string) => {
  return [
    'Mörbylånga',
    'Skövde',
    'Gotland',
  ].includes(name)
}
export const colorOfSector = (name: string) => ({
  'Transporter': colorTheme.sectors.transports,
  'Utrikes transporter': colorTheme.sectors.transports,

  'Industri (energi + processer)': colorTheme.sectors.industry,

  'Jordbruk': colorTheme.sectors.jordbruk,

  'Egen uppärmning av bostäder och lokaler': colorTheme.sectors.heatingEnergy,
  'El och fjärrvärme': colorTheme.sectors.heatingEnergy,

  'Arbetsmaskiner': colorTheme.sectors.other,
  'Produktanvändning (inkl. lösningsmedel)': colorTheme.sectors.other,
  'Avfall (inkl.avlopp)': colorTheme.sectors.other,
}[name] || { border: '#FFFFFF', fill: '#FFFFFF' })

export const kiloTonString = (tonsCO2Equivalent: number) => {
 return (tonsCO2Equivalent / 1000).toFixed(1)
}

// Original SMHI data contains typo
export const fixSMHITypo = (sectorName: string) => {
  return sectorName.replace('uppärmning', 'uppvärmning')
}

export const getEmissionsOfYear = (emissions: Array<EmissionPerYear>, year: number) => {
  const ret = emissions.find(({Year}) => Year === year)
  if (ret) return ret.CO2Equivalent
  return -999
}

export const sumEmissionsPerYear = (emissions: Array<EmissionPerYear>) => {
  return emissions.reduce(
    (total, { CO2Equivalent }) => total + CO2Equivalent,
    0,
  )
}