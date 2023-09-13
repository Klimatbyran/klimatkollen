/* eslint-disable @typescript-eslint/no-explicit-any */
// Fixme revisit when there's time
import RawPoliticalRule from '../data/facts/political/RawPoliticalRule'

export class PolitycalRuleService {
  public getPoliticalRule(municipalityName: string) : Array<string> {
    const rawMunicipality = RawPoliticalRule
      .find((rawPM: any) => rawPM.kommun.toLowerCase() === `${municipalityName.toLowerCase()} kommun`
                    || rawPM.kommun.toLowerCase() === `${municipalityName.toLowerCase()}s kommun`
                    || rawPM.kommun.toLowerCase() === `${municipalityName.toLowerCase()} stad`
                    || rawPM.kommun.toLowerCase() === `${municipalityName.toLowerCase()}s stad`
                    || rawPM.kommun.toLowerCase() === `region ${municipalityName.toLowerCase()}`
                    || rawPM.kommun.toLowerCase() === municipalityName.toLowerCase())

    let rule:Array<string> | null = []

    if (rawMunicipality) {
      rule = rawMunicipality.styre
        .split(',')
        .filter((rawMun: any) => rawMun !== '' && rawMun !== ' ')
        .map((partyShort:string) => {
          switch (partyShort) {
            case 'M':
              return 'Moderaterna'
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
              return rawMunicipality ? rawMunicipality.other : ''
            default:
              return 'Socialdemokraterna'
          }
        }) as string[]
    }

    return rule
  }
}
