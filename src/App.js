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
import { sortData, prettyPrintStat } from './utils';
import LineGraph from './LineGraph';
import Map from "./Map";



function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState([37.0, 127.0]);
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

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
        setMapCountries(resData);
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
      if (countryCode !== "Worldwide"){
        setMapCenter([resData.countryInfo.lat, resData.countryInfo.long]);
        setMapZoom(4);
      }
    })
  }

  const handleInfoBoxClicked = (type) => {
    setCasesType(type);
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1 className="app__title">COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={handleCountryChanged}>
              <MenuItem value="Worldwide" key="Worldwide">Worldwide</MenuItem>
              {countries.map((country) => <MenuItem value={country.value} key={country.name}>{country.name}</MenuItem>)}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox 
            active={casesType === "cases"}
            title="Coronavirus Cases" 
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={prettyPrintStat(countryInfo.cases)} 
            clicked={handleInfoBoxClicked.bind(this, "cases")} 
            casesType="cases"
          />
          <InfoBox 
            active={casesType === "recovered"}
            title="Recovered Cases" 
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
            total={prettyPrintStat(countryInfo.recovered)} 
            clicked={handleInfoBoxClicked.bind(this, "recovered")}
            casesType="recovered"
          />
          <InfoBox 
            active={casesType === "deaths"}
            title="Death Cases" 
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
            total={prettyPrintStat(countryInfo.deaths)} 
            clicked={handleInfoBoxClicked.bind(this, "deaths")}
            casesType="deaths"
          />
        </div>
        <Map center={mapCenter} zoom={mapZoom} countries={mapCountries} casesType={casesType}/>
      </div>
      <Card className="app__right">
        <CardContent>
          <h2>Live Cases by Country</h2>
            <Table countries={tableData} />
          <h2 className="app__graphTitle">Worldwide new {casesType}</h2> 
            <LineGraph casesType={casesType}/> 
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
