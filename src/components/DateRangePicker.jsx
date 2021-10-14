import React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function DateRangePicker({start, end, min, max, onStartChanged, onEndChanged, firtsTitle, secondTitle}) {



    return (
        <div className="row">
        <label className="col-md-auto col-form-label">{firtsTitle}</label>
        <div className="col-md-auto">
          <ReactDatePicker
            className="form-control"
            dateFormat="dd/MM/yyyy"
            selected={start}
            onChange={onStartChanged}
            minDate={min}
            maxDate={max}
          />
        </div>


        <label className="col-md-auto col-form-label">{secondTitle}</label>
        <div className="col-md-auto">
        <ReactDatePicker
          className="form-control"
          dateFormat="dd/MM/yyyy"
          selected={end}
          onChange={onEndChanged}
          minDate={min}
          maxDate={max}
        />
        </div>
      </div>
    );
}


export default DateRangePicker;
