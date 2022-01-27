import type { NextApiRequest, NextApiResponse } from 'next'
import { getMunicipality } from '../../../utils/emissionService'
import { WikiDataService } from '../../../utils/wikiDataService'

export default function userHandler(req: NextApiRequest, res: NextApiResponse) {
  const name = req.query.name as string
  const method = req.method as string

  switch (method) {
    case 'GET':
      
      getMunicipality(name)
        .then((municipality) => {
          new WikiDataService().getMunicipalityByName(name)
            .then((wikiDataMunicipality) => {

              municipality.Population = wikiDataMunicipality.Population
              municipality.CoatOfArmsImage = wikiDataMunicipality.CoatOfArmsImage
              municipality.Image = wikiDataMunicipality.Image

              res.status(200).json(municipality)
            })
        })
        .catch((error) => {
          res.status(500).json(error)
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
