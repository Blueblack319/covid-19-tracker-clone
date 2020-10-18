import React, { useEffect, useState } from 'react';
import './App.css';

import {FormControl,
  Select,
  MenuItem 
} from "@material-ui/core"

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide")

  useEffect(() => {
    const getCountries = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((res) => res.json())
      .then((resData) => {
        const countries = resData.map((resItem) => ({
          name: resItem.country,
          value: resItem.countryInfo.iso2,
          key: resItem.countryInfo.iso3
        }))
        setCountries(countries)
      });
    }
    getCountries();
  }, [])

  const handleCountryChanged = (event) => {
    const countryCode = event.target.value;
    console.log(countryCode);
    setCountry(countryCode);
  }

  return (
    <div className="app">
      <div className="app__header">
        <h1>COVID-19 TRACKER</h1>
        <FormControl className="app__dropdown">
          <Select variant="outlined" value={country} onChange={handleCountryChanged}>
            <MenuItem value="Worldwide" key="WORLD">Worldwide</MenuItem>
            {countries.map((country) => <MenuItem value={country.value} key={country.name}>{country.name}</MenuItem>)}
          </Select>
        </FormControl>
      </div>
    </div>
  );
}

export default App;
