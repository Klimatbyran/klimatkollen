import { defaultDataView, secondaryDataView } from '../pages/[dataGroup]/[dataset]/[dataView]'

export const normalizeString = (input: string) => input.replace('ä', 'a').replace('ö', 'o').replace('å', 'a').toLowerCase()

export const toTitleCase = (str: string) => str.replace(
  /\w\S*/g,
  (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(),
)

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
