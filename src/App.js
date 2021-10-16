import React, { useState, useEffect } from "react";
import DateRangePicker from "./components/DateRangePicker";
import CovidTable from "./components/CovidTable";
import {GetCovidInfoDate} from "./utils/covidInfoUtils";
import covidInfoData from "./components/covidInfos.json";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import CovidChart from "./components/CovidChart";
import { IsDateInRange } from "./utils/groupedCovidInfoUtils";


function App() {

  const [minDate, SetMinDate] = useState(new Date());
  const [maxDate, SetMaxDate] = useState(new Date());

  const [startDate, SetStartDate] = useState(new Date());
  const [endDate, SetEndDate] = useState(new Date(2050, 0));
  
  const onStartDateChanged = (date) => SetStartDate(date);
  const onEndDateChanged = (date) => SetEndDate(date);

  const [covidInfos, SetCovidInfos] = useState([]);
  const [tabKey, SetTabKey] = useState("table");

  useEffect(() => SetCovidInfos(covidInfoData.records), []);




  //#region Covid Infos Date Limits
  useEffect(() => {
    if (covidInfos === undefined || covidInfos === null || covidInfos.length === 0)
      return;

    const [min, max] = SetupCovidInfosDateLimits(covidInfos);
    SetMinDate(min);
    SetMaxDate(max);
    SetStartDate(min);
    SetEndDate(max);
  }, [covidInfos]);



  function SetupCovidInfosDateLimits(data) {
    if (covidInfos.length > 0) {
      let min = new Date(GetCovidInfoDate(data[0]));
      let max = new Date(GetCovidInfoDate(data[0]));

      for (var i = 1; i < data.length; i++)
      {
        // Find min date    
        if ((data[i].year < min.getUTCFullYear()) ||
          (data[i].year === min.getUTCFullYear() && (data[i].month - 1) < min.getUTCMonth()) ||
          (data[i].year === min.getUTCFullYear() && (data[i].month - 1) === min.getUTCMonth() && data[i].day < min.getUTCDate())) {
            min.setUTCFullYear(data[i].year, data[i].month - 1, data[i].day);
        }

        // Find max date
        if ((data[i].year > max.getUTCFullYear()) ||
          (data[i].year === max.getUTCFullYear() && (data[i].month - 1) > max.getUTCMonth()) ||
          (data[i].year === max.getUTCFullYear() && (data[i].month - 1) === max.getUTCMonth() && data[i].day > max.getUTCDate())) {
            max.setUTCFullYear(data[i].year, data[i].month - 1, data[i].day);
        }
      }

      return [min, max];
    }
    
    return undefined;
  }
  //#endregion





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
      




      <Tabs
        id="controlled-tab-example"
        activeKey={tabKey}
        onSelect={(k) => SetTabKey(k)}
      >
        <Tab eventKey="table" title="Таблица">
          <div className="row mx-0 border border-top-0">
            <div className="col mx-3 my-3">
              <CovidTable covidInfos={covidInfos} startDate={startDate} endDate={endDate}/>
            </div>
          </div>

        </Tab>
        <Tab eventKey="chart" title="График">
          <div className="row mx-0 border border-top-0">
              <div className="col">
                <CovidChart />
              </div>
          </div>
        </Tab>
      </Tabs>


      


      
    </div>
  );
}


export default App;
