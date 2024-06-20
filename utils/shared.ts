export const normalizeString = (input: string) => input.replace('ä', 'a').replace('ö', 'o').replace('å', 'a').toLowerCase()

export const toTitleCase = (str: string) => str.replace(
  /\w\S*/g,
  (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(),
)

export const ONE_WEEK_MS = 60 * 60 * 24 * 7

export const getCompanyURL = (companyName: string, wikiId: string) => {
  const baseURL = process.env.NODE_ENV === 'production' ? 'https://beta.klimatkollen.se' : 'http://localhost:4321'
  const dashName = companyName.toLowerCase().replaceAll(' ', '-')
  return `${baseURL}/foretag/${dashName}-${wikiId}`
}
