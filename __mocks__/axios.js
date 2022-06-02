import fs from 'fs'

const axiosMock = {
  get: (url) =>
    new Promise((resolve, reject) => {
      const searchParams = new URLSearchParams(url)

      if (searchParams.get('titles')) {
        const [municipalityName] = searchParams.get('titles').split(' ')

        // Load user json data from a file in de subfolder for mock data
        fs.readFile(
          `./__tests__/utils/__mockData__/${municipalityName}.json`,
          'utf-8',
          (err, data) => {
            if (err) {
              reject(err)
            }

            resolve({ data: JSON.parse(data.toString()) })
          },
        )
      }
    }),
}

export default axiosMock

