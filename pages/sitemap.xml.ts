// pages/sitemap.xml.js

import { NextApiResponse } from 'next'
import { ClimateDataService } from '../utils/climateDataService'
import {
  generateMunipacitySitemapData,
  generateSitemap,
} from '../utils/generateMunipacitySitemap'

export async function getServerSideProps({ res }: { res: NextApiResponse }) {
  const municipalities = new ClimateDataService().getMunicipalities()
  const municipalitiesSitemap = generateMunipacitySitemapData({
    municipalities,
  })
  // Generate the XML sitemap with the blog data
  const sitemap = generateSitemap(municipalitiesSitemap)

  res.setHeader('Content-Type', 'text/xml')
  // Send the XML to the browser
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default function SiteMap() {}
