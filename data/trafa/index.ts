import axios from 'axios'
import { TrafaResponseObject } from './types'
import { TrafaClient } from './client'

export const TRAFA_BASE_URL = 'https://api.trafa.se/api/data'
const trafaApi = axios.create({
  baseURL: TRAFA_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.TRAFA_API_KEY}`,
  },
})

trafaApi.interceptors.response.use((response) => {
  const res = response.data
  if (res.Errors) {
    throw new Error(res.Errors.map((e: string) => e).join(', '))
  }
  return response
})

export const fetchTrafaData = async (query: string): Promise<TrafaResponseObject> => {
  const res = await trafaApi.get(`?query=${query}`)
  return res.data
}

const electricVehiclesByYear = async () => {
  const client = new TrafaClient()
  const query = client
    .setYear('2023')
    .setMeasure(["nyregunder"])
    .setTarget({ category: "communal", target: 'cars' })
    .setFuel(['el'])
    .build(false)
  const data = await fetchTrafaData(query)
  console.log(data.Rows[0])
  return data
}

electricVehiclesByYear()
