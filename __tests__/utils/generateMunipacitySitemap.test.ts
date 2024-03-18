import {
  generateMunipacitySitemapData,
  generateSitemap,
} from '../../utils/generateMunipacitySitemap'
import { Municipality } from '../../utils/types'

const municipalities = [{ Name: 'Stockholm' }, { Name: 'Göteborg' }] as Municipality[]
describe('generateSitemap', () => {
  it('should generate valid municipality sitemap data', () => {
    const siteMap = generateMunipacitySitemapData({ municipalities })
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
    const siteMap = generateMunipacitySitemapData({ municipalities })
    const sitemapXml = generateSitemap(siteMap)
    expect(() => new DOMParser().parseFromString(sitemapXml, 'text/xml')).not.toThrow()
  })
})
