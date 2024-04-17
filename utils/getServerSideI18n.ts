import i18n from 'i18next'
import { resolve, join } from 'path'
import Backend from 'i18next-fs-backend'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import nextI18nextConfig from '../next-i18next.config'

const backend = new Backend(undefined, {
  loadPath: join(resolve('./public/locales'), '/{{lng}}/{{ns}}.json'),
})

export async function getServerSideI18n(locale: string, namespacesRequired: string | string[]) {
  // Get config to use pass along for client side translations
  const config = await serverSideTranslations(locale, namespacesRequired, nextI18nextConfig)

  // HACK: init i18next directly to be able to use translations outside of the Next.js/React context.
  const t = await i18n.use(backend).init({
    fallbackLng: nextI18nextConfig.i18n.defaultLocale,
    defaultNS: 'common',
    lng: nextI18nextConfig.i18n.defaultLocale,
    fallbackNS: 'common',
    ns: namespacesRequired,
  })

  return { ...config, t }
}
