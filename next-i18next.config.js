const path = require('path')

const DEV = process.env.NODE_ENV === 'development'

/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'sv',
    locales: ['sv'],
  },
  localePath: path.resolve('./public/locales'),
  // Allow reloading translations without restarting the dev server.
  reloadOnPrerender: DEV,
}
