import React from 'react'
import numeral from "numeral";

import "./Table.css";

function Table({countries}) {
  return (
      <table className="table">
        <tbody>
          {countries.map(country => {
            return (
              <tr key={country.country}>
                <td>{country.country}</td>
                <td><strong>{numeral(country.cases).format("0,0")}</strong></td>
              </tr>
            )
          })}
        </tbody>
      </table>
  )
}

export default Table
