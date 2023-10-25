/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from 'styled-components'
import DeckGL, { PolygonLayer, RGBAColor } from 'deck.gl'
import { ReactNode, useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import NextNProgress from 'nextjs-progressbar'
import { colorTheme } from '../../Theme'
import { DatasetType } from '../../utils/types'
import { mapColors } from '../shared'

const INITIAL_VIEW_STATE = {
  longitude: 17.062927,
  latitude: 63,
  zoom: 3.5,
  minZoom: 3,
  pitch: 0,
  bearing: 0,
}

const DeckGLWrapper = styled.div`
  height: 100%;
`

const hexToRGBA = (hex: string): RGBAColor => {
  const hexValue = hex.replace('#', '')
  const red = parseInt(hexValue.substring(0, 2), 16)
  const green = parseInt(hexValue.substring(2, 4), 16)
  const blue = parseInt(hexValue.substring(4, 6), 16)
  return [red, green, blue]
}

const getColor = (
  dataPoint: number | string,
  boundaries: number[] | string[],
): RGBAColor => {
  const lightBlue: RGBAColor = hexToRGBA(mapColors[5])
  const beige: RGBAColor = hexToRGBA(mapColors[4])
  const lightYellow: RGBAColor = hexToRGBA(mapColors[3])
  const darkYellow: RGBAColor = hexToRGBA(mapColors[2])
  const orange: RGBAColor = hexToRGBA(mapColors[1])
  const red: RGBAColor = hexToRGBA(mapColors[0])

  if (boundaries.length === 2) {
    return dataPoint === boundaries[0] ? red : lightBlue
  }

  // FIXME refactor plz
  if (boundaries[0] < boundaries[1]) {
    if (dataPoint >= boundaries[4]) {
      return lightBlue
    }
    if (dataPoint >= boundaries[3]) {
      return beige
    }
    if (dataPoint >= boundaries[2]) {
      return lightYellow
    }
    if (dataPoint >= boundaries[1]) {
      return darkYellow
    }
    if (dataPoint >= boundaries[0]) {
      return orange
    }
    return red
  }
  if (dataPoint >= boundaries[0]) {
    return red
  }
  if (dataPoint >= boundaries[1]) {
    return orange
  }
  if (dataPoint >= boundaries[2]) {
    return darkYellow
  }
  if (dataPoint >= boundaries[3]) {
    return lightYellow
  }
  if (dataPoint >= boundaries[4]) {
    return beige
  }
  return lightBlue
}

const replaceLetters = (name: string) => {
  let replacedWord = name

  if (replacedWord.includes('Ã¥')) {
    replacedWord = replacedWord.replace(/Ã¥/g, 'å')
  }
  if (replacedWord.includes('Ã¤')) {
    replacedWord = replacedWord.replace(/Ã¤/g, 'ä')
  }
  if (replacedWord.includes('Ã¶')) {
    replacedWord = replacedWord.replace(/Ã¶/g, 'ö')
  }
  if (replacedWord.includes('Ã…')) {
    replacedWord = replacedWord.replace(/Ã…/g, 'Å')
  }
  if (replacedWord.includes('Ã„')) {
    replacedWord = replacedWord.replace(/Ã„/g, 'Ä')
  }
  if (replacedWord.includes('Ã–')) {
    replacedWord = replacedWord.replace(/Ã–/g, 'Ö')
  }
  return replacedWord
}

// Use when viewState is reimplemented
/* const MAP_RANGE = {
  lon: [8.107180004121693, 26.099158344940808],
  lat: [61.9, 63.9],
} */

type Props = {
  data: Array<{ name: string; dataPoint: number | string }>
  dataType: DatasetType
  boundaries: number[] | string[]
  children?: ReactNode
}

function Map({
  data, dataType, boundaries, children,
}: Props) {
  const [municipalityData, setMunicipalityData] = useState<any>({})
  const router = useRouter()

  const [initialViewState, setInitialViewState] = useState(INITIAL_VIEW_STATE)

  // Update zoom based on window size
  const updateZoom = () => {
    let newZoom = 3.5
    const width = window.innerWidth

    if (width <= 768) {
      // Tablet or mobile
      newZoom = 3
    }

    setInitialViewState((prevState) => ({
      ...prevState,
      zoom: newZoom,
    }))
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('/api/map')
      setMunicipalityData(response.data)
    }
    fetchData()
  }, [])

  useEffect(() => {
    window.addEventListener('resize', updateZoom)
    updateZoom() // Initial call to set correct zoom

    // Cleanup
    return () => window.removeEventListener('resize', updateZoom)
  }, [])

  const municipalityLines = municipalityData?.features?.flatMap(
    ({ geometry, properties }: { geometry: any; properties: any }) => {
      const name = replaceLetters(properties.name)
      const dataPoint = data.find((e) => e.name === name)?.dataPoint

      if (geometry.type === 'MultiPolygon') {
        return geometry.coordinates.map((coords: any) => ({
          geometry: coords[0],
          name,
          dataPoint,
        }))
      }
      return [
        {
          geometry: geometry.coordinates[0][0],
          name,
          dataPoint,
        },
      ]
    },
  )

  type MunicipalityData = {
    name: string
    dataPoint: number
    dataType: DatasetType
    geometry: [number, number][]
  }

  const kommunLayer = new PolygonLayer({
    id: 'polygon-layer',
    data: municipalityLines,
    stroked: true,
    filled: true,
    extruded: false,
    wireframe: false,
    lineWidthUtils: 'pixels',
    lineWidthMinPixels: 0.5,
    getLineWidth: 80,
    lineJointRounded: true,
    getElevation: 0,
    polygonOffset: 1,
    getPolygon: (k: any) => k.geometry,
    getLineColor: () => [0, 0, 0, 80],
    getFillColor: (d) => getColor((d as MunicipalityData).dataPoint, boundaries),
    pickable: true,
  })

  const formatData = (object: unknown) => {
    // Fixme refactor
    const municipality = object as unknown as MunicipalityData
    let municipalityDataPoint = municipality?.dataPoint.toString()

    if (dataType === 'Binary') {
      const linkData = municipality?.dataPoint
      municipalityDataPoint = (boundaries as string[]).includes(linkData as unknown as string)
        ? 'Nej'
        : 'Ja'
    } else if (dataType === 'Percent') {
      if (municipality?.dataPoint !== undefined) {
        municipalityDataPoint = (municipality.dataPoint * 100).toFixed(1)
      } else {
        municipalityDataPoint = 'N/A'
      }
    } else {
      municipalityDataPoint = municipality?.dataPoint.toFixed(1)
    }

    return municipalityDataPoint
  }

  return (
    <DeckGLWrapper>
      <NextNProgress
        color={colorTheme.darkGreenOne}
        startPosition={0.3}
        stopDelayMs={20}
        height={5}
        showOnShallow={false}
        options={{
          showSpinner: false,
        }}
      />
      <DeckGL
        initialViewState={initialViewState}
        controller={{}}
        getTooltip={({ object }) => object && {
          html: `
          <p>${(object as unknown as MunicipalityData)?.name}: ${formatData(object)}</p>`,
          style: {
            backgroundColor: 'black',
            borderRadius: '5px',
            fontSize: '0.7em',
            color: colorTheme.offWhite,
          },
        }}
        onClick={({ object }) => {
          // IDK what the correct type is
          const name = (object as unknown as MunicipalityData)?.name
          if (name) router.push(`/kommun/${replaceLetters(name).toLowerCase()}`)
        }}
        layers={[kommunLayer]}
        // FIXME needs to be adapted to mobile before reintroducing
        /* onViewStateChange={({ viewState }) => {
        viewState.longitude = Math.min(MAP_RANGE.lon[1], Math.max(MAP_RANGE.lon[0], viewState.longitude))
        viewState.latitude = Math.min(MAP_RANGE.lat[1], Math.max(MAP_RANGE.lat[0], viewState.latitude))
        return viewState
      }} */
      />
      {children}
    </DeckGLWrapper>
  )
}

export default Map
