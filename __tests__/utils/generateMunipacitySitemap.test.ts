import { TFunction } from 'next-i18next'
import {
  generateMunicipalitySitemapData,
  generateSitemap,
} from '../../utils/generateMunipacitySitemap'
import { Municipality } from '../../utils/types'

const municipalities = [{ Name: 'Stockholm' }, { Name: 'Göteborg' }] as Municipality[]

const t = vi.fn((str) => str) as unknown as TFunction

describe('generateSitemap', () => {
  it('should generate valid municipality sitemap data', () => {
    const siteMap = generateMunicipalitySitemapData({ municipalities })
    expect(siteMap).toEqual([
      {
        url: 'https://klimatkollen.se/kommun/stockholm',
        name: 'Stockholm',
        lastModified: expect.any(Date),
        changeFrequency: 'yearly',
        priority: 1,
      },
      {
        url: 'https://klimatkollen.se/kommun/göteborg',
        name: 'Göteborg',
        lastModified: expect.any(Date),
        changeFrequency: 'yearly',
        priority: 1,
      },
    ])
  })

  it('should generate a valid sitemap XML string', () => {
    const siteMap = generateMunicipacitySitemapData({ municipalities })
    const sitemapXml = generateSitemap(siteMap, t)
    expect(() => new DOMParser().parseFromString(sitemapXml, 'text/xml')).not.toThrow()
  })
})
