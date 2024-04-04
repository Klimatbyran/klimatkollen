import { dataDescriptions, defaultDataView, secondaryDataView } from './datasetDefinitions'

export const normalizeString = (input: string) => input.replace('ä', 'a').replace('ö', 'o').replace('å', 'a').toLowerCase()

export const toTitleCase = (str: string) => str.replace(
  /\w\S*/g,
  (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
)

export const validDatasetsMap = Object.keys(dataDescriptions).reduce<
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

export const replaceLetters = (name: string): string => {
  const replacements: Record<string, string> = {
    'Ã¥': 'å',
    'Ã¤': 'ä',
    'Ã¶': 'ö',
    'Ã…': 'Å',
    'Ã„': 'Ä',
    'Ã–': 'Ö',
  }

  const regex = new RegExp(Object.keys(replacements).join('|'), 'g')

  return name.replace(regex, (match) => replacements[match])
}
