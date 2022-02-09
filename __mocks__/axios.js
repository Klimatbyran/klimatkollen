const fs = require('fs')

const axiosMock =
    {
        get: (url) => new Promise((resolve, reject) => {

        let regEx = new RegExp("[?&]titles=([^+]+).*$")
        let municipalityName = url.match(regEx)[1]

        // Load user json data from a file in de subfolder for mock data
        fs.readFile(`./__tests__/utils/__mockData__/${municipalityName}.json`, 'utf-8', (err, data) => {
            if (err) {
                reject(err)
            }

            //console.log('data', data.toString())

            resolve({ data: JSON.parse(data.toString()) })
        })
    })
} 

export default axiosMock