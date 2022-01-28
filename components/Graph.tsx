import Head from 'next/head'
import { useEffect, useState } from 'react'
import { path } from 'd3-path'
import { animated, useSpring, useTransition } from 'react-spring'
// https://dev.to/tomdohnal/react-svg-animation-with-react-spring-4-2kba

type Co2Year = { year: number; co2: number }

const max = (array: Array<Co2Year>, key: 'year' | 'co2') => {
  return Math.max(...array.map((d) => d[key]))
}
const min = (array: Array<Co2Year>, key: 'year' | 'co2') => {
  return Math.min(...array.map((d) => d[key]))
}

const line = (
  data: Array<Co2Year>,
  {
    width = 500,
    height = 240,
    maxYear = max(data, 'year'),
    minYear = min(data, 'year'),
    maxCo2 = max(data, 'co2'),
    minCo2 = min(data, 'co2'),
  }: {
    width?: number
    height?: number
    maxYear?: number
    minYear?: number
    maxCo2?: number
    minCo2?: number
  },
) => {
  if (!data.length) return ''
  const p = path()

  const normalizedData = data.map((d: { year: number; co2: number }) => ({
    x: ((d.year - minYear) * width) / (maxYear - minYear),
    y: height - (d.co2 / maxCo2) * height,
  }))
  console.log({ maxCo2, minCo2, normalizedData })
  // start at the top left
  p.moveTo(normalizedData[0].x, normalizedData[0].y)

  // draw all the datapoints
  normalizedData.forEach((d) => p.lineTo(d.x, d.y))

  // draw the bottom of the line
  p.lineTo(normalizedData[normalizedData.length - 1]?.x || 0, height)
  p.lineTo(normalizedData[0].x, height)
  p.lineTo(normalizedData[0].x, normalizedData[0].y)
  p.closePath()
  return p.toString()
}

const square = (
  data: Array<Co2Year>,
  {
    width = 500,
    height = 240,
    maxCo2 = max(data, 'co2') * data.length,
    x = 0,
  }: {
    width?: number
    height?: number
    maxCo2?: number
    minCo2?: number
    x?: number
  },
) => {
  if (!data.length) return ''
  const p = path()
  p.moveTo(x, height)
  const totalCo2 = data.reduce((sum, d: { year: number; co2: number }) => sum + d.co2, 0)
  p.lineTo(x, height - (totalCo2 / maxCo2) * height)
  p.lineTo(x + width / 2, height - (totalCo2 / maxCo2) * height)
  p.lineTo(x + width / 2, height)
  p.lineTo(x, height)
  p.closePath()
  return p.toString()
}

const YearLabel = ({
  width = 500,
  height = 240,
  maxYear = 2025,
  minYear = 1990,
  year,
  offset = 10,
}: {
  width?: number
  height?: number
  maxYear?: number
  minYear?: number
  offset?: number
  year: number
}) => {
  return (
    <text
      x={((year - minYear) / (maxYear - minYear)) * width}
      y={height + 30 - offset}
      className="year">
      {year}
    </text>
  )
}

const Graph = () => {
  const [loaded, setLoaded] = useState(false)
  const [showNow, setShowNow] = useState(false)
  const [showParis, setShowParis] = useState(false)
  const [showPledges, setShowPledges] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [width, height] = [500, 240]
  const [startYear, setStartYear] = useState(1990)

  useEffect(() => {
    setTimeout(() => setLoaded(true), 300)
  }, [])

  const data = [
    { year: 1990, co2: 244858 },
    { year: 1991, co2: 247335 },
    { year: 1992, co2: 249812 },
    { year: 1993, co2: 252289 },
    { year: 1994, co2: 254766 },
    { year: 1995, co2: 257243 },
    { year: 1996, co2: 259720 },
    { year: 1997, co2: 262197 },
    { year: 1998, co2: 264674 },
    { year: 1999, co2: 267151 },
    { year: 2000, co2: 269628 },
    { year: 2001, co2: 272967.8 },
    { year: 2002, co2: 276307.6 },
    { year: 2003, co2: 279647.4 },
    { year: 2004, co2: 282987.2 },
    { year: 2005, co2: 286327 },
    { year: 2006, co2: 294968 },
    { year: 2007, co2: 303609 },
    { year: 2008, co2: 312250 },
    { year: 2009, co2: 320891 },
    { year: 2010, co2: 329532 },
    { year: 2011, co2: 202260 },
    { year: 2012, co2: 197892 },
    { year: 2013, co2: 172924 },
    { year: 2014, co2: 138393 },
    { year: 2015, co2: 142491 },
    { year: 2016, co2: 139340 },
    { year: 2017, co2: 125147 },
    { year: 2018, co2: 146469 },
    { year: 2019, co2: 115844 },
  ]

  const pledges = [
    { year: 2019, co2: 115844 },
    { year: 2020, co2: 114844 },
    { year: 2021, co2: 113844 },
    { year: 2022, co2: 112844 },
    { year: 2023, co2: 111844 },
    { year: 2024, co2: 110000 },
    { year: 2025, co2: 109000 },
    { year: 2026, co2: 108000 },
    { year: 2027, co2: 107000 },
    { year: 2028, co2: 106000 },
    { year: 2029, co2: 105000 },
    { year: 2030, co2: 104000 },
  ]

  const paris = [
    //{ year: 2014, co2: 138393 },
    { year: 2019, co2: 115844 },
    { year: 2020, co2: 82491 },
    { year: 2021, co2: 66491 },
    { year: 2022, co2: 30340 },
    { year: 2023, co2: 20147 },
    { year: 2024, co2: 15844 },
    { year: 2025, co2: 14844 },
    { year: 2026, co2: 13844 },
    { year: 2027, co2: 12844 },
    { year: 2028, co2: 10844 },
    { year: 2029, co2: 5844 },
    { year: 2030, co2: 0 },
  ]

  const diff = pledges.map((d, i) => ({
    year: d.year,
    co2: d.co2 - paris[i].co2,
    offset: paris[i].co2,
  }))

  const step1 = () => {
    setShowNow(true)
    setShowParis(true)
    setShowPledges(false)
    setShowSummary(false)
    setStartYear(1990)
  }

  const step2 = () => {
    setShowNow(true)
    setShowParis(true)
    setShowPledges(true)
    setShowSummary(false)
    setStartYear(1990)
  }
  const step3 = () => {
    setShowNow(true)
    setShowParis(true)
    setShowPledges(true)
    setShowSummary(false)
    setStartYear(2018)
  }
  const step4 = () => {
    setShowNow(false)
    setShowParis(false)
    setShowPledges(false)
    setShowSummary(true)
    setStartYear(2020)
  }

  // const step5 = () => {
  //   setShowNow(false)
  //   setShowParis(true)
  //   setShowPledges(true)
  //   setShowSummary(false)
  //   setStartYear(2018)
  // }

  return (
    <>
      <Head>
        <title>Klimatkollen</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={loaded ? 'loaded' : ''}>
        <svg viewBox={`0 0 ${width} ${height + 30}`}>
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
              className="dataset"
              d={line(data, {
                minYear: startYear,
                maxYear: 2030,
                width,
                height,
                maxCo2: max(data, 'co2'),
              })}
              id="dataset-1"></animated.path>
            <animated.path
              className={showPledges || showSummary ? 'dataset show' : 'dataset hidden'}
              d={
                showSummary
                  ? square(pledges, {
                      width,
                      height,
                      x: 0,
                    })
                  : line(pledges, {
                      minYear: startYear,
                      maxYear: 2030,
                      maxCo2: max(data, 'co2'),
                    })
              }
              id="dataset-2"></animated.path>
            )
            <animated.path
              className={showParis || showSummary ? 'dataset show' : 'dataset hidden'}
              d={
                showSummary
                  ? square(paris, {
                      width,
                      height,
                      x: width / 2,
                    })
                  : line(paris, {
                      minYear: startYear,
                      maxYear: 2030,
                      width,
                      height,
                      maxCo2: max(data, 'co2'),
                    })
              }
              id="dataset-3"></animated.path>
          </g>
          {!showSummary && (
            <>
              <YearLabel minYear={startYear} maxYear={2030} year={1990} />
              <YearLabel minYear={startYear} maxYear={2030} year={2000} />
              <YearLabel minYear={startYear} maxYear={2030} year={2010} />
              <YearLabel minYear={startYear} maxYear={2030} year={2020} />
              <YearLabel minYear={startYear} maxYear={2030} year={2025} />
            </>
          )}
        </svg>
      </div>

      <button onClick={() => step1()}>step1</button>
      <button onClick={() => step2()}>step2</button>
      <button onClick={() => step3()}>step3</button>
      <button onClick={() => step4()}>step4</button>
      {/* <button onClick={() => step5()}>step5</button> */}
    </>
  )
}

export default Graph
