import React, { useCallback, useEffect } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";


function DatePickerWithTitle({currentDate, onChanged, minDate, maxDate, title}) {
    useEffect(() => console.log("Render DatePickerWithTitle"));

    return (
        <>
            <label className="col-sm col-form-label">{title}</label>
            <div className="col-sm">
                <DatePicker
                className="form-control"
                dateFormat="dd/MM/yyyy"
                selected={currentDate}
                onChange={onChanged}
                minDate={minDate}
                maxDate={maxDate}
            />
            </div>
        </>
    );
}


export default DatePickerWithTitle;
