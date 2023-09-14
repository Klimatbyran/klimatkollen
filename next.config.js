/** @type {import('next').NextConfig} */

module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
  },

  reactStrictMode: true,

  // i18n configuration
  i18n: {
    locales: ['sv'],
    defaultLocale: 'sv',
  },

    // Redirects configuration
    async redirects() {
      return [
        {
          source: '/partier/:path*',
          destination: '/partier',
          permanent: true,  // 301 redirect
        },
        {
          source: '/kommuner',
          destination: '/',
          permanent: true,  // 301 redirect
        },
        {
          source: '/kommuner/kommun/ume%C3%A5/parisavtalet',
          destination: '/',
          permanent: true,  // 301 redirect
        },
      ]
    },
}
