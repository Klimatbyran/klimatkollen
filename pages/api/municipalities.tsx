import type { NextApiRequest, NextApiResponse } from 'next'
import { EmissionService } from '../../utils/emissionService'

export default function userHandler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id, name },
    method,
  } = req

  switch (method) {
    case 'GET':
      new EmissionService()
        .getMunicipalities()
        .then((municipalities) => {
          if (municipalities.length < 1) {
            res.status(404).json('Inga kommuner hittades')
          }

          res.setHeader('Cache-Control', 'public, max-age=' + ((60*60)*24)*7)
          res.status(200).json(municipalities)
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
