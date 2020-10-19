import React, { useEffect, useState } from 'react'
import numeral from "numeral";
import {Line} from "react-chartjs-2";

const options = {
    legend: {
      display: false
    },
    elements: {
      point: {
        radius: 0,
      }
    },
    maintainAspectRadio: false,
    // responsive: true,
    tooltips:{
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (tooltipItem, data) {
          return numeral(tooltipItem.value).format("+0,0");
        },
      },
    },
    scales: {
    xAxes: [{
      type: "time",
    }],
    yAxes: [{
      gridLines: {
          display: false
      },
      ticks: {
        callback: function(value, index, values) {
            return numeral(value).format("0a");
        }
      }
    }]
  }
}

const buildData = (dataList) => {
    const builtData = [];
    let yesterdayData = null;
    for (let date in dataList){
        if(yesterdayData){
            builtData.push({
                x: date,
                y: dataList[date] - yesterdayData
            });
        }
        yesterdayData = dataList[date];
    }
    return builtData;
}

function LineGraph({casesType}) {
    const [data, setData] = useState({});
    const [datasets, setDatasets] = useState(null);

    useEffect(() => {
        const getData = async () => {
            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
            .then(res => res.json())
            .then(resData => {
                const pointList = buildData(resData[casesType]);
                setData(pointList);
            })
        }

        getData();
    },[casesType])

    useEffect(() => {
      if(data?.length > 0){
        if(casesType === "cases"){
          setDatasets({
            datasets: [
              {
                  backgroundColor: "rgba(204, 16, 52, 0.5)",
                  borderColor: "#CC1034",
                  data
              }
            ]
          })
        }else if(casesType === "recovered"){
          setDatasets({
            datasets: [
              {
                  backgroundColor: "rgba(46, 204, 113, 0.5)",
                  borderColor: "#2ecc71",
                  data
              }
            ]
          })
        }else{
          setDatasets({
            datasets: [
              {
                  backgroundColor: "rgba(189, 195, 199, 0.5)",
                  borderColor: "#bdc3c7",
                  data
              }
            ]
          })
        }
      }
    }, [data, casesType])

    return (
      <div className="lineGraph">
        {data?.length > 0 && datasets && <Line
          data={datasets}
          options={options}
          />
        }
      </div>
    )
}

export default LineGraph
