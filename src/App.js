import React, { useState, useEffect, useCallback } from "react";
import DateRangePicker from "./components/DateRangePicker";


function App() {
  useEffect(() => console.log("Render App"));

  const [minDate, setMinDate] = useState(new Date(2000, 11, 1));
  const [maxDate, setMaxDate] = useState(new Date(2050, 11, 1));

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [firstTitle, setFirstTitle] = useState("Период от");
  const [secondTitle, setSecondTitle] = useState("до");

  const onStartChanged = (date) => setStartDate(date);
  const onEndChanged = (date) => setEndDate(date);



  return (
    <div className="App">
      <DateRangePicker
        firstTitle={firstTitle}
        minDate={minDate}
        startDate={startDate}
        onStartChanged={onStartChanged}
        secondTitle={secondTitle}
        maxDate={maxDate}
        endDate={endDate}
        onEndChanged={onEndChanged}
      />
    </div>
  );
}


export default App;
