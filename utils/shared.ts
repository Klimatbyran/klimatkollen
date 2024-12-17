import { slugifyURL } from './slugifyURL'

export const normalizeString = (input: string) => input.replace('ä', 'a').replace('ö', 'o').replace('å', 'a').toLowerCase()

export const toTitleCase = (str: string) => str.replace(
  /\w\S*/g,
  (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(),
)

export const ONE_WEEK_MS = 1000 * 60 * 60 * 24 * 7

const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:4321' : 'https://beta.klimatkollen.se'

export const getCompanyURL = (companyName: string, wikiId: string) => (
  `${baseURL}/foretag/${slugifyURL(companyName)}-${wikiId}`
)

export function isNumber(value: unknown): value is number {
  return Number.isFinite(value)
}
