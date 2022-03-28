import { WikiDataService } from '../../utils/wikiDataService'

vi.mock('axios')

describe('#getMunicipalityByName()', () => {
  it('should get municipality', () => {
    return new WikiDataService()
      .getMunicipalityByName('Uddevalla')
      .then((municipality) => {
        expect(municipality).toBeDefined()
        expect(municipality.Population).toBe(57011)
        expect(municipality.CoatOfArmsImage.ImageUrl).toEqual(
          'https://upload.wikimedia.org/wikipedia/commons/1/10/Uddevalla_vapen.svg',
        )
        expect(municipality.CoatOfArmsImage.Description).toEqual('')
        expect(municipality.Image.ImageUrl).toEqual(
          'https://upload.wikimedia.org/wikipedia/commons/3/3b/Rådhuset_Uddevalla.JPG',
        )
        expect(municipality.Image.Description).toEqual('')
      })
  })
})

