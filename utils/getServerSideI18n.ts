/*  eslint-disable no-restricted-imports */
// import { i18n as I18NextClient } from 'i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Backend from 'i18next-fs-backend'
import i18n from 'i18next'
import { resolve, join } from 'path'
import nextI18nextConfig from '../next-i18next.config'

/**
 * HACK: Re-use the dynamically imported i18n instance rather than a static import.
 * This is needed to ensure i18n can be initialized and used during SSR.
 */
// globalThis.GLOBAL_i18n: I18NextClient

/**
 * Use this to conveniently set up i18n for usage on the server side outside of the React context.
 *
 * NOTE: If you only need i18n within the page component, use serverSideTranslations() directly.
 */
// export async function getServerSideI18nBROKEN(locale: string, namespacesRequired: string | string[]) {
//   const config = await serverSideTranslations(locale, namespacesRequired, {
//     ...nextI18nextConfig,
//     initImmediate: true,
//     onPreInitI18next(instance) {
//       console.log('INIT', instance.language)
//       globalThis.GLOBAL_i18n = instance
//     },
//   })

//   console.log('CONFIG', config._nextI18Next)

//   if (globalThis.GLOBAL_i18n) {
//     return { ...config, t: globalThis.GLOBAL_i18n.t }
//   }
//   console.warn('WARNING', globalThis.GLOBAL_i18n)
//   // HACK: workaround for initial rendering that happens without i18n for some reason
//   return {}
// }

const backend = new Backend(undefined, {
  loadPath: join(resolve('./public/locales'), '/{{lng}}/{{ns}}.json'),
})

export async function getServerSideI18n(locale: string, namespacesRequired: string | string[]) {
  const config = await serverSideTranslations(locale, namespacesRequired, {
    ...nextI18nextConfig,
  })

  const t = await i18n.use(backend).init({
    fallbackLng: nextI18nextConfig.i18n.defaultLocale,
    defaultNS: 'common',
    lng: nextI18nextConfig.i18n.defaultLocale,
    fallbackNS: 'common',
    ns: namespacesRequired,
  })

  return { ...config, t }
}
