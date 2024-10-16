import slugify from 'slugify'

export const slugifyURL = (url: string, locale = 'sv') => (
  slugify(url, {
    replacement: '-', // replace spaces with replacement character
    remove: undefined, // remove characters that match regex
    lower: true, // convert to lower case
    strict: true, // strip special characters except replacement
    locale, // locale identifier used to create locale-aware slugs
    trim: true, // trim leading and trailing replacement chars
  })
)
