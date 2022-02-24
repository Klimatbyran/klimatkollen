import type { NextApiRequest, NextApiResponse } from 'next'
import { EmissionService } from '../../../utils/emissionService'
import { WikiDataService } from '../../../utils/wikiDataService'
import { PolitycalRuleService } from '../../../utils/politicalRuleService'
import { Municipality } from '../../../utils/types'

export default function userHandler(req: NextApiRequest, res: NextApiResponse) {
  const name = req.query.name as string
  const method = req.method as string

  const emissionService = new EmissionService()
  const politicalRuleService = new PolitycalRuleService()
  switch (method) {
    case 'GET':
      Promise.all([
        emissionService.getMunicipality(name),
        emissionService.getMunicipalities(),
        new WikiDataService().getMunicipalityByName(name),
      ])
        .then((response) => {
          const municipality = response[0]
          const municipalities = response[1]
          const wikiDataMunicipality = response[2]

          municipality.Population = wikiDataMunicipality.Population
          municipality.CoatOfArmsImage = wikiDataMunicipality.CoatOfArmsImage
          municipality.Image = wikiDataMunicipality.Image

          municipality.AverageEmissionChangeRank = municipalities.find(
            (m: Municipality) => {
              return m.Name == municipality.Name
            },
          )?.AverageEmissionChangeRank

          municipality.PoliticalRule = politicalRuleService.getPoliticalRule(name)

          res.status(200).json(municipality)
        })
        .catch((error) => {
          console.log('error', error)
          return res.status(500).json(error)
        })

      break
    // case 'PUT':
    //   // Update or create data in your database
    //   res.status(200).json({ id, name: name || `User ${id}` })
    //   break
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
