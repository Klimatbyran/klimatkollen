import type { NextApiRequest, NextApiResponse } from 'next'
import { ClimateDataService } from '../../utils/climateDataService'

export default function userHandler(req: NextApiRequest, res: NextApiResponse) {
  const {
    method,
  } = req

  switch (method) {
    case 'GET':
      try {
        const municipalities = new ClimateDataService().getMunicipalities()
        if (municipalities.length < 1) {
          res.status(404).json('Inga kommuner hittades')
        } else {
          res.setHeader('Cache-Control', `public, stale-while-revalidate=60, max-age=${((60 * 60) * 24) * 7}`)
          res.status(200).json(municipalities)
        }
      } catch (error) {
        res.status(500).json(error)
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
