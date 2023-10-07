import { datasetDescriptions, defaultViewMode, secondaryViewMode } from '../data/dataset_descriptions'

export const normalizeString = (input: string) =>
  input.replace('ä', 'a').replace('ö', 'o').replace('å', 'a').toLowerCase()

export const toTitleCase = (str: string) =>
  str.replace(
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

export const isValidViewMode = (viewMode: string) => {
  return [defaultViewMode, secondaryViewMode].includes(viewMode)
}