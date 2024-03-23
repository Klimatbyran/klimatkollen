/* eslint-disable max-len */
/* eslint-disable no-console */
import axios, { AxiosError } from 'axios'
import fs from 'fs'
import readline from 'readline'
import { exec, spawn } from 'child_process'
import { TrafaResponseObject } from './types'
import { TrafaClient } from './client'

export const TRAFA_BASE_URL = 'https://api.trafa.se/api/data'
const TIMESTAMP = new Date().toISOString()
/**
 * Axios instance for making requests to the TRAFA API.
 */
const trafaApi = axios.create({
  baseURL: TRAFA_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a response interceptor to the axios instance
trafaApi.interceptors.response.use((response) => {
  const res = response.data
  // if the response contains errors, throw an error with the error messages joined by a comma
  if (res?.Errors?.length > 0) {
    throw new Error(res.Errors.map((e: string) => e).join(', '))
  }
  return response
})

/**
 * Fetches Trafa data based on the provided query.
 * @param query - The query string to search for Trafa data.
 * @returns A Promise that resolves to a TrafaResponseObject.
 * @throws An Error if the data fetching fails.
 */
export const fetchTrafaData = async (query: string): Promise<TrafaResponseObject> => {
  try {
    const res = await trafaApi.get(`?query=${query}`)
    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError
      // @ts-expect-error response is not always defined
      console.error(axiosError.response?.data?.Message ?? axiosError.message)
    } else {
      console.error(error)
    }
    throw new Error('Failed to fetch data from Trafa')
  }
}

/**
 * Retrieves the current Git user name.
 * @returns A promise that resolves with the current Git user name.
 */
const currentGitUser = () => new Promise<string>((resolve, reject) => {
  exec('git config user.name', (error, stdout) => {
    if (error) {
      reject(error)
    } else {
      resolve(stdout.trim())
    }
  })
})
const processFiles = () => new Promise<void>((resolve, reject) => {
  const python = spawn('python3', [
    './data/trafa/data_to_xlsx.py',
    '--function',
    'process_json_files',
  ])
  console.log(`%s: Running python script...${python.pid}`, TIMESTAMP)

  python.stdout.on('data', (data) => {
    console.log(`%s: stdout: ${data}`, TIMESTAMP)
  })

  python.stderr.on('data', (data) => {
    console.error(`%s: stderr: ${data}`, TIMESTAMP)
  })

  python.on('close', (code) => {
    if (code !== 0) {
      reject(new Error(`${TIMESTAMP}: (error) python script exited with code ${code}`))
    } else {
      resolve()
    }
  })
})

/**
 * Writes the provided data to a file and saves metadata containing the last fetched date and git user name.
 * @param data - The data to be written to the file.
 */
const dataToFile = async ({
  data,
  outputFolder = 'data/trafa/downloads',
}: {
  data: TrafaResponseObject
  outputFolder?: string

}) => {
  const year = data.Header.Column.find((c) => c.Name === 'ar')?.Filters![0] ?? 'unknown'
  console.log(`%s: Writing data for ${year}`, TIMESTAMP)
  const fileName = `${data.Name}-${year}.json`
  const filePath = `${outputFolder}/${fileName}`
  const metadataPath = `${outputFolder}/metadata.yml`
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true })
  }
  const currentUser = (await currentGitUser()) ?? 'unknown'
  const metadata = `lastFetched: ${new Date().toLocaleString('sv')}\nlastFetchedBy: ${currentUser}`
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  fs.writeFileSync(metadataPath, metadata)
}

/**
 * Fetches Trafa data for all years from 2015 to the current year.
 */
export const fetchAllYearDataFrom2015ToNow = async (outputFolder?: string) => {
  const client = new TrafaClient()
  const currentYear = new Date().getFullYear()
  const yearsFrom2015 = Array.from({ length: currentYear - 2015 }, (_, i) => 2015 + i)
  const queries = yearsFrom2015.map((year) => client
    .setYear(year.toString())
    .setMeasure(['nyregunder', 'itrfslut'])
    .setTarget({ category: 'communal', target: 'cars' })
    .setFuel(['el', 'laddhybrid'])
    .build())

  try {
    const data = await Promise.allSettled(
      queries.map((list) => fetchTrafaData(list.query)),
    )
    data.forEach((d) => {
      if (d.status === 'fulfilled') {
        dataToFile({
          data: d.value,
          outputFolder,
        })
      } else {
        console.error(` %s: (error) ${d.reason}`, TIMESTAMP)
      }
    })
  } catch (error) {
    console.error(`%s: (error) ${error}`, TIMESTAMP)
  }
}

/**
 * Fetches year data from Trafa API.
 * If no year is provided, it fetches data for the current year.
 *
 * @param year - The year for which to fetch the data.
 * @returns A Promise that resolves to the fetched data.
 */
const fetchYearData = async (year?: number) => {
  const client = new TrafaClient()
  const currentYear = new Date().getFullYear()
  const yearToFetch = year ?? currentYear
  console.log(`%s: Fetching data for ${currentYear}`, TIMESTAMP)
  const metadataPath = 'data/trafa/downloads/metadata.yml'
  const metadata = fs.readFileSync(metadataPath, 'utf8')
  console.log('%s: -------------------------------Metadata-------------------------------- ', TIMESTAMP)
  console.table(metadata)

  const { query, url } = client
    .setYear(yearToFetch.toString())
    .setMeasure(['nyregunder', 'itrfslut'])
    .setTarget({ category: 'communal', target: 'cars' })
    .setFuel(['el', 'elhybrid', 'laddhybrid'])
    .build()

  console.log('%s: -----------------------------QUERY-------------------------------------', TIMESTAMP)
  console.log('%b: Fetching data with query: %s', TIMESTAMP, url)
  console.log('-----------------------------------------------------------------------')

  console.log('%s: -----------------------------DATA--------------------------------------', TIMESTAMP)
  console.log('%s: Fetching data...', TIMESTAMP)
  console.log('%s: -----------------------------------------------------------------------', TIMESTAMP)
  console.log(`%s:${query}`, TIMESTAMP)
  // try {
  //   const data = await fetchTrafaData(query)
  //   dataToFile(data)
  // } catch (error) {
  //   if (error instanceof Error) console.error(error?.message)
  // }
}

/**
 * Checks if the Git worktree is empty.
 * @returns A promise that resolves to a boolean indicating whether the worktree is empty or not.
 */
const isEmptyWorktree = () => new Promise<boolean>((resolve, reject) => {
  exec('git status --porcelain', (error, stdout) => {
    if (error) {
      reject(error)
    } else {
      if (stdout.trim() !== '') {
        console.error('%s: (ERROR)There are uncommitted changes in the repository. Please commit or stash them before running this script.', TIMESTAMP)
        resolve(false)
      }
      resolve(true)
    }
  })
})

/**
 * Asks the user if they want to commit the changes to the repository.
 * If the user answers 'y', it adds, commits, and pushes the changes to the repository.
 * Closes the readline interface after execution.
 */
function askForCommit(rl: readline.Interface) {
  rl.question(
    'Do you want to commit the changes to the repository? (y/n) ',
    async (answer) => {
      if (answer === 'y') {
        exec(
          'git add . && git commit -m "chore: Update Trafa electric car data" && git push',
          (error, stdout) => {
            if (error) {
              console.error(error)
            } else {
              console.log(`%s: ${stdout}`, TIMESTAMP)
              console.log('%s: Changes committed successfully!', TIMESTAMP)
            }
          },
        )
      }
      console.log('%s: Script execution complete! Exiting...', TIMESTAMP)
      rl.close()
    },
  )
}

const main = async () => {
  [
    'Welcome to the TRAFA data fetching script!',
    'This script fetches data from the TRAFA API and processes it into Excel files.',
    "The data is fetched for 'Fordon i län och kommuner' , 'Personbilar' ,  'Antal nyregistreringar', 'Antal i trafik'.",
    'The script also commit the changes to the repository after processing the data.',
  ].forEach((message) => console.log(`%s: ${message}`, TIMESTAMP))
  const worktreeStatus = await isEmptyWorktree()
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  if (!worktreeStatus) {
    rl.close()
    process.exit(1)
  }
  const options = [
    'Fetch data for current year',
    'Fetch data for a specific year',
    'Fetch data for all years from 2015 to now',
  ]
  console.log('%s: Choose an option:', TIMESTAMP)
  options.forEach((option, index) => console.log(`%s: ${index + 1}. ${option}`, TIMESTAMP))
  rl.question('Enter the number of the option you want to choose: ', async (answer) => {
    switch (answer) {
      case '1':
        try {
          await fetchYearData()
          await processFiles()
          askForCommit(rl)
        } catch (error) {
          rl.close()
        }
        break
      case '2':
        rl.question('Which year do you want to fetch data for? ', async (year) => {
          const yearRegex = /^\d{4}$/
          if (!yearRegex.test(year)) {
            console.log('%s: (error) Invalid year', TIMESTAMP)
            return
          }
          if (
            parseInt(year, 10) < 2015
            || parseInt(year, 10) > new Date().getFullYear()
          ) {
            console.log('%s: (error) Invalid year', TIMESTAMP)
            return
          }
          try {
            await fetchYearData(parseInt(year, 10))
            await processFiles()
            askForCommit(rl)
          } catch (error) {
            rl.close()
          }
        })

        break
      case '3':
        try {
          await fetchAllYearDataFrom2015ToNow()
          await processFiles()
          askForCommit(rl)
        } catch (error) {
          rl.close()
        }
        break
      default:
        console.log('%s: Invalid option', TIMESTAMP)
        break
    }
  })
}
main()
