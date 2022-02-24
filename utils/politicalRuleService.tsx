//const fs = require('fs')
import { RawPoliticalRule } from "../resources/RawPoliticalRule"

export class PolitycalRuleService {
    public getPoliticalRule(municipalityName: string) : Array<string> {

        const rawmun = RawPoliticalRule
            .find((rawPM:any) => {
                return rawPM.kommun.toLowerCase() == municipalityName.toLowerCase() + " kommun" || 
                    rawPM.kommun.toLowerCase() == municipalityName.toLowerCase() + "s kommun" || 
                    rawPM.kommun.toLowerCase() == municipalityName.toLowerCase() + " stad" || 
                    rawPM.kommun.toLowerCase() == municipalityName.toLowerCase() + "s stad" ||  
                    rawPM.kommun.toLowerCase() == "region " + municipalityName.toLowerCase()|| 
                    rawPM.kommun.toLowerCase() == municipalityName.toLowerCase()
            })
            
        let rule:Array<string> | null = []
        
        if (rawmun) {
           rule = rawmun.styre
                .split(',')
                .filter((rawMun:any) => rawMun != '')
                .map((partyShort:string) => {
                    switch(partyShort){
                        case 'M':
                            return 'Moderaterna'
                        case 'S':
                            return 'Socialdemokraterna'
                        case 'L':
                            return 'Liberalerna'
                        case 'KD':
                            return 'Kristdemokraterna'
                        case 'V':
                            return 'Vänsterpartiet'
                        case 'C':
                            return 'Centerpartiet'
                        case 'MP':
                            return 'Miljöpartiet'
                        case 'SD':
                            return 'Sverigedemokraterna'
                        case 'ÖP':
                            return rawmun? rawmun.annatparti : ''
                    }
                }) as string[] 
        }

        return rule
    }

    // private tsvJSON(tsv:any) {
    //     const lines = tsv.split("\n");
    //     const result = [];
    //     const headers = lines[0].split("\t");
      
    //     for (let i = 2; i < lines.length; i++) {
    //         const currentline = lines[i].split("\t");
    //         const obj = {
    //             kommun: currentline[0],
    //             styre: currentline[12],
    //             annatparti: currentline[11]
    //         }
      
    //       result.push(obj);
    //     }
      
    //     return result;
    //   }
      
    // private readFromTSV() {
          
    //     const { readFileSync } = require('fs');
    //     const tsvFileData = readFileSync('./resources/politisk-majoritet-kommuner.tsv');
    //     const jsonRes = this.tsvJSON(tsvFileData.toString());
        
    //     console.log(JSON.stringify(jsonRes));
    // }
}