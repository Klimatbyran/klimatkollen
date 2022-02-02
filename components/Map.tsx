import { StaticMap } from 'react-map-gl'
import styled from 'styled-components'
import DeckGL, { PolygonLayer } from 'deck.gl'
import municipalityData from '../pages/data/kommuner.json'
const token = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: 17.062927,
  latitude: 62.134934,
  zoom: 3,
  // minZoom: 3,
  pitch: 0,
  bearing: 0,
}

const MapDiv = styled.div`
  top: 320px;
  position: absolute;
`

const bounds = [
  [11.262145749999114, 55.41681820697299], // Southwest
  [25.412536374999, 68.93488445226583], //Northeast
]

const Map = () => {
  console.log(token)

  const municipalityLines = municipalityData.features.map(({ geometry }) => ({
    geometry: geometry.coordinates[0][0],
  }))

  const kommunLayer = new PolygonLayer({
    id: 'polygon-layer',
    data: municipalityLines,
    stroked: true,
    filled: true,
    extruded: false,
    wireframe: false,
    lineWidthUtils: 'pixels',
    lineWidthMinPixels: 1,
    getLineWidth: 50,
    lineJointRounded: true,
    getElevation: 0,
    opacity: 0.3,
    polygonOffset: 1,
    getPolygon: (k: any) => k.geometry,
    getLineColor: () => [239, 48, 84],
    getFillColor: () => [239, 48, 84],
    pickable: true,
  })

  return (
    <MapDiv>
      <DeckGL
        width="160px"
        height="400px"
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        onClick={(e) => console.log(e)}
        layers={[kommunLayer]}>
        <StaticMap
          reuseMaps
          preventStyleDiffing={true}
          mapStyle="mapbox://styles/mikaelaalu/ckywnk9h6005515ldde5lpvc3"
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        />
      </DeckGL>
    </MapDiv>
  )
}

export default Map
