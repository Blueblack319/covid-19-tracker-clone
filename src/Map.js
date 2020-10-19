import React from 'react'
import {Map as LeafletMap, TileLayer, Circle, Popup} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import "./Map.css";

import {Card} from "@material-ui/core"
import numeral from "numeral";

const casesTypeColors = {
  cases: {
    color: "#CA0B2F",
    multiplier: 500
  },
  recovered: {
    color: "#2ecc71",
    multiplier: 700
  },
  deaths: {
    color: "#bdc3c7",
    multiplier: 1600
  }
}

const showCircleAndInfo = (countries, casesType="cases") => (
  countries.map((country) => (
    <Circle 
      key={country.country}
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillColor={casesTypeColors[casesType].color}
      fillOpacity={0.4}
      color={casesTypeColors[casesType].color}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <div className="info">
          <div
            className="info__flag"
            style={{backgroundImage: `url(${country.countryInfo.flag})`}}
          />
          <div className="info__countryName">{country.country}</div>
          <div className="info__cases">Cases: {numeral(country.cases).format("0,0")}</div>
          <div className="info__recovered">Recovered: {numeral(country.recovered).format("0,0")}</div>
          <div className="info__deaths">Deaths: {numeral(country.deaths).format("0,0")}</div>
        </div>
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
