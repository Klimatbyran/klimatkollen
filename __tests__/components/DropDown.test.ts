import { test } from 'vitest'
import { getSortedMunicipalities, search } from './DropDown'

test('Municipalities should be sorted by Swedish alphabetical order', () => {
  expect(
    getSortedMunicipalities(['Örebro', 'Säffle', 'Älmhult', 'Åre', 'Karlshamn']),
  ).toEqual(['Karlshamn', 'Säffle', 'Åre', 'Älmhult', 'Örebro'])
})

describe('When searching a list of sorted municipalities', () => {
  const municipalities = ['Göteborg', 'Malmö', 'Stockholm', 'Södertälje']

  test('Results that do not include the query should be filtered out', () => {
    expect(search('holm', municipalities)).toEqual(['Stockholm'])
    expect(search('s', municipalities)).toEqual(['Stockholm', 'Södertälje'])
  })

  test('The search is case-insensitive', () => {
    expect(search('göt', municipalities)).toEqual(['Göteborg'])
    expect(search('GÖt', municipalities)).toEqual(['Göteborg'])
  })

  test('Results that start with the query should be prioritized', () => {
    expect(search('st', ['Avesta', 'Mariestad', 'Stockholm'])).toEqual([
      'Stockholm',
      'Avesta',
      'Mariestad',
    ])
  })
})
