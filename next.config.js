const { i18n } = require('./next-i18next.config')
require('dotenv').config()

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const datasetPaths = [
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
    return [
      ...datasetPaths.map((path) => ({
        source: `/${path}/:slug*`,
        destination: '/',
        permanent: true,
      })),
      {
        source: '/bolagsklimatkollen',
        // Use Vercel-defined base URL by default to get the correct base URL in preview deployments too.
        destination: `${process.env.NEXT_PUBLIC_BASE_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL}/2024-06-Bolagsklimatkollen.pdf`,
        permanent: false,
      },
    ]
  },
})
