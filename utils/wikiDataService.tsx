import { Municipality, MunicipalityData } from "./types"
import axios, { AxiosError, AxiosResponse } from 'axios';

// @ts-ignore
import WikiDataSdk from "wikidata-sdk"
// @ts-ignore
import md5 from "md5"

export type WikiDataImage = {
    ImageUrl: string
    Description: string
}

export type WikiDataMunicipality = {
    CoatOfArmsImage: WikiDataImage
    Population: number
    Image: WikiDataImage
} 

export class WikiDataService {
    constructor() {}

    public async getMunicipalityByName(name: string): Promise<WikiDataMunicipality> {
        const promise = new Promise<WikiDataMunicipality>((resolve, reject) => {
            const url = WikiDataSdk.getEntitiesFromSitelinks(name + " Municipality")

            axios.get(url)
                .then((response) => {
                    const pageName = Object.getOwnPropertyNames(response.data.entities).shift();
            
                    if (pageName && pageName != "-1") {
                        let municipality : WikiDataMunicipality = {
                            CoatOfArmsImage: {
                                ImageUrl : "",
                                Description: ""
                            },
                            Population: 0,
                            Image: {
                                ImageUrl : "",
                                Description: ""
                            }
                        }
                
                        var page = response.data.entities[pageName];
                        
                        municipality.CoatOfArmsImage = this.getCoatOfArmsFromPage(page);
                        municipality.Population = this.getPopulationFromPage(page)
                        municipality.Image = this.getImageFromPage(page)
        
                        resolve(municipality)
                    }
                    else {
                        //kommun-sida hittades ej
                        reject("Kommun-sida hittades ej i Wikidata")
                    }
                });
            
        })
        return promise
    }

    getCoatOfArmsFromPage(page:any) : WikiDataImage {
        return this.getPreferredImageUrl(page.claims.P94)
    }

    getPopulationFromPage(page:any) : number {
        
        page.claims.P1082.sort((elem1:any, elem2:any) => {
            var date1 = elem1.qualifiers.P585[0].datavalue.value.time
            var date2 = elem2.qualifiers.P585[0].datavalue.value.time
            if (date1 > date2)
                return -1
            else if (date1 < date2)
                return 1
            return 0
        })

        return parseInt(page.claims.P1082[0].mainsnak.datavalue.value.amount)
    }

    getImageFromPage(page:any) : WikiDataImage {
        return this.getPreferredImageUrl(page.claims.P18)
    }

    getPreferredImageUrl(listOfImages:Array<any>) : WikiDataImage {
        
        var bestImage = listOfImages.filter((vapen: any) => {
            return vapen.rank == "preferred"
        }).shift()

        if (!bestImage)
            bestImage = listOfImages[0]

        let imageUrl = bestImage.mainsnak.datavalue.value.replaceAll(" ", "_")

        console.log('md5', md5)
        let imageUrlHash = md5(imageUrl)
        let location = "https://upload.wikimedia.org/wikipedia/commons/[a]/[a][b]/".replaceAll("[a]", imageUrlHash.charAt(0)).replaceAll("[b]", imageUrlHash.charAt(1))

        return {
            ImageUrl: location + imageUrl,
            Description: bestImage.qualifiers ? bestImage.qualifiers.P2096[0].datavalue.value.text : ""
        } 
    }

}