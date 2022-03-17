import axios from 'axios'

// @ts-ignore
import WikiDataSdk from 'wikidata-sdk'
// @ts-ignore
import md5 from 'md5'

export type WikiDataImage = {
  ImageUrl: string
  Description: string
}

export type WikiDataMunicipality = {
  CoatOfArmsImage: WikiDataImage | null
  Population: number | null
  Image: WikiDataImage
}

export class WikiDataService {
  constructor() {}

  public async getMunicipalityByName(name: string): Promise<WikiDataMunicipality> {
    const promise = new Promise<WikiDataMunicipality>((resolve, reject) => {
     
      function toTitleCase(str:string) {
        return str.toLowerCase().replace(/(?:^|[\s\-\/])(\w|[\p{L}])/gu, function (match) {
          return match.toUpperCase();
      });
    }
      
      const pageName = toTitleCase(name) + ' Municipality'
      const url = WikiDataSdk.getEntitiesFromSitelinks(pageName)
      axios.get(url).then((response) => {
        const pageName = Object.getOwnPropertyNames(response.data.entities).shift()

        if (pageName && pageName != '-1') {
          var page = response.data.entities[pageName]

          let municipality: WikiDataMunicipality = {
            CoatOfArmsImage: this.getCoatOfArmsFromPage(page),
            Population: this.getPopulationFromPage(page),
            Image: this.getImageFromPage(page),
          }

          resolve(municipality)
        } else {
          reject('Kommun-sida hittades ej i Wikidata')
        }
      })
    })
    return promise
  }

  getCoatOfArmsFromPage(page: any): WikiDataImage {
    if (!page.claims.P94)
      return null
    
    return this.getPreferredImageUrl(page.claims.P94)
  }

  getPopulationFromPage(page: any): number {
    if (!page.claims.P1082)
      return null

    page.claims.P1082.sort((elem1: any, elem2: any) => {
      const date1 = elem1.qualifiers.P585[0].datavalue.value.time
      const date2 = elem2.qualifiers.P585[0].datavalue.value.time
      if (date1 > date2) return -1
      else if (date1 < date2) return 1
      return 0
    })
    return parseInt(page.claims.P1082[0].mainsnak.datavalue.value.amount)
  }

  getImageFromPage(page: any): WikiDataImage {
    if (!page.claims.P18)
      return null
    return this.getPreferredImageUrl(page.claims.P18)
  }

  getPreferredImageUrl(listOfImages: Array<any>): WikiDataImage {
    let bestImage = listOfImages
      .filter((vapen: any) => {
        return vapen.rank == 'preferred'
      })
      .shift()

    if (!bestImage) bestImage = listOfImages[0]
    let imageUrl = bestImage.mainsnak.datavalue.value.replace(/ /g, '_')

    let imageUrlHash = md5(imageUrl)
    let location = 'https://upload.wikimedia.org/wikipedia/commons/[a]/[a][b]/'
      .replace(/\[a\]/g, imageUrlHash.charAt(0))
      .replace(/\[b\]/g, imageUrlHash.charAt(1))

    return {
      ImageUrl: location + imageUrl,
      Description:
        bestImage.qualifiers && bestImage.qualifiers.P2096
          ? bestImage.qualifiers.P2096[0].datavalue.value.text
          : '',
    }
  }
}
