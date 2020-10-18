import React from 'react'
import {Map as LeafletMap, TileLayer, Circle, Popup} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import "./Map.css";

import {Card} from "@material-ui/core"

const casesTypeColors = {
  cases: {
    color: "#e74c3c",
    multiplier: 500
  },
  recovered: {
    color: "#2ecc71",
    multiplier: 1200
  },
  death: {
    color: "#bdc3c7",
    multiplier: 1600
  }
}

const showCircleAndInfo = (countries, casesType="cases") => (
  countries.map((country) => (
    <Circle 
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillColor={casesTypeColors[casesType].color}
      fillOpacity={0.4}
      color={casesTypeColors[casesType].color}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <h2>Im a Popup</h2>
      </Popup>
    </Circle>
  ))
)


function Map({countries, casesType, center, zoom}) {
  return (
    <Card className="map">
      <LeafletMap center={center} zoom={zoom}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors" 
        />
        {showCircleAndInfo(countries, casesType)}
      </LeafletMap>
    </Card>
  )
}

export default Map
