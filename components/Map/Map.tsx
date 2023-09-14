/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from 'styled-components'
import DeckGL, { PolygonLayer, RGBAColor } from 'deck.gl'
import { ReactNode, useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import NextNProgress from 'nextjs-progressbar'
import { colorTheme } from '../../Theme'
import { DatasetType } from '../../utils/types'

const INITIAL_VIEW_STATE = {
  longitude: 17.062927,
  latitude: 63,
  zoom: 3.5,
  minZoom: 3,
  pitch: 0,
  bearing: 0,
}

const DeckGLWrapper = styled.div`
  width: 100%;
`

const getColor = (
  dataPoint: number | string,
  boundaries: number[] | string[],
): RGBAColor => {
  const green: RGBAColor = [145, 223, 200]
  const blue: RGBAColor = [145, 191, 200]
  const yellow: RGBAColor = [239, 191, 23]
  const orange: RGBAColor = [239, 153, 23]
  const darkOrange: RGBAColor = [239, 127, 23]
  const red: RGBAColor = [239, 94, 48]
  const pink: RGBAColor = [239, 48, 84]

  if (boundaries.length === 2) {
    return dataPoint === boundaries[0] ? pink : green
  }

  // FIXME refactor plz
  if (boundaries[0] < boundaries[1]) {
    if (dataPoint >= boundaries[4]) {
      return blue
    }
    if (dataPoint >= boundaries[3]) {
      return yellow
    }
    if (dataPoint >= boundaries[2]) {
      return orange
    }
    if (dataPoint >= boundaries[1]) {
      return darkOrange
    }
    if (dataPoint >= boundaries[0]) {
      return red
    }
    return pink
  }
  if (dataPoint >= boundaries[0]) {
    return pink
  }
  if (dataPoint >= boundaries[1]) {
    return red
  }
  if (dataPoint >= boundaries[2]) {
    return darkOrange
  }
  if (dataPoint >= boundaries[3]) {
    return orange
  }
  if (dataPoint >= boundaries[4]) {
    return yellow
  }
  return blue
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

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('/api/map')
      setMunicipalityData(response.data)
    }
    fetchData()
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
    const municipality = object as unknown as MunicipalityData
    let dataString = municipality?.dataPoint.toString()

    if (dataType === 'Link') {
      const linkData = municipality?.dataPoint
      dataString = (boundaries as string[]).includes(linkData as unknown as string)
        ? 'Nej'
        : 'Ja'
    } else if (dataType === 'Percent') {
      if (municipality?.dataPoint !== undefined) {
        dataString = (municipality.dataPoint * 100).toFixed(1)
      } else {
        dataString = 'N/A'
      }
    }

    return dataString
  }

  return (
    <DeckGLWrapper>
      <NextNProgress
        color={colorTheme.dustyGreen}
        startPosition={0.3}
        stopDelayMs={20}
        height={5}
        showOnShallow={false}
        options={{
          showSpinner: false,
        }}
      />
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={{}}
        getTooltip={({ object }) => object && {
          html: `
          <p>${(object as unknown as MunicipalityData)?.name}: ${formatData(object)}</p>`,
          style: {
            backgroundColor: 'black',
            borderRadius: '5px',
            fontSize: '0.7em',
            color: 'white',
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
