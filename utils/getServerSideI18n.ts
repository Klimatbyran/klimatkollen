import { i18n } from 'next-i18next'
import { i18n as I18NextClient } from 'i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import nextI18nextConfig from '../next-i18next.config'

/**
 * Use this to conveniently set up i18n for usage on the server side outside of the React context.
 *
 * NOTE: If you only need i18n within the page component, use serverSideTranslations() directly.
 */
export async function getServerSideI18n(locale: string, namespacesRequired: string | string[]) {
  const config = await serverSideTranslations(locale, namespacesRequired, { ...nextI18nextConfig, initImmediate: true })
  // We could expose more from i18n if we need more API:s than the standard `t()`
  const { t } = (i18n as I18NextClient)

  return { ...config, t }
}
