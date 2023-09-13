/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'

// FIXME revisit
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import WikiDataSdk from 'wikidata-sdk'
import md5 from 'md5'

export type WikiDataImage = {
  ImageUrl: string
  Description: string
}

export type WikiDataMunicipality = {
  CoatOfArmsImage: WikiDataImage | null
  Population: number | null
  Image: WikiDataImage | null
}

export class WikiDataService {
  public async getMunicipalityByName(name: string): Promise<WikiDataMunicipality> {
    const promise = new Promise<WikiDataMunicipality>((resolve, reject) => {
      function toTitleCase(str:string) {
        return str.toLowerCase().replace(/(?:^|[\s\-/])(\w|[\p{L}])/gu, (match) => match.toUpperCase())
      }

      const urlName = `${toTitleCase(name)} Municipality`
      const url = WikiDataSdk.getEntitiesFromSitelinks(urlName)
      axios.get(url).then((response) => {
        const pageName = Object.getOwnPropertyNames(response.data.entities).shift()

        if (pageName && pageName !== '-1') {
          const page = response.data.entities[pageName]

          const municipality: WikiDataMunicipality = {
            CoatOfArmsImage: this.getCoatOfArmsFromPage(page),
            Population: this.getPopulationFromPage(page),
            Image: this.getImageFromPage(page),
          }

          resolve(municipality)
        } else {
          reject(new Error('Kommun-sida hittades ej i Wikidata'))
        }
      })
    })
    return promise
  }

  getCoatOfArmsFromPage(page: any): WikiDataImage | null {
    if (!page.claims.P94) return null

    return this.getPreferredImageUrl(page.claims.P94)
  }

  getPopulationFromPage(page: any): number | null {
    if (!page.claims.P1082) return null

    page.claims.P1082.sort((elem1: any, elem2: any) => {
      const date1 = elem1.qualifiers.P585[0].datavalue.value.time
      const date2 = elem2.qualifiers.P585[0].datavalue.value.time
      if (date1 > date2) return -1
      if (date1 < date2) return 1
      return 0
    })
    return parseInt(page.claims.P1082[0].mainsnak.datavalue.value.amount, 10)
  }

  getImageFromPage(page: any): WikiDataImage | null {
    if (!page.claims.P18) return null
    return this.getPreferredImageUrl(page.claims.P18)
  }

  getPreferredImageUrl(listOfImages: Array<any>): WikiDataImage {
    let bestImage = listOfImages
      .filter((vapen: any) => vapen.rank === 'preferred')
      .shift()

    if (!bestImage) [bestImage] = listOfImages
    const imageUrl = bestImage.mainsnak.datavalue.value.replace(/ /g, '_')

    const imageUrlHash = md5(imageUrl)
    const location = 'https://upload.wikimedia.org/wikipedia/commons/[a]/[a][b]/'
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
