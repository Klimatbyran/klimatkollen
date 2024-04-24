const { i18n } = require('./next-i18next.config')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

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
    return [
      {
        source: '/kommuner',
        destination: '/',
        permanent: true,
      },
      {
        source: '/kommuner/kommun/ume%C3%A5/parisavtalet',
        destination: '/',
        permanent: true,
      },
    ]
  },
})
