import { GetServerSideProps } from 'next'

import { ClimateDataService } from '../utils/climateDataService'
import {
  generateMunicipalitySitemapData,
  generateSitemap,
} from '../utils/generateMunipacitySitemap'
import { getServerSideI18n } from '../utils/getServerSideI18n'

export const getServerSideProps: GetServerSideProps = async ({ res, locale }) => {
  const { t } = await getServerSideI18n(locale as string, ['common', 'sitemap'])

  const municipalities = new ClimateDataService().getMunicipalities()
  const municipalitiesSitemap = generateMunicipalitySitemapData({ municipalities })
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
