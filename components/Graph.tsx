import Head from 'next/head'
import { useEffect, useState } from 'react'
import { path } from 'd3-path'
import { animated, Controller, useSpring } from 'react-spring'
import bezier from 'bezier-curve'

// https://dev.to/tomdohnal/react-svg-animation-with-react-spring-4-2kba

type Co2Year = { year: number; co2: number }

const max = (array: Array<Co2Year>, key: 'year' | 'co2') => {
  return Math.max(...array.map((d) => d[key]))
}

const bezierCurve = (normalizedData: [number, number]) => {
  const curve = []
  for (let t = 0; t < 1; t += 0.01) {
    const point = bezier(t, normalizedData)
    curve.push(point)
  }
  return curve
}

type Data = {
  pledgesPath?: string
  parisPath?: string
  historyPath?: string
}

type Props = {
  history: string
  pledges: string
  paris: string
  klimatData: Array<Data>
  currentStep: number
  width: number
  height: number
}

const Graph = ({ klimatData, currentStep, width, height }: Props) => {
  const [loaded, setLoaded] = useState(false)
  const [showNow, setShowNow] = useState(false)
  const [showParis, setShowParis] = useState(false)
  const [showPledges, setShowPledges] = useState(false)
  const [minYear, setMinYear] = useState(1990)
  const [maxYear, setMaxYear] = useState(2030)
  // const controller = new Controller({ minYear: 1990, maxYear: 2020 })
  // const [maxCo2, setMaxCo2] = useState(max(data, 'co2'))
  // const props = useSpring({ val: 100000, from: { val: 0 } })
  // const { maxYear, minYear } = controller.get()

  const pledgesProps = useSpring({
    d: klimatData[currentStep].pledgesPath,
  })

  const parisProps = useSpring({
    d: klimatData[currentStep].parisPath,
  })

  const historyProps = useSpring({
    d: klimatData[currentStep].historyPath,
  })

  useEffect(() => {
    setTimeout(() => setLoaded(true), 300)
  }, [])

  const YearLabel = ({
    width = 500,
    height = 240,
    year,
    offset = 0,
  }: {
    width?: number
    height?: number
    offset?: number
    year: number
  }) => {
    const x = ((year - minYear) / (maxYear - minYear)) * width
    const y = height + 30 - offset
    return (
      <text className="label" transform={`translate(${x}, ${y})`}>
        {year}
      </text>
    )
  }

  useEffect(() => {
    switch (currentStep) {
      case 0:
        setShowNow(true)
        setShowParis(false)
        setShowPledges(false)
        setMinYear(1990)
        setMaxYear(2020)
        // controller.update({ minYear: 1990, maxYear: 2020 })
        // controller.start()

        break
      case 1:
        setShowNow(true)
        setShowParis(true)
        setShowPledges(false)
        setMinYear(1990)
        setMaxYear(2030)
        // controller.update({ minYear: 1990, maxYear: 2020 })
        // controller.start()

        break
      case 2:
        setShowNow(true)
        setShowPledges(true)
        setShowParis(true)
        setMinYear(1990)
        setMaxYear(2030)
        // controller.update({ minYear: 1990, maxYear: 2030 })
        // controller.start()

        break
      case 3:
        setShowNow(true)
        setShowParis(true)
        setShowPledges(true)
        setMinYear(2018)
        // controller.update({ minYear: 2018, maxYear: 2030 })
        // controller.start()

        break
      default:
        break
    }
  }, [currentStep])

  // const [pledgesPath, setPledgesPath] = useState<string>('')
  // const [parisPath, setParisPath] = useState<string>('')
  // const [nowPath, setNowPath] = useState<string>('')

  // useEffect(() => {
  //   const line = (data: Array<Co2Year>) => {
  //     if (!data.length) return ''
  //     const p = path()
  //     const normalizedData = data.map((d: { year: number; co2: number }) => [
  //       ((d.year - minYear) * width) / (maxYear - minYear),
  //       height - (d.co2 / maxCo2) * height,
  //     ])
  //     // console.log({ minYear, maxYea, normalizedData })
  //     // start at the top left
  //     p.moveTo(normalizedData[0][0], normalizedData[0][1])
  //     // console.log({ normalizedData })
  //     // draw all the datapoints

  //     // const curve = [
  //     //   ...bezierCurve(normalizedData.slice(0, normalizedData.length / 2)),
  //     //   ...bezierCurve(normalizedData.slice(normalizedData.length / 2)),
  //     // ]

  //     const curve = normalizedData // bezierCurve(normalizedData)

  //     curve.forEach((d) => {
  //       p.lineTo(d[0], d[1])
  //     })

  //     // draw the bottom of the line
  //     p.lineTo(normalizedData[normalizedData.length - 1][0], height)
  //     p.lineTo(normalizedData[0][0], height)
  //     p.lineTo(normalizedData[0][0], normalizedData[0][1])
  //     p.closePath()
  //     console.log('line', p.toString())
  //     return p.toString()
  //   }

  //   setPledgesPath(line(pledges))
  //   setParisPath(line(paris))
  //   setNowPath(line(data))
  // }, [data, pledges, paris, height, width, maxCo2, minYear, maxYear])

  // if (data.length === 0) return null

  return (
    <>
      <Head>
        <title>Klimatkollen</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={loaded ? 'loaded' : ''}>
        <svg viewBox={`0 -10 ${width} ${height + 30}`}>
          <defs>
            <filter id="dropshadow">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3"></feGaussianBlur>
              <feOffset dx="0" dy="0" result="offsetblur"></feOffset>
              <feComponentTransfer>
                <feFuncA slope="0.2" type="linear"></feFuncA>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode></feMergeNode>
                <feMergeNode in="SourceGraphic"></feMergeNode>
              </feMerge>
            </filter>
          </defs>
          <g className="datasets">
            <animated.path
              className="dataset show"
              d={historyProps.d}
              id="dataset-1"></animated.path>
            <animated.path
              className="dataset show"
              d={pledgesProps.d}
              id="dataset-2"></animated.path>
            <animated.path
              className="dataset show"
              d={parisProps.d}
              id="dataset-3"></animated.path>
          </g>

          {/* <text x="0" y="15" className="label">
            {Math.ceil(maxCo2 / 1000) * 1000} co2
          </text> */}
          <YearLabel key="1" year={1990} />
          <YearLabel key="2" year={2000} />
          <YearLabel key="3" year={2010} />
          <YearLabel key="4" year={2020} />
          <YearLabel key="5" year={2025} />
        </svg>
      </div>
    </>
  )
}

export default Graph
