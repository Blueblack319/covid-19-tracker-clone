import React, { useEffect, useState } from 'react';
import './App.css';

import {FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";

import InfoBox from './InfoBox';
import Table from "./Table";
import { sortData } from './utils';
import LineGraph from './LineGraph';
import Map from "./Map";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState([37.0, 127.0]);
  const [mapZoom, setMapZoom] = useState(3);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(res => res.json())
    .then(resData => {
      setCountryInfo(resData);
    })
  }, [])

  useEffect(() => {
    const getCountries = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((res) => res.json())
      .then((resData) => {
        const countries = resData.map((resItem) => ({
          name: resItem.country,
          value: resItem.countryInfo.iso2,
        }));
        const sortedData = sortData(resData);
        setCountries(countries);
        setTableData(sortedData);
      });
    }
    getCountries();
  }, [])

  const handleCountryChanged = async (event) => {
    const countryCode = event.target.value;
    const url = countryCode === "Worldwide" ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
    .then(res => res.json())
    .then(resData => {
      setCountry(countryCode);
      setCountryInfo(resData);
      console.log(resData);
      if (countryCode !== "Worldwide"){
        setMapCenter([resData.countryInfo.lat, resData.countryInfo.long]);
        setMapZoom(4);
      }
    })
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={handleCountryChanged}>
              <MenuItem value="Worldwide" key="Worldwide">Worldwide</MenuItem>
              {countries.map((country) => <MenuItem value={country.value} key={country.name}>{country.name}</MenuItem>)}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
          <InfoBox title="Recovered Cases" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
          <InfoBox title="Death Cases" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
        </div>
        <Map center={mapCenter} zoom={mapZoom}/>
      </div>
      <Card className="app__right">
        <CardContent>
          <h2>Live Cases by Country</h2>
            <Table countries={tableData} />
          <h2>Worldwide new Cases</h2> 
            <LineGraph dataType="cases"/> 
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
