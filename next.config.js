const { i18n } = require('./next-i18next.config')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const paths = [
  'utslappen',
  'koldioxidbudgetarna',
  'klimatplanerna',
  'konsumtionen',
  'elbilarna',
  'laddarna',
  'cyklarna',
  'upphandlingarna',
]

module.exports = withBundleAnalyzer({
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
  },

  reactStrictMode: true,
  i18n,

  // Redirects configuration
  async redirects() {
    return paths.map((path) => ({
      source: `/${path}/:slug*`,
      destination: '/',
      permanent: true,
    }))
  },
})
