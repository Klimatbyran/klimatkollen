/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from 'styled-components'
import DeckGL, { PolygonLayer, RGBAColor } from 'deck.gl'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import NextNProgress from 'nextjs-progressbar';

const INITIAL_VIEW_STATE = {
  longitude: 17.062927,
  latitude: 63,
  zoom: 3.5,
  minZoom: 3,
  pitch: 0,
  bearing: 0,
}

const DeckGLWrapper = styled.div`
  width: 100%;`

const getColor = (emission: number): RGBAColor => {
  const yellow: RGBAColor = [239, 191, 23]
  const orange: RGBAColor = [239, 153, 23]
  const darkOrange: RGBAColor = [239, 127, 23]
  const red: RGBAColor = [239, 94, 48]
  const pink: RGBAColor = [239, 48, 84]

  if (emission >= 0) {
    return pink
  }
  if (emission >= -0.01) {
    return red
  }
  if (emission >= -0.02) {
    return darkOrange
  }
  if (emission >= -0.03) {
    return orange
  }
  if (emission >= -0.1) {
    return yellow
  }

  return [145, 191, 200]
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

const MAP_RANGE = {
  lon: [8.107180004121693, 26.099158344940808],
  lat: [61.9, 63.9],
}

type Props = {
  emissionsLevels: Array<{ name: string; emissions: number }>
  children?: ReactNode
}

const Map = ({ emissionsLevels, children }: Props) => {
  const [municipalityData, setMunicipalityData] = useState<any>({})
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('/api/map')
      setMunicipalityData(response.data)
    }
    fetchData()
  }, [])

  const municipalityLines = municipalityData?.features?.map(({ geometry, properties }: { geometry: any, properties: any }) => {
    const name = replaceLetters(properties.name)
    const emissions = emissionsLevels.find((e) => e.name === name)?.emissions
    return {
      geometry: geometry.coordinates[0][0],
      name,
      emissions,
    }
  })

  type Emissions = {
    emissions: number
    name: string
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
    getFillColor: (d) => {
      return getColor((d as Emissions).emissions)
    },
    pickable: true,
  })

  return (
    <DeckGLWrapper>
      <NextNProgress
        color="#6BA292"
        startPosition={1}
        stopDelayMs={20}
        height={10}
        showOnShallow={true}
        options={{
          showSpinner: false
        }}
      />
      <DeckGL
        // touchAction="unset"
        initialViewState={INITIAL_VIEW_STATE}
        controller={{
          // Removed this to make desktop map zoomable
          // Wonder why it was set to false in first place tho
          // could be that it has to be reversed
          // scrollZoom: false
        }}
        getTooltip={({ object }) => object && {
          html: `<p>${(object as unknown as Emissions)?.name}</p>`,
          style: {
            backgroundColor: 'black',
            border: '1px solid white',
            borderRadius: '5px',
            fontSize: '0.6em'
          }
        }}
        // controller={{
        //   scrollZoom: true,
        //   dragPan: false,
        //   dragRotate: false,
        //   doubleClickZoom: true,
        //   touchZoom: false,
        //   touchRotate: false,

        //   keyboard: false,
        //   inertia: false,
        // }}
        onClick={({ object }) => {
          // IDK what the correct type is
          const name = (object as unknown as Emissions)?.name
          if (name) router.push(`/kommun/${replaceLetters(name).toLowerCase()}`)
        }}
        layers={[kommunLayer]}
      // FIXME needs to be adapted to mobile before reintroducing
      /*onViewStateChange={({ viewState }) => {
        viewState.longitude = Math.min(MAP_RANGE.lon[1], Math.max(MAP_RANGE.lon[0], viewState.longitude))
        viewState.latitude = Math.min(MAP_RANGE.lat[1], Math.max(MAP_RANGE.lat[0], viewState.latitude))
        return viewState
      }}*/
      />
      {children}
    </DeckGLWrapper>
  )
}

export default Map
