/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from 'styled-components'
import DeckGL, { PolygonLayer, RGBAColor } from 'deck.gl'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import NextNProgress from 'nextjs-progressbar'
import Link from 'next/link'
import { colorTheme } from '../../Theme'
import { mapColors } from '../shared'
import { deviceSizesPx } from '../../utils/devices'
import {
  MapProps, MunicipalityTapInfo, MunicipalityData, isMunicipalityData,
} from '../../utils/types'

const INITIAL_VIEW_STATE = {
  longitude: 17.062927,
  latitude: 63,
  zoom: 3.5,
  minZoom: 3,
  pitch: 0,
  bearing: 0,
}

const TOOLTIP_COMMON_STYLE = {
  backgroundColor: 'black',
  borderRadius: '5px',
  fontSize: '0.7em',
  color: colorTheme.offWhite,
}

const TOOLTIP_MOBILE_STYLE = {
  position: 'absolute',
  padding: '0.5em 1em',
  ...TOOLTIP_COMMON_STYLE,
} as React.CSSProperties // https://stackoverflow.com/questions/46710747

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
  boundaries: number[] | string[] | Date[],
): RGBAColor => {
  const colors: RGBAColor[] = mapColors.map(hexToRGBA)

  // Special case for binary KPIs
  if (boundaries.length === 2) {
    return dataPoint === boundaries[0] ? colors[0] : colors[colors.length - 1]
  }

  // Special case for invalid dates
  const invalidDate = (possibleDate: unknown) => possibleDate instanceof Date && Number.isNaN(possibleDate.getTime())
  if (invalidDate(dataPoint)) {
    return colors[colors.length - 1]
  }

  const ascending = boundaries[0] < boundaries[1]

  if (ascending) {
    for (let i = boundaries.length - 1; i >= 0; i -= 1) {
      if (dataPoint >= boundaries[i]) {
        return colors[i + 1]
      }
    }
    return colors[0]
  }

  for (let i = 0; i < boundaries.length; i += 1) {
    if (dataPoint >= boundaries[i]) {
      return colors[i]
    }
  }
  return colors[5]
}

const replaceLetters = (name: string): string => {
  const replacements: Record<string, string> = {
    'Ã¥': 'å',
    'Ã¤': 'ä',
    'Ã¶': 'ö',
    'Ã…': 'Å',
    'Ã„': 'Ä',
    'Ã–': 'Ö',
  }

  const regex = new RegExp(Object.keys(replacements).join('|'), 'g')

  return name.replace(regex, (match) => replacements[match])
}

// Use when viewState is reimplemented
/* const MAP_RANGE = {
  lon: [8.107180004121693, 26.099158344940808],
  lat: [61.9, 63.9],
} */

const generateMobileTooltip = (tInfo: MunicipalityTapInfo) => (
  <div>
    <Link href={`/kommun/${replaceLetters(tInfo.mData.name).toLowerCase()}`}>
      <p
        className="selected-feature-info"
        style={{ left: tInfo.x, top: tInfo.y, ...TOOLTIP_MOBILE_STYLE }}
      >
        {`${tInfo.mData.name}: ${tInfo.mData.formattedDataPoint}`}
      </p>
    </Link>
  </div>
)

function Map({
  data, boundaries, children,
}: MapProps) {
  const [municipalityFeatureCollection, setMunicipalityFeatureCollection] = useState<any>({})
  // "tapped" municipality tooltips are only to be used on mobile/tablet.
  // we do a best-effort attempt at checking for desktop use by hover and screen size.
  const [hasHovered, setHasHovered] = useState<boolean>(false)
  const [lastTapInfo, setLastTapInfo] = useState<MunicipalityTapInfo | null>(null)
  const router = useRouter()

  const [initialViewState, setInitialViewState] = useState(INITIAL_VIEW_STATE)

  // Update zoom based on window size
  const updateZoom = () => {
    let newZoom = 3.5
    const width = window.innerWidth

    if (width <= deviceSizesPx.tablet) {
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
      setMunicipalityFeatureCollection(response.data)
    }
    fetchData()
  }, [])

  useEffect(() => {
    window.addEventListener('resize', updateZoom)
    updateZoom() // Initial call to set correct zoom

    // Cleanup
    return () => window.removeEventListener('resize', updateZoom)
  }, [])

  const municipalityLines = municipalityFeatureCollection?.features?.flatMap(
    ({ geometry, properties }: { geometry: any; properties: any }) => {
      const name = replaceLetters(properties.name)
      const dataPoint = data.find((e) => e.name === name)?.dataPoint
      const formattedDataPoint = data.find((e) => e.name === name)?.formattedDataPoint

      if (geometry.type === 'MultiPolygon') {
        return geometry.coordinates.map((coords: any) => ({
          geometry: coords[0],
          name,
          dataPoint,
          formattedDataPoint,
        }))
      }
      return [
        {
          geometry: geometry.coordinates[0][0],
          name,
          dataPoint,
          formattedDataPoint,
        },
      ]
    },
  )

  const municipalityLayer = new PolygonLayer({
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
        getTooltip={({ object: mData }) => {
          setHasHovered(true) // if getTooltip is triggered, user must have hovered.
          setLastTapInfo(null)
          if (!isMunicipalityData(mData)) {
            return null
          }
          return {
            html: `
            <p>${mData.name}: ${(mData).formattedDataPoint}</p>`,
            style: TOOLTIP_COMMON_STYLE,
          }
        }}
        onClick={({ object: mData, x, y }) => {
          if (!isMunicipalityData(mData)) {
            setLastTapInfo(null)
            return
          }
          if (hasHovered) { // assume that desktop user only wants to change view if they've hovered
            router.push(`/kommun/${replaceLetters(mData.name).toLowerCase()}`)
            return
          }
          if (window.innerWidth <= deviceSizesPx.tablet) { // the user might be on desktop, but has not hovered yet, so use extra safeguard.
            setLastTapInfo({ x, y, mData }) // trigger mobile tooltip display
          }
        }}
        layers={[municipalityLayer]}
      // FIXME needs to be adapted to mobile before reintroducing
      /* onViewStateChange={({ viewState }) => {
      viewState.longitude = Math.min(MAP_RANGE.lon[1], Math.max(MAP_RANGE.lon[0], viewState.longitude))
      viewState.latitude = Math.min(MAP_RANGE.lat[1], Math.max(MAP_RANGE.lat[0], viewState.latitude))
      return viewState
    }} */
      />
      {
        lastTapInfo && generateMobileTooltip(lastTapInfo)
      }
      {children}
    </DeckGLWrapper>
  )
}

export default Map
