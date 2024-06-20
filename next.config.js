// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { i18n } = require('./next-i18next.config')

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

/** @type {require('next').NextConfig} */
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
  compiler: {
    styledComponents: {
      ssr: true,
      displayName: true,
    },
  },
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
