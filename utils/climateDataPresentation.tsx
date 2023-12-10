/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Municipality,
  EmissionPerYear,
  EmissionSector,
  Budget,
  Emission,
  Trend,
  ClimatePlan,
  Named,
} from './types'


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
  { Name: NameA }: Named,
  { Name: NameB }: Named,
) => Math.sign(historicalSectorOrder.indexOf(NameB)
             - historicalSectorOrder.indexOf(NameA))

