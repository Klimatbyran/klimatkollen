import styled from 'styled-components'
import DeckGL, { PolygonLayer } from 'deck.gl'
import municipalityData from '../pages/data/kommuner.json'
import { devices } from '../utils/devices'

const INITIAL_VIEW_STATE = {
  longitude: 17.062927,
  latitude: 62.134934,
  zoom: 3,
  minZoom: 3,
  pitch: 0,
  bearing: 0,
}

const MapDiv = styled.div`
  display: flex;
  left: 1rem;
  position: relative;
  margin-bottom: 1.5rem;

  @media only screen and (${devices.tablet}) {
    left: 10rem;
  }
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

  const getColor = (emission: number) => {
    const yellow = [239, 191, 23]
    const orange = [239, 153, 23]
    const darkOrange = [239, 127, 23]
    const red = [239, 71, 48]
    const pink = [239, 48, 84]

    if (emission > 0.03) {
      return pink
    }
    if (emission > 0.01) {
      return red
    }
    if (emission > 0) {
      return darkOrange
    }
    if (emission > -0.02) {
      return orange
    }
    if (emission > -0.04) {
      return yellow
    }

    return [239, 48, 84]
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
    getFillColor: (e: any) => {
      return getColor(e.emissions)
    },
    pickable: true,
  })

  type Emissions = {
    object: {
      emissions: number
      name: string
      geometry: [number, number][]
    }
  }

  return (
    <MapDiv>
      <DeckGL
        width="170px"
        height="380px"
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        onClick={({ object }: Emissions) => {
          console.log(object)
          return object?.name && setSelected(object.name)
        }}
        layers={[kommunLayer]}
      />
    </MapDiv>
  )
}

export default Map
