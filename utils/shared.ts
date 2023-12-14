import { datasetDescriptions, defaultDataView, secondaryDataView } from './datasetDescriptions'

export const normalizeString = (input: string) => input.replace('ä', 'a').replace('ö', 'o').replace('å', 'a').toLowerCase()

export const toTitleCase = (str: string) => str.replace(
  /\w\S*/g,
  (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
)

export const validDatasetsMap = Object.keys(datasetDescriptions).reduce<
  Record<string, string>
>((acc, key) => {
  const normalizedKey = normalizeString(key)
  acc[normalizedKey] = key
  return acc
}, {})

export const isValidDataset = (dataset: string) => {
  const normalizedDataset = normalizeString(dataset as string)
  return validDatasetsMap[normalizedDataset]
}

export const isValidDataView = (dataView: string) => [defaultDataView, secondaryDataView].includes(dataView)

export const daysToDateString = (days: number) => {
  if (days === 1e10) {
    return 'Håller budget'
  }

  const date = new Date('2024-01-01')
  date.setDate(date.getDate() + days)
  return date.toLocaleDateString('sv-SE')
}
