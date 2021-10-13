import React, { useCallback, useEffect } from "react";
import DatePickerWithTitle from "./DatePickerWithTitle";


function DateRangePicker({firstTitle, minDate, startDate, onStartChanged, secondTitle, maxDate, endDate, onEndChanged}) {
    useEffect(() => console.log("Render DateRangePicker"));

    
    const dateStartPicker = useCallback(
        <DatePickerWithTitle currentDate={startDate} onChanged={onStartChanged} minDate={minDate} maxDate={maxDate} title={firstTitle} />
        ,
        [startDate, onStartChanged, minDate, maxDate, firstTitle]
    )
    return (
        <div className="row">
            {dateStartPicker}
            <DatePickerWithTitle currentDate={endDate} onChanged={onEndChanged} minDate={minDate} maxDate={maxDate} title={secondTitle} />
        </div>
    );

}


export default DateRangePicker;
