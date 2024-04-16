import { GetServerSideProps } from 'next'
import { i18n } from 'next-i18next'
import { i18n as I18NextClient } from 'i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { ClimateDataService } from '../utils/climateDataService'
import {
  generateMunipacitySitemapData,
  generateSitemap,
} from '../utils/generateMunipacitySitemap'

export const getServerSideProps: GetServerSideProps = async ({ res, locale }) => {
  await serverSideTranslations(locale as string, ['common', 'sitemap'])
  const { t } = (i18n as I18NextClient)

  const municipalities = new ClimateDataService().getMunicipalities()
  const municipalitiesSitemap = generateMunipacitySitemapData({ municipalities })
  // Generate the XML sitemap with the blog data
  const sitemap = generateSitemap(municipalitiesSitemap, t)

  res.setHeader('Content-Type', 'text/xml')
  // Send the XML to the browser
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default function SiteMap() {}
