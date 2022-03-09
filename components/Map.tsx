import styled from 'styled-components'
import DeckGL, { PolygonLayer, RGBAColor } from 'deck.gl'
import municipalityData from '../pages/data/kommuner.json'
import { devices } from '../utils/devices'
import { WebMercatorViewport } from '@deck.gl/core'
import { ReactNode } from 'react'

const INITIAL_VIEW_STATE = {
  longitude: 17.062927,
  latitude: 63,
  zoom: 3,
  minZoom: 3,
  pitch: 0,
  bearing: 0,
}

const DeckGLWrapper = styled.div`
  position: relative;
  // TODO: Hardcoding this is not good.
  height: 380px;
  border: 1px solid #f9fbff;
  border-radius: 8px;

  @media only screen and (${devices.tablet}) {
    height: 500px;
  }
`

const getColor = (emission: number, name:string): RGBAColor => {
  const yellow: RGBAColor = [239, 191, 23]
  const orange: RGBAColor = [239, 153, 23]
  const darkOrange: RGBAColor = [239, 127, 23]
  const red: RGBAColor = [239, 94, 48]
  const pink: RGBAColor = [239, 48, 84]
  const green: RGBAColor = [145, 223, 200]


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
  if (emission >= -0.13) {

    //console.log(name + " " + emission)
    return yellow
  }

  //console.log(name + " " + emission)
  return green
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
  setSelected: (value: string) => void
  children: ReactNode
}

const Map = ({ emissionsLevels, setSelected, children }: Props) => {
  const municipalityLines = municipalityData.features.map(({ geometry, properties }) => {
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
    getLineColor: () => [0, 0, 0],
    getFillColor: (d) => {
      return getColor((d as Emissions).emissions, (d as Emissions).name)
    },
    pickable: true,
  })

  return (
    <DeckGLWrapper>
      <DeckGL
        touchAction="unset"
        initialViewState={INITIAL_VIEW_STATE}
        controller={{
          scrollZoom: true,
          dragPan: false,
          dragRotate: false,
          doubleClickZoom: true,
          touchZoom: false,
          touchRotate: false,

          keyboard: false,
          inertia: false,
        }}
        onClick={({ object }) => {
          console.log('test')
          // IDK what the correct type is
          const name = (object as unknown as Emissions)?.name
          console.log('name', name)
          name && setSelected(name)
        }}
        layers={[kommunLayer]}
        onViewStateChange={({ viewState }) => {
          viewState.longitude = Math.min(
            MAP_RANGE.lon[1],
            Math.max(MAP_RANGE.lon[0], viewState.longitude),
          )
          viewState.latitude = Math.min(
            MAP_RANGE.lat[1],
            Math.max(MAP_RANGE.lat[0], viewState.latitude),
          )
          return viewState
        }}
      />
      {children}
    </DeckGLWrapper>
  )
}

export default Map
