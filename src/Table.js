import React from 'react'

import "./Table.css";

function Table({countries}) {
  return (
      <table className="table">
        <tbody>
          {countries.map(country => {
            return (
              <tr key={country.country}>
                <td>{country.country}</td>
                <td><strong>{country.cases}</strong></td>
              </tr>
            )
          })}
        </tbody>
      </table>
  )
}

export default Table
