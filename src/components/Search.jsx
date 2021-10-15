import React, {useState} from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';


function Search({placeHolder, value, onChange}) {

    console.log("Render search component");
    return (
        <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder={placeHolder} value={value} onChange={onChange}/>
            <span className="input-group-text" id="basic-addon1">
                <i className="bi bi-search"/>
            </span>
        </div>
    );
}


export default Search;