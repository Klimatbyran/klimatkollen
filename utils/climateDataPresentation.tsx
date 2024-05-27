/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmissionPerYear } from './types'
import { colorTheme } from '../Theme'

// This file: How do we cluster/sort/color the historical sectors?

// Top to bottom order we expect on the screen
export const historicalSectorOrder = [
  'Transport',
  'Industri',
  'Jordbruk',
  'Energi',
  'Övrigt',
]

export const compareSector = (
  { Name: NameA }: {Name: string},
  { Name: NameB }: {Name: string},
) => Math.sign(historicalSectorOrder.indexOf(NameB) - historicalSectorOrder.indexOf(NameA))

export const isCementSector = (name: string) => [
  'Mörbylånga',
  'Skövde',
  'Gotland',
].includes(name)

export const colorOfSector = (name: string) => ({
  Transport: colorTheme.sectors.transports,
  Industri: colorTheme.sectors.industry,
  Jordbruk: colorTheme.sectors.agriculture,
  Energi: colorTheme.sectors.energy,
  Övrigt: colorTheme.sectors.other,
}[name] || { border: '#FFFFFF', fill: '#FFFFFF' })

export const kiloTonString = (tonsCO2Equivalent: number) => (tonsCO2Equivalent / 1000).toFixed(1)

// Original SMHI data contains typo
export const fixSMHITypo = (sectorName: string) => sectorName.replace('uppvärmning', 'uppvärmning')

export const sumEmissionsPerYear = (emissions: Array<EmissionPerYear>) => emissions.reduce(
  (total, { CO2Equivalent }) => total + CO2Equivalent,
  0,
)
