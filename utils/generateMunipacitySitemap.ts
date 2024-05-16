import { type TFunction } from 'next-i18next'

import { Municipality } from './types'

type SiteMap = {
  url: string
  lastModified: Date
  changeFrequency: string
  priority: number
  name?: string
}
const BASE_URL = 'https://klimatkollen.se'

export const generateMunicipalitySitemapData = ({
  municipalities,
}: {
  municipalities: Municipality[]
}): SiteMap[] => municipalities.map((m) => ({
  url: `${BASE_URL}/kommun/${m.Name.toLowerCase()}`,
  name: m.Name,
  lastModified: new Date(),
  changeFrequency: 'yearly',
  priority: 1,
}))

export const generateSitemap = (
  siteMap: SiteMap[],
  t: TFunction,
) => `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${BASE_URL}/utslappen/karta</loc>
        <name>${t('sitemap:emissionMap')}</name>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>yearly</changefreq>
      </url>
      <url>
        <loc>${BASE_URL}/om-oss</loc>
        <name>${t('sitemap:about')}</name>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
      </url>
      <url>
        <loc>${BASE_URL}/in-english</loc>
        <name>In English</name>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
      </url>
        ${siteMap
    .map(
      (s) => `
            <url>
            <loc>${s.url}</loc>
            <name>${s.name}</name>
            <lastmod>${s.lastModified.toISOString()}</lastmod>
            <changefreq>${s.changeFrequency}</changefreq>
            <priority>${s.priority}</priority>
            </url>
        `,
    )
    .join('')}
    </urlset>
  `
