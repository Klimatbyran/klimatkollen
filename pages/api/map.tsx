import type { NextApiRequest, NextApiResponse } from 'next'

import kommuner from '../data/kommuner.json'
import { ONE_WEEK_MS } from '../../utils/shared'

export default function userHandler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      res.setHeader('Cache-Control', `public, stale-while-revalidate=60, max-age=${ONE_WEEK_MS}`)
      res.json(kommuner)
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
