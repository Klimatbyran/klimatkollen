import type { NextApiRequest, NextApiResponse } from 'next'
import kommuner from '../data/kommuner.json'

export default function userHandler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      res.setHeader('Cache-Control', 'public, s-maxage=604800') // a week
      res.json(kommuner)
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
