import React, { useState, useEffect, useCallback, useMemo } from "react";
import DateRangePicker from "./components/DateRangePicker";
import CovidTable from "./components/CovidTable";



const testCovidInfos = [
  {
    "dateRep" : "14/12/2020",
    "day" : "14",
    "month" : "12",
    "year" : "2020",
    "cases" : 746,
    "deaths" : 6,
    "countriesAndTerritories" : "Afghanistan",
    "geoId" : "AF",
    "countryterritoryCode" : "AFG",
    "popData2019" : 38041757,
    "continentExp" : "Asia",
    "Cumulative_number_for_14_days_of_COVID-19_cases_per_100000" : "9.01377925"
  },
  {
    "dateRep" : "25/05/2020",
    "day" : "25",
    "month" : "05",
    "year" : "2020",
    "cases" : 0,
    "deaths" : 0,
    "countriesAndTerritories" : "Aruba",
    "geoId" : "AW",
    "countryterritoryCode" : "ABW",
    "popData2019" : 106310,
    "continentExp" : "America",
    "Cumulative_number_for_14_days_of_COVID-19_cases_per_100000" : "0"
  },
  {
    "dateRep" : "29/06/2020",
    "day" : "29",
    "month" : "06",
    "year" : "2020",
    "cases" : 438,
    "deaths" : 5,
    "countriesAndTerritories" : "Bahrain",
    "geoId" : "BH",
    "countryterritoryCode" : "BHR",
    "popData2019" : 1641164,
    "continentExp" : "Asia",
    "Cumulative_number_for_14_days_of_COVID-19_cases_per_100000" : "436.33664887"
  },
];

function App() {

  const [minDate, setMinDate] = useState(new Date(2000, 0));
  const [maxDate, setMaxDate] = useState(new Date(2050, 0));

  const [startDate, setStartDate] = useState(new Date(2000, 0));
  const [endDate, setEndDate] = useState(new Date(2050, 0));
  
  const onStartDateChanged = (date) => setStartDate(date);
  const onEndDateChanged = (date) => setEndDate(date);

  const [covidInfos, SetCovidInfos] = useState(testCovidInfos);


  console.log("Render App");
  return (
    <div className="App container">
      <div className="row my-3">
        <DateRangePicker
          start={startDate}
          end={endDate}
          min={minDate}
          max={maxDate}
          onStartChanged={onStartDateChanged}
          onEndChanged={onEndDateChanged}
          firtsTitle={"Период от"}
          secondTitle={"до"}
        />
      </div>
      


      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link active" aria-current="Table" href="#">Таблица</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" aria-current="Chart" href="#">График</a>
        </li>
      </ul>


      <div className="row mx-0 border border-top-0">
        <div className="col">
          <div className="mx-3 my-3">
            <CovidTable covidInfos={covidInfos} startDate={startDate} endDate={endDate}/>
          </div>
        </div>
      </div>

      
    </div>
  );
}


export default App;
