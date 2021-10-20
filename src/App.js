import React, { useState, useEffect } from "react";
import useFetching from "./hooks/useFetching";

import CovidInfoService from "./API/CovidInfoService";

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Alert from "react-bootstrap/Alert";
import Loading from "./components/Loading";
import DateRangePicker from "./components/DateRangePicker";
import CovidTable from "./components/CovidTable";
import CovidChart from "./components/CovidChart";

import {GetCovidInfoDate} from "./utils/covidInfoUtils";
import { CompareDates } from "./utils/sortUtils";

import "./styles/loading.css";


function SetupCovidInfosDateLimits(infos) {
  if (infos === undefined || infos === null || infos.length === 0)
    return [new Date(), new Date()];

  let min = GetCovidInfoDate(infos[0]);
  let max = GetCovidInfoDate(infos[0]);
  let current;

  for (var i = 1; i < infos.length; i++)
  {
    current = GetCovidInfoDate(infos[i]);

    if (CompareDates(current, min) === -1)
      min = current;

    if (CompareDates(current, max) === 1)
      max = current;
  }

  return [min, max];
}


const DATE_RANGE_FIRST_TITLE = "Период от";
const DATE_RANGE_SECOND_TITLE = "до";

const TAB_TABLE_TITLE = "Таблица";
const TAB_CHART_TITLE = "График";


function App() {

  const [minDate, SetMinDate] = useState(new Date());
  const [maxDate, SetMaxDate] = useState(new Date());

  const [startDate, SetStartDate] = useState(new Date());
  const [endDate, SetEndDate] = useState(new Date());
  
  const onStartDateChanged = (date) => SetStartDate(date);
  const onEndDateChanged = (date) => SetEndDate(date);

  const [covidInfos, SetCovidInfos] = useState([]);
  const [tabKey, SetTabKey] = useState("table");


  //#region Fetching
  const [FetchCovidInfo, isCovidInfoLoading, fetchingCovidInfoError] = useFetching(async () => {
    const data = await CovidInfoService.GetData();
    SetCovidInfos(data);
  })


  useEffect(() => {
    FetchCovidInfo()
  }, []);
  //#endregion


  //#region Date Range & Limits Setup
  useEffect(() => {
    if (covidInfos === undefined || covidInfos === null || covidInfos.length === 0)
      return;

    const [min, max] = SetupCovidInfosDateLimits(covidInfos);
    SetMinDate(min);
    SetMaxDate(max);
    SetStartDate(min);
    SetEndDate(max);
  }, [covidInfos]);
  //#endregion


  //#region Renderers
  function RenderDateRange() {

    return (
      <div className="row my-3">
        <DateRangePicker
          start={startDate}
          end={endDate}
          min={minDate}
          max={maxDate}
          onStartChanged={onStartDateChanged}
          onEndChanged={onEndDateChanged}
          firtsTitle={DATE_RANGE_FIRST_TITLE}
          secondTitle={DATE_RANGE_SECOND_TITLE}
        />
      </div>
    );
  }


  function RenderTabs() {

    return (
      <Tabs
        id="controlled-tab-example"
        activeKey={tabKey}
        onSelect={(key) => SetTabKey(key)}
        unmountOnExit={false}
      >
        <Tab eventKey="table" title={TAB_TABLE_TITLE}>
          <div className="row mx-0 border border-top-0">
            <div className="col mx-3 my-3">
              {tabKey === "table" ? <CovidTable covidInfos={covidInfos} startDate={startDate} endDate={endDate}/> : null}
            </div>
          </div>
        </Tab>

        <Tab eventKey="chart" title={TAB_CHART_TITLE}>
          <div className="row mx-0 border border-top-0">
            <div className="col mb-3">
              {tabKey === "chart" ? <CovidChart covidInfos={covidInfos} startDate={startDate} endDate={endDate}/> : null}
            </div>
          </div>
        </Tab>
      </Tabs>
    );
  }


  function RenderMaster() {
    if (isCovidInfoLoading)
      return <Loading/>;
    else if (fetchingCovidInfoError !== "")
      return <Alert variant={"danger"} className="my-3 mx-3">{fetchingCovidInfoError}</Alert>;
    else
      return (
        <div className="container">
          {RenderDateRange()}
          {RenderTabs()}
        </div>
      );
  }
  //#endregion


  console.log("Render App");
  return (
      RenderMaster()
  );
}


export default App;
