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

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

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
          key: resItem.countryInfo.iso3
        }));
        setCountries(countries);
        setTableData(resData);
      });
    }
    getCountries();
  }, [])

  const handleCountryChanged = async (event) => {
    const countryCode = event.target.value;
    const url = countryCode === "Worldwide" ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    console.log(countryCode, url);
    await fetch(url)
    .then(res => res.json())
    .then(resData => {
      setCountry(countryCode);
      setCountryInfo(resData)
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
      </div>
      <Card className="app__right">
        <CardContent>
          <h2>Live Cases by Country</h2>
            <Table countries={tableData} />
          <h2>Worldwide new Cases</h2>  
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
