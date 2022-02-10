import styled from 'styled-components'
import DeckGL, { PolygonLayer, RGBAColor } from 'deck.gl'
import municipalityData from '../pages/data/kommuner.json'
import { devices } from '../utils/devices'

const INITIAL_VIEW_STATE = {
  longitude: 17.062927,
  latitude: 63,
  zoom: 3.96,
  minZoom: 3,
  pitch: 0,
  bearing: 0,
}

const MapDiv = styled.div`
  padding: 2rem 0;
  // margin-bottom: 1.5rem;
`

const DeckGLWrapper = styled.div`
  position: relative;
  // TODO: Hardcoding this is not good.
  height: 380px;
  border: 1px solid #f9fbff;
  border-radius: 8px;
`

const bounds = [
  [11.262145749999114, 55.41681820697299], // Southwest
  [25.412536374999, 68.93488445226583], //Northeast
]

type Props = {
  emissionsLevels: Array<{ name: string; emissions: number }>
  setSelected: (value: string) => void
}
const Map = ({ emissionsLevels, setSelected }: Props) => {
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

  const municipalityLines = municipalityData.features.map(({ geometry, properties }) => {
    const name = replaceLetters(properties.name)
    return {
      geometry: geometry.coordinates[0][0],
      name,
      emissions: emissionsLevels.find((e) => e.name === name)?.emissions,
    }
  })

  const getColor = (emission: number): RGBAColor => {
    const yellow: RGBAColor = [239, 191, 23, 1]
    const orange: RGBAColor = [239, 153, 23, 1]
    const darkOrange: RGBAColor = [239, 127, 23]
    const red: RGBAColor = [239, 94, 48]
    const pink: RGBAColor = [239, 48, 84]
    const green: RGBAColor = [145, 223, 200]

    if (emission > 0) {
      return pink
    }
    if (emission > -0.02) {
      return red
    }
    if (emission > -0.04) {
      return darkOrange
    }
    if (emission > -0.07) {
      return orange
    }
    if (emission > -0.1) {
      return yellow
    }

    if (emission > -0.2) {
      return green
    }

    return [239, 48, 84]
  }

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
    // opacity: 0.3,
    polygonOffset: 1,
    getPolygon: (k: any) => k.geometry,
    getLineColor: () => [0, 0, 0],
    getFillColor: (d) => {
      return getColor((d as Emissions).emissions)
    },
    pickable: true,
  })

  // TODO: Use https://deck.gl/docs/api-reference/core/web-mercator-viewport to
  //       zoom in on the bounds of Sweden adjusted to the height of the map

  return (
    <MapDiv>
      <DeckGLWrapper>
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          onClick={({ object }) => {
            // IDK what the correct type is
            const name = (object as unknown as Emissions)?.name
            name && setSelected(name)
          }}
          layers={[kommunLayer]}
        />
      </DeckGLWrapper>
    </MapDiv>
  )
}

export default Map
