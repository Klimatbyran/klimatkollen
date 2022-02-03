// // import {fs} from 'fs';
// // import * as fs from 'fs'
// const HEIGHT = 480
// const WIDTH = 640

// export const loadData = (input: string) => {
//   const fs = require('fs')
//   const data = fs.readFileSync(input)
//   const text = data.toString()
//   const lines = text.split('\n')
//   const years = lines.slice(6, 7)[0].trim().split(';').slice(4)

//   return lines
//     .slice(7)
//     .map((line) => {
//       const fields = line.trim().split(';')
//       return {
//         mainSector: fields[0],
//         subSector: fields[1],
//         county: fields[2],
//         city: fields[3],
//         path: buildPath(fields.slice(4), HEIGHT, WIDTH),
//       }
//     })
//     .filter((record) => record.path.length > 0)
// }

// const buildPath = (data: any, height: number, width: number) => {
//   const max = data.map((d: any) => parseFloat(d)).sort()[data.length - 1]
//   if (!max) return ''

//   // Starting point
//   const startPoint = mapPoint('M', data.length - 1, max, data[0], 0, height, width)
//   // Points on the graph
//   const graph = data
//     .map((d: any, i: number) => mapPoint('L', data.length - 1, max, d, i, height, width))
//     .join('')
//   // Make a box, three points (bottom right, bottom left, top left), close path.
//   const boxLines = `L${WIDTH},${HEIGHT}L0,${HEIGHT}L0,${0}Z`
//   return startPoint + graph + boxLines
// }

// const mapPoint = (
//   prefix: string,
//   xPoints: number,
//   max: number,
//   d: string,
//   i: number,
//   height: number,
//   width: number,
// ) => {
//   // Y axis starts at the top
//   const y = height - (parseFloat(d) / max) * height
//   // X axis is divded into xPoints number of points
//   const x = (i / xPoints) * width
//   return `${prefix}${x},${y}`
// }

// //console.log(klimatData)
// // Print JSON string
// // console.log(JSON.stringify(klimatData))
